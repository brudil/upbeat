import { IDBPCursorWithValue, IDBPDatabase, openDB } from 'idb';
import { Schema } from '@upbeat/schema/src';
import { UpbeatPersistence } from './interfaces';
import { SerialisedResourceOperation } from '../operations';
import {
  OrderByConstraint,
  Query,
  SerialisedQuery,
  WhereConstraint,
} from '../query';
const DB_NAME = 'UPBEAT-DEV';

class QueryRunnerError extends Error {}

function meetsFilters(filters: WhereConstraint[], resource: any) {
  for (const filter of filters) {
    if (filter.comparator !== Query.Comparator.Equals) {
      throw new QueryRunnerError(
        `Comparator ${filter.comparator} not implemented`,
      );
    }

    if (resource[filter.property] !== filter.value) {
      return false;
    }
  }

  return true;
}

async function queryRunner(
  _schema: Schema,
  [resource, constraints]: SerialisedQuery,
  db: IDBPDatabase,
): Promise<any> {
  const operationNames = constraints.map((c) => c.name);
  const orderBy = constraints.find(
    (c) => c.name === 'ORDERBY',
  ) as OrderByConstraint;
  const direction = orderBy
    ? orderBy.direction === Query.Direction.ASC
      ? 'next'
      : 'prev'
    : 'next';

  const filters = constraints.filter(
    (c) => c.name === 'WHERE',
  ) as WhereConstraint[];

  const trx = db.transaction([`${resource}Resource`], 'readonly');
  const store = trx.objectStore(`${resource}Resource`);

  const indexName = orderBy ? orderBy.property : 'id';
  const index = store.index(indexName);

  // if (filters.length > 0) {
  //   const hasIndex = schema.resources[resource].keys.hasOwnProperty(`${indexName}_${filters.map(f => f.property).join('_')}`);
  //
  //   console.log('has index', hasIndex);
  //
  // }

  if (operationNames.includes('ALL')) {
    let cursorRequest = await index.openCursor(undefined, direction);
    if (!cursorRequest) {
      return [];
    }

    const items = [];
    while (cursorRequest) {
      if (meetsFilters(filters, cursorRequest.value)) {
        items.push(cursorRequest.value);
      }

      cursorRequest = await cursorRequest.continue();
    }

    return items;
  }

  // GET k:v - this is all. Additional filtering done in JS.

  // ALL; with single index.

  // OFFSET/PAGINATION; ? perhaps requires order by?

  // ORDER BY; single index.

  console.warn('Unimplemented query constraint!', constraints);
  return db.getAll(resource);
}

/**
 * Persistence via IndexedDB.
 */
export async function createIndexedDBPersistence(
  schema: Schema,
): Promise<UpbeatPersistence> {
  const db = await openDB(DB_NAME, 7, {
    upgrade(db) {
      const logDb = db.createObjectStore('UpbeatOperations', {
        keyPath: 'timestamp',
      });
      logDb.createIndex('resource', 'resource');
      logDb.createIndex('resourceId', 'resourceId');
      logDb.createIndex('property', 'property');
      logDb.createIndex('timestamp', 'timestamp');
      logDb.createIndex('resourceKey', ['resource', 'resourceId']);

      Object.values(schema.resources).forEach((resource) => {
        // Create a store for resource
        const resourceDb = db.createObjectStore(
          `${resource.identifier}Resource`,
          { keyPath: 'id' },
        );

        // Index the ID
        resourceDb.createIndex('id', 'id', {
          unique: true,
        });

        // Index the Space
        resourceDb.createIndex('space', 'space');

        // Index all properties
        Object.values(resource.properties).forEach((prop) => {
          resourceDb.createIndex(prop.identifier, prop.identifier, {
            unique: false,
          });
        });

        // Create all manually defined indexes
        Object.values(resource.keys).forEach((key) => {
          resourceDb.createIndex(key.identifier, key.identifiers, {
            unique: false,
          });
        });
      });

      Object.values(schema.spaces).forEach((space) => {
        db.createObjectStore(`${space.identifier}Space`, {
          keyPath: 'id',
        });
      });
    },
    blocked() {
      // …
    },
    blocking() {
      // …
    },
    terminated() {
      // …
    },
  });

  const all = async (c: IDBPCursorWithValue<any, any, any>) => {
    let cursor: IDBPCursorWithValue<any, any, any> | null = c;
    const arr: SerialisedResourceOperation[] = [];
    while (cursor) {
      arr.push(cursor.value);
      cursor = await cursor.continue();
    }

    return arr;
  };

  return {
    runQuery(query): Promise<any> {
      return queryRunner(schema, query, db);
    },
    _UNSAFEDB: db,
    getOperationsByResourceKey: async (resourceName, id) => {
      const range = IDBKeyRange.bound([resourceName, id], [resourceName, id]);
      const trx = db.transaction('UpbeatOperations', 'readonly');
      const index = trx.store.index('resourceKey');
      const cursor = await index.openCursor(range);
      if (cursor === null) {
        return [];
      }
      const ops = await all(cursor);
      await trx.done;
      return ops;
    },
    getAllOperations: async () => {
      return await db.getAllFromIndex('UpbeatOperations', 'timestamp');
    },
  };
}
