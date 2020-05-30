/**
 * @packageDocumentation
 * @module @upbeat/client/operations
 */

import { Timestamp } from '../../upbeat-core/src/timestamp';
import { UpbeatId } from '../../upbeat-types/src';
import { OperationsFrom } from './crdt/utils';
import { CRDTTypes } from './crdt';

/**
 * Represents any single Operation.
 */
export interface ResourceOperation {
  timestamp: Timestamp;
  resource: string;
  resourceId: UpbeatId;
  operation: OperationsFrom<CRDTTypes>[];
}

/**
 * Represents any single Operation, with serialised timestamp.
 */
export interface SerialisedResourceOperation {
  timestamp: string;
  resource: string;
  resourceId: UpbeatId;
  operation: OperationsFrom<CRDTTypes>[];
}
