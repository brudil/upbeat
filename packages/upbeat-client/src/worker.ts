import { Schema } from '@upbeat/schema-parser/src/types';
import { createIndexedDBPersistence } from './persistance';
import { createHLCClock } from '@upbeat/core/src/timestamp';
import NanoEvents from 'nanoevents';
import uuid from 'uuid/v4';
import { Changeset } from './changeset';
import { normaliseResourceCacheMap } from './resourceCache';
import { constructObjectFromOperations } from './materialiser';
import { Query } from './query';

const bc = new BroadcastChannel('UPBEAT');

export async function createUpbeatWorker(schema: Schema) {
  const persistence = await createIndexedDBPersistence(schema);
  const clock = createHLCClock(Date.now);
  const emitter = new NanoEvents<any>();

  const liveIds: {
    [id: string]: Query;
  } = {};

  async function construct() {
    const ops = await persistence._UNSAFEDB.getAll('UpbeatOperations');
    const resourcesMap = await constructObjectFromOperations(
      schema.resources.Todo,
      ops,
    );

    return Object.values(normaliseResourceCacheMap(resourcesMap));
  }

  function quickUpdateAll() {
    // Object.entries(liveIds).forEach(([id, query]) => query(db).then(result => emitter.emit('liveChange', [id, result])))
    Object.entries(liveIds).forEach(([id]) =>
      construct().then((result) => {
        emitter.emit('liveChange', [id, result]);
        bc.postMessage('change');
      }),
    );
  }

  function addOperation(changeset: Changeset<unknown>) {
    const id = changeset.action === 'CREATE' ? uuid() : changeset.id;
    Object.entries(changeset.properties).forEach(([prop, value]) => {
      persistence._UNSAFEDB.add('UpbeatOperations', {
        id: uuid(),
        resourceId: id,
        resource: changeset.resource,
        property: prop,
        value: value,
        timestamp: clock.now(),
      });
    });
    quickUpdateAll();
  }

  bc.onmessage = () => quickUpdateAll();

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
