import { Timestamp } from '../../upbeat-core/src/timestamp';
import { UpbeatId } from '../../upbeat-types/src';
import { OperationsFrom } from './crdt/utils';
import { MapType } from './crdt/types/Map';
import { CRDTTypes } from './crdt';

export interface ResourceOperation {
  id: string;
  resource: string;
  resourceId: UpbeatId;
  timestamp: Timestamp;
  operation: [OperationsFrom<typeof MapType>, ...OperationsFrom<CRDTTypes>[]];
}
