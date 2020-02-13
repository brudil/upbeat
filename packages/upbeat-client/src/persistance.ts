import { openDB } from 'idb';
import { Schema } from '@upbeat/schema-parser/src/types';
const DB_NAME = 'UPBEAT-DEV';

export async function startDatabase(schema: Schema) {
  return await openDB(DB_NAME, 6, {
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
}
