import { IDBPDatabase } from 'idb';
import { UpbeatId } from '../../../upbeat-types/src';
import { SerialisedResourceOperation } from '../operations';
import { SerialisedQuery } from '../query';

export interface UpbeatPersistence {
  /**
   * Performs the serialisable query on the backing persistence store.
   */
  runQuery(query: SerialisedQuery): Promise<any>;
  _UNSAFEDB: IDBPDatabase;

  /**
   * Fetches all operations for a single resource instance
   */
  getOperationsByResourceKey: (
    resourceName: string,
    id: UpbeatId,
  ) => Promise<SerialisedResourceOperation[]>;
  getAllOperations(): Promise<SerialisedResourceOperation[]>;
}
