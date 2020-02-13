import { Resource, Schema } from '@upbeat/schema-parser/src/types';
import uuid from 'uuid/v4';
import NanoEvents from 'nanoevents';
import {
  createHLCClock,
  isLaterTimestamp,
  Timestamp,
} from '../../upbeat-core/src/timestamp';
import { UpbeatResource } from '../../upbeat-types/src';
import { startDatabase } from './persistance';
import { IDBPDatabase } from 'idb';

const bc = new BroadcastChannel('test_channel');

export type Query = (db: IDBPDatabase) => any;

interface Operation {
  id: string;
  resourceId: string;
  resource: string;
  property: string;
  value: unknown;
  timestamp: Timestamp;
}

interface TypedOperation<RN extends string, P extends string>
  extends Operation {
  resource: RN;
  property: P;
}

type ResourceCache<R> = Partial<{ [K in keyof R]: Operation }>;
type ResourceCacheMap<R> = { [id: string]: ResourceCache<R> };

async function createUpbeatWorker(schema: Schema) {
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

interface UpdateChangeset<R> {
  resource: string;
  id: string;
  properties: Partial<R>;
  action: 'UPDATE';
}

interface CreateChangeset<R> {
  resource: string;
  properties: Omit<Omit<R, 'id'>, '_type'>;
  action: 'CREATE';
}

type Changeset<R> = CreateChangeset<R> | UpdateChangeset<R>;

export function create<R extends UpbeatResource>(
  resourceName: R['_type'],
  properties: Omit<Omit<R, 'id'>, '_type'>,
): Changeset<R> {
  return {
    action: 'CREATE',
    properties,
    resource: resourceName,
  };
}

export function update<R extends UpbeatResource>(
  resourceName: R['_type'],
  id: string,
  properties: Partial<R>,
): Changeset<R> {
  return {
    action: 'UPDATE',
    properties,
    id,
    resource: resourceName,
  };
}

export async function createClient(schema: Schema) {
  const worker = await createUpbeatWorker(schema);

  const liveQueries: { [id: string]: { hook: any } } = {};
  worker.emitter.on('liveChange', ([id, data]) => {
    if (liveQueries.hasOwnProperty(id)) {
      liveQueries[id].hook(data);
    }
  });
  /*
   * What does upbeat client do?
   * We have two sides.
   * API and Worker.
   * App <-> Client <-> Worker <-> External data sources
   * The Worker can be run-inline or within a web worker for performance reasons.
   *
   * # The Client
   * The App issues two types of commands.
   * - Operations, which change data
   * - And queries, that read data.
   *
   * The client provides these two categories APIs
   *
   *
   *  # The Worker
   * The worker is in charge of persistence and ingress/egress to external sources.
   * Due to the ability to run within a webworker, the Client/Worker interop must be JSON serialisable.
   * TODO: Using the Schema types, we can re-hydrate objects that would be string serialised - such as dates
   *
   * The Worker manages a Database that is queryable.
   * The Database is created from operations on resources.
   * An entire log of these operations is also persisted.
   * These operations are then synced to different clients.
   * */

  return {
    createLiveQuery(query: Query, hook: any) {
      const id = uuid();

      worker.createLiveQuery(query, id);

      liveQueries[id] = {
        hook,
      };

      return () => {
        delete liveQueries[id];
      };
    },
    sendOperation(changeset: Changeset<unknown>) {
      console.log(
        `%cUpbeatOp%c ${changeset.resource}#${
          changeset.action === 'UPDATE' ? changeset.id : 'NEW'
        } ${JSON.stringify(changeset.properties)}`,
        'border-radius: 4px;padding: 1px 2px;font-weight: bold; color: white;background: black;',
        'font-weight: normal;',
      );
      worker.addOperation(changeset);
    },
  };
}
