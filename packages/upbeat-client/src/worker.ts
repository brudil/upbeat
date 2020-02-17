import { Schema } from '@upbeat/schema-parser/src/types';
import { createIndexedDBPersistence } from './persistance';
import { createHLCClock } from '@upbeat/core/src/timestamp';
import NanoEvents from 'nanoevents';
import uuid from 'uuid/v4';
import { Changeset } from './changeset';
import {
  createResourceCache,
  realiseIntermediateResourceMap,
} from './resourceCache';
import { constructObjectFromOperations } from './materialiser';
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

  // const x = await cache.getById('Todo', '005e72c7-66bf-494c-a168-8000b09ea6d4');
  // console.log(x);

  async function construct() {
    const ops = await persistence._UNSAFEDB.getAll('UpbeatOperations');
    const resourcesMap = await constructObjectFromOperations(
      schema.resources.Todo,
      ops,
    );

    return Object.values(realiseIntermediateResourceMap(resourcesMap));
  }

  function quickUpdateAll(localUpdate = true) {
    // Object.entries(liveIds).forEach(([id, query]) => query(db).then(result => emitter.emit('liveChange', [id, result])))
    Object.entries(liveIds).forEach(([id]) =>
      construct().then((result) => {
        emitter.emit('liveChange', [id, result]);

        if (localUpdate) {
          bc.postMessage('change');
        }
      }),
    );
  }

  async function addOperation(changeset: Changeset<unknown>) {
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
      const result = await construct();
      emitter.emit('liveChange', [id, result]);
    },
  };
}
