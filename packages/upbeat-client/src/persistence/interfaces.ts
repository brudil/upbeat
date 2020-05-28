/**
 * @packageDocumentation
 * @module @upbeat/client/persistence
 */

import { UpbeatId } from '../../../upbeat-types/src';
import { SerialisedResourceOperation } from '../operations';
import { SerialisedQuery } from '../query';

export interface UpbeatPersistence {
  /**
   * Performs the serialisable query on the backing persistence store.
   */
  runQuery(query: SerialisedQuery): Promise<any>;
  deleteResourceObject(resourceName: string, resourceId: string): Promise<void>;
  putResourceObject(resourceName: string, object: unknown): Promise<void>;
  appendOperation(operation: SerialisedResourceOperation): Promise<void>;
  /**
   * Fetches all operations for a single resource instance
   */
  getOperationsByResourceKey: (
    resourceName: string,
    id: UpbeatId,
  ) => Promise<SerialisedResourceOperation[]>;
  getAllOperations(): Promise<SerialisedResourceOperation[]>;
}
