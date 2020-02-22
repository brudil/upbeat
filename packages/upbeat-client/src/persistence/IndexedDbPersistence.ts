import { IDBPCursor, IDBPDatabase, openDB } from 'idb';
import { Schema } from '@upbeat/schema/src';
import { Query } from '../query';
import { Operation } from '../operations';
import { UpbeatPersistence } from './interfaces';
const DB_NAME = 'UPBEAT-DEV';

function queryRunner(query: Query, db: IDBPDatabase): Promise<any> {
  return db.getAll(query.resourceName);
}

/**
 * Persistence via IndexedDB.
 */
export async function createIndexedDBPersistence(
  schema: Schema,
): Promise<UpbeatPersistence> {
  const db = await openDB(DB_NAME, 6, {
    upgrade(db) {
      const logDb = db.createObjectStore('UpbeatOperations', { keyPath: 'id' });
      logDb.createIndex('resource', 'resource');
      logDb.createIndex('resourceId', 'resourceId');
      logDb.createIndex('property', 'property');
      logDb.createIndex('timestamp', 'timestamp');
      logDb.createIndex('resourceKey', ['resource', 'resourceId']);

      Object.values(schema.resources).forEach((resource) => {
        const resourceDb = db.createObjectStore(
          `${resource.identifier}Resource`,
          { keyPath: 'id' },
        );
        Object.values(resource.properties).forEach((prop) => {
          resourceDb.createIndex(prop.identifier, prop.identifier, {
            unique: false,
          });
        });
        resourceDb.createIndex('space', 'space');
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

  const all = async (c: IDBPCursor) => {
    let cursor = c;
    const arr: Operation[] = [];
    while (cursor) {
      arr.push(cursor.value);
      cursor = await cursor.continue();
    }

    return arr;
  };

  return {
    runQuery(query): Promise<any> {
      return queryRunner(query, db);
    },
    _UNSAFEDB: db,
    getOperationsByResourceKey: async (resourceName, id) => {
      const range = IDBKeyRange.bound([resourceName, id], [resourceName, id]);
      const trx = db.transaction('UpbeatOperations', 'readonly');
      const index = trx.store.index('resourceKey');
      const cursor = await index.openCursor(range);
      const ops = await all(cursor);
      await trx.done;
      return ops;
    },
  };
}
