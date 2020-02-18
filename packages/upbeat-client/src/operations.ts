import { Timestamp } from '../../upbeat-core/src/timestamp';

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

export type SetContainer<T> = ResourceOperation<
  SetAddOperation<T> | SetRemoveOperation<T>
>;
