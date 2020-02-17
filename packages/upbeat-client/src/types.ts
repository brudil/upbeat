import { Timestamp } from '../../upbeat-core/src/timestamp';
import { UpbeatId } from '../../upbeat-types/src';

export interface ResourceOperation<V> {
  type: 'LWWRO';
  id: string;
  resourceId: string;
  resource: string;
  property: string;
  value: V;
  timestamp: Timestamp;
}

export interface SetAddOperation<V> {
  type: 'ADD';
  value: V;
}

export interface SetRemoveOperation<V> {
  type: 'REMOVE';
  value: V;
}

export type Operation = ResourceOperation<unknown>;

export interface TypedOperation<RN extends string, P extends string>
  extends Operation {
  resource: RN;
  property: P;
}

type SetContainer<T> = ResourceOperation<
  SetAddOperation<T> | SetRemoveOperation<T>
>;

export interface IntermediateResource {
  id: UpbeatId;
  properties: {
    [property: string]: ResourceOperation<unknown> | SetContainer<unknown>;
  };
}
export type IntermediateResourceMap = { [id: string]: IntermediateResource };
