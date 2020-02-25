import { Query } from '../query';
import { IDBPDatabase } from 'idb';
import { UpbeatId } from '../../../upbeat-types/src';
import { ResourceOperation } from '../operations';

export interface UpbeatPersistence {
  /**
   * Performs the serialisable query on the backing persistence store.
   */
  runQuery(query: Query): Promise<any>;
  _UNSAFEDB: IDBPDatabase;

  /**
   * Fetches all operations for a single resource instance
   */
  getOperationsByResourceKey: (
    resourceName: string,
    id: UpbeatId,
  ) => Promise<ResourceOperation[]>;
}
