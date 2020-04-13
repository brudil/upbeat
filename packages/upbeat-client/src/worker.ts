import { Schema } from '@upbeat/schema/src';
import { createIndexedDBPersistence } from './persistence/IndexedDbPersistence';
import { createHLCClock } from '@upbeat/core/src/timestamp';
import NanoEvents from 'nanoevents';
import uuid from 'uuid/v4';
import { createResourceCache } from './resourceCache';
import { Query } from './query';
import { Changeset } from './changeset';
import { ResourceOperation } from './operations';

interface WorkerEmitter {
  liveChange: [string, any];
}

interface UpbeatWorker {
  createLiveQuery(query: Query, id: string): Promise<void>;
  addOperation(changeset: Changeset<unknown>): Promise<void>;
  emitter: NanoEvents<WorkerEmitter>;
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
): Promise<UpbeatWorker> {
  const bc = new BroadcastChannel('UPBEAT');

  const persistence = await createIndexedDBPersistence(schema);
  const clock = createHLCClock(Date.now);
  const cache = createResourceCache(schema, persistence);
  const emitter = new NanoEvents<WorkerEmitter>();

  const liveIds: {
    [id: string]: Query;
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
        emitter.emit('liveChange', [id, result]);

        if (localUpdate) {
          bc.postMessage('change');
        }
      }),
    );
  }

  async function addOperation(changeset: Changeset<unknown>): Promise<void> {
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
        id: uuid(),
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

      try {
        await cache.applyOperation(operation);
        await persistence._UNSAFEDB.add('UpbeatOperations', operation);
      } catch (e) {
        console.error(e);
      }
    }

    quickUpdateAll();
  }

  bc.onmessage = () => quickUpdateAll(false);

  /*
   * Our client <-> workerAPI.
   * ! This COULD run in a web worker, so all messaging
   * */
  return {
    emitter,
    addOperation,
    async createLiveQuery(query, id) {
      liveIds[id] = query;
      const result = await persistence.runQuery(query);
      emitter.emit('liveChange', [id, result]);
    },
  };
}
