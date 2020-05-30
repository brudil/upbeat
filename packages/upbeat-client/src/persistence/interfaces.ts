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

  /**
   * Deletes a resource object from the backing persistence store
   */
  deleteResourceObject(resourceName: string, resourceId: string): Promise<void>;

  /**
   * Creates or Updates a resource object from the backing persistence store
   */
  putResourceObject(resourceName: string, object: unknown): Promise<void>;

  /**
   * Appends an operation to the log. Returns false if it already exists.
   */
  appendOperation(operation: SerialisedResourceOperation): Promise<boolean>;

  /**
   * Fetches all operations for a single resource instance
   */
  getOperationsByResourceKey: (
    resourceName: string,
    id: UpbeatId,
  ) => Promise<SerialisedResourceOperation[]>;

  /**
   * Retrieves every single operation from the log. Expensive.
   */
  getAllOperations(): Promise<SerialisedResourceOperation[]>;
}
