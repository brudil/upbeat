import { Timestamp } from '../../upbeat-core/src/timestamp';
import { UpbeatId } from '../../upbeat-types/src';

export type Cb = (data: any) => void;

export interface Operation {
  id: string;
  resourceId: string;
  resource: string;
  property: string;
  value: unknown;
  timestamp: Timestamp;
}

export interface TypedOperation<RN extends string, P extends string>
  extends Operation {
  resource: RN;
  property: P;
}

export interface IntermediateResource {
  id: UpbeatId;
  properties: { [property: string]: Operation };
}
export type IntermediateResourceMap = { [id: string]: IntermediateResource };
