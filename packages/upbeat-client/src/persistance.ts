import { IDBPDatabase, openDB } from 'idb';
import { Schema } from '@upbeat/schema-parser/src/types';
import { Query } from './query';
const DB_NAME = 'UPBEAT-DEV';

interface UpbeatPersistence {
  runQuery(query: Query): Promise<any>;
}

function queryRunner(query: Query, db: IDBPDatabase): Promise<any> {
  return db.getAll(query.resourceName);
}

/*
 * Persistence.
 * */

export async function createIndexedDBPersistence(
  schema: Schema,
): Promise<UpbeatPersistence> {
  const db = await openDB(DB_NAME, 6, {
    upgrade(db, oldVersion, newVersion, transaction) {
      const logDb = db.createObjectStore('UpbeatOperations', { keyPath: 'id' });
      logDb.createIndex('resource', 'resource');
      logDb.createIndex('resourceId', 'resourceId');
      logDb.createIndex('property', 'property');
      logDb.createIndex('timestamp', 'timestamp');

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
        resourceDb.createIndex('tombstone', 'tombstone');
        resourceDb.createIndex('space', 'space');
      });

      Object.values(schema.spaces).forEach((space) => {
        const spaceDb = db.createObjectStore(`${space.identifier}Space`, {
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

  return {
    runQuery(query): Promise<any> {
      return queryRunner(query, db);
    },
  };
}
