/**
 * @packageDocumentation
 * @module @upbeat/client/worker
 */

import { Schema } from '@upbeat/schema/src';
import { createIndexedDBPersistence } from './persistence/IndexedDbPersistence';
import {
  createHLCClock,
  createPeerId,
  parseTimestamp,
  serialiseTimestamp,
} from '@upbeat/core/src/timestamp';
import { createNanoEvents, Emitter } from 'nanoevents';
import { v4 as uuid } from 'uuid';
import { createResourceCache } from './resourceCache';
import { SerialisedQuery } from './query';
import { Changeset } from './changeset';
import { ResourceOperation, SerialisedResourceOperation } from './operations';
import { log } from './debug';
import { createTransports } from './transport';
import { build, diff, insert } from './merkle';
import { UpbeatClientConfig } from './types';

interface WorkerEmitter {
  liveChange(id: string, x: unknown): void;
}

interface UpbeatWorker {
  createLiveQuery(query: SerialisedQuery, id: string): Promise<void>;
  addOperation(changeset: Changeset<unknown>): Promise<void>;
  emitter: Emitter<WorkerEmitter>;
}
/**
 * UpbeatWorker handles most data/compute intensive operations for an
 * application.
 *
 * All communication to UpbeatWorker must be serialisable as we support it
 * running within a SharedWorker/WebWorker.
 */
export async function createUpbeatWorker(
  schema: Schema,
  config: UpbeatClientConfig,
): Promise<UpbeatWorker> {
  const bc = new BroadcastChannel('UPBEAT');

  const persistence = await createIndexedDBPersistence(schema);
  const clock = createHLCClock(createPeerId(), Date.now);
  const cache = createResourceCache(schema, persistence);
  const emitter = createNanoEvents<WorkerEmitter>();
  const transport = await createTransports(config.transport ?? []);
  const applicationQueue: SerialisedResourceOperation[] = [];

  // MERKLE EXPERIMENTZ
  const ops = await persistence.getAllOperations();
  let tree = build(ops.map((op) => parseTimestamp(op.timestamp)));
  log('Sync', 'NEW HASH', `${tree.hash}`);
  //console.log(JSON.stringify(tree.getHash()));
  //console.log(tree);

  const liveIds: {
    [id: string]: SerialisedQuery;
  } = {};

  /*
   * Dataflow.
   *
   * Live Query -> Query DB -> get ids of query -> if IDs in resourceCache
   *
   *
   * For the time being. NEW == re-query, UPDATE = resourceCache
   * */

  function quickUpdateAll(localUpdate = true): void {
    // Object.entries(liveIds).forEach(([id, query]) => query(db).then(result => emitter.emit('liveChange', [id, result])))
    Object.entries(liveIds).forEach(([id, query]) =>
      persistence.runQuery(query).then((result) => {
        emitter.emit('liveChange', id, result);

        if (localUpdate) {
          bc.postMessage('change');
        }
      }),
    );
  }

  async function applyOperation(operation: SerialisedResourceOperation) {
    try {
      await cache.applyOperation(operation);
      await persistence.appendOperation(operation);

      console.log(
        diff(tree, insert(tree, parseTimestamp(operation.timestamp))),
      );

      tree = insert(tree, parseTimestamp(operation.timestamp));

      // TRANSPORT OUT

      log('Sync', 'NEW HASH', `${tree.hash}`);
    } catch (e) {
      console.error(e);
    }

    quickUpdateAll();
  }

  async function createOperationAndApply(
    changeset: Changeset<unknown>,
  ): Promise<void> {
    // we get a changeset
    // we look at the schema
    // for each prop we defer to the schema given handler for that property (think deep)
    // this generates operations

    const id = changeset.action === 'CREATE' ? uuid() : changeset.id;

    for (const [prop, value] of Object.entries(changeset.properties)) {
      if (
        !schema.resources[changeset.resource].properties.hasOwnProperty(prop)
      ) {
        throw new Error(`given property does not exist in schema: ${prop}`);
      }

      // const type = schema.resources[changeset.resource].properties[prop].type;

      const operation: ResourceOperation = {
        resourceId: id,
        resource: changeset.resource,
        operation: [
          {
            type: 'SELECT',
            property: prop,
          },
          {
            value: value,
          },
        ],
        timestamp: clock.now(),
      };

      transport.forEach((t) =>
        t.send({
          type: 'OperationSent',
          operation: {
            ...operation,
            timestamp: serialiseTimestamp(operation.timestamp),
          },
          roomId: 'TBA',
        }),
      );
    }
  }

  transport.forEach((t) =>
    t.on('operation', async (operation: any) => {
      log('Transport', 'RECEIVED', 'applying operation from transport');
      applicationQueue.push(operation);
    }),
  );

  setInterval(async () => {
    while (applicationQueue.length > 0) {
      const op = applicationQueue.shift();
      if (op) {
        await applyOperation(op);
      }
    }
  }, 100);

  bc.onmessage = () => quickUpdateAll(false);

  /*
   * Our client <-> workerAPI.
   * ! This COULD run in a web worker, so all messaging
   * */
  return {
    emitter,
    addOperation: createOperationAndApply,
    async createLiveQuery(query, id) {
      liveIds[id] = query;
      const result = await persistence.runQuery(query);
      emitter.emit('liveChange', id, result);
    },
  };
}
