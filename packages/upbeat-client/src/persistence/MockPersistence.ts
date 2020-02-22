import { Schema } from '@upbeat/schema/src';
import { UpbeatPersistence } from './interfaces';

/**
 * Persistence via InMemoryMocking.
 */
export async function createIndexedDBPersistence(
  schema: Schema,
): Promise<UpbeatPersistence> {
  return {
    runQuery(query): Promise<any> {
      return 1;
    },
    _UNSAFEDB: db,
    getOperationsByResourceKey: async (resourceName, id) => {
      return 1;
    },
  };
}
