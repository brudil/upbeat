import { Schema } from '@upbeat/schema/src';
import { createIndexedDBPersistence } from './persistence';
import { createHLCClock } from '@upbeat/core/src/timestamp';
import NanoEvents from 'nanoevents';
import uuid from 'uuid/v4';
import { Changeset } from './changeset';
import { createResourceCache } from './resourceCache';
import { Query } from './query';

const bc = new BroadcastChannel('UPBEAT');

export async function createUpbeatWorker(schema: Schema) {
  const persistence = await createIndexedDBPersistence(schema);
  const clock = createHLCClock(Date.now);
  const cache = createResourceCache(persistence);
  const emitter = new NanoEvents<any>();

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
    const id = changeset.action === 'CREATE' ? uuid() : changeset.id;

    for (const [prop, value] of Object.entries(changeset.properties)) {
      const operation = {
        id: uuid(),
        resourceId: id,
        resource: changeset.resource,
        property: prop,
        value: value,
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
    async createLiveQuery(query: Query, id: string) {
      liveIds[id] = query;
      const result = await persistence.runQuery(query);
      emitter.emit('liveChange', [id, result]);
    },
  };
}
