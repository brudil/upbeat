import { Timestamp } from '../../upbeat-core/src/timestamp';
import { UpbeatId } from '../../upbeat-types/src';
import { OperationsFrom } from './crdt/utils';
import { CRDTTypes } from './crdt';

export interface ResourceOperation {
  timestamp: Timestamp;
  resource: string;
  resourceId: UpbeatId;
  operation: OperationsFrom<CRDTTypes>[];
}

export interface SerialisedResourceOperation {
  timestamp: string;
  resource: string;
  resourceId: UpbeatId;
  operation: OperationsFrom<CRDTTypes>[];
}
