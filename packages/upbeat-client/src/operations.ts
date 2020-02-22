import { Timestamp } from '../../upbeat-core/src/timestamp';

export interface BaseOperation {
  id: string;
  resourceId: string;
  resource: string;
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
export interface SetSelectOperation<V> {
  type: 'SELECT';
  value: V;
}

export type Operation = ResourceOperation<unknown>;

export interface TypedOperation<RN extends string, P extends string>
  extends Operation {
  resource: RN;
  property: P;
}

export type SetOperations<T> =
  | SetAddOperation<T>
  | SetRemoveOperation<T>
  | SetSelectOperation<T>;
