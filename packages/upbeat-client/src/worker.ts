import { Resource, Schema } from '@upbeat/schema-parser/dist/src/types';
import { startDatabase } from './persistance';
import {
  createHLCClock,
  isLaterTimestamp,
} from '../../upbeat-core/src/timestamp';
import NanoEvents from 'nanoevents';
import { UpbeatResource } from '../../upbeat-types/src';
import uuid from 'uuid/v4';
import {
  Query,
  ResourceCache,
  ResourceCacheMap,
  TypedOperation,
} from './types';
import { Changeset } from './changeset';

const bc = new BroadcastChannel('UPBEAT');

export async function createUpbeatWorker(schema: Schema) {
  const db = await startDatabase(schema);
  const clock = createHLCClock(Date.now);
  const emitter = new NanoEvents<any>();

  const liveIds = {};

  async function constructObjectFromOperations<R extends UpbeatResource>(
    resourceSchema: Resource,
    operations: TypedOperation<R['_type'], Extract<keyof R, string>>[],
  ): Promise<ResourceCacheMap<R>> {
    const resources: ResourceCacheMap<R> = {};

    operations.forEach((op) => {
      if (!resources.hasOwnProperty(op.resourceId)) {
        resources[op.resourceId] = {};
      }

      const resource = resources[op.resourceId];
      const timestamp = resource[op.property]?.timestamp;
      if (
        !timestamp ||
        (timestamp && isLaterTimestamp(op.timestamp, timestamp))
      ) {
        resource[op.property] = op;
      }
    });

    return resources;
  }

  function normaliseResourceCache<R>(resourceCache: ResourceCache<R>) {
    return Object.keys(resourceCache).reduce(
      (obj, key) => ({ ...obj, [key]: resourceCache[key].value }),
      {},
    );
  }

  function normaliseResourceCacheMap<R>(map: ResourceCacheMap<R>) {
    return Object.keys(map).reduce(
      (obj, key) => ({
        ...obj,
        [key]: { id: key, ...normaliseResourceCache(map[key]) },
      }),
      {},
    );
  }

  async function construct() {
    const ops = await db.getAll('UpbeatOperations');
    const resourcesMap = await constructObjectFromOperations(
      schema.resources.Todo,
      ops,
    );

    return Object.values(normaliseResourceCacheMap(resourcesMap));
  }

  function quickUpdateAll() {
    // Object.entries(liveIds).forEach(([id, query]) => query(db).then(result => emitter.emit('liveChange', [id, result])))
    Object.entries(liveIds).forEach(([id, query]) =>
      construct().then((result) => {
        emitter.emit('liveChange', [id, result]);
        bc.postMessage('change');
      }),
    );
  }

  function addOperation(changeset: Changeset<unknown>) {
    const id = changeset.action === 'CREATE' ? uuid() : changeset.id;
    Object.entries(changeset.properties).forEach(([prop, value]) => {
      db.add('UpbeatOperations', {
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
