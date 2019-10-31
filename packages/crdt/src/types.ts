import { Timestamp } from './timestamp';

export type UUID = string;

export interface Id {
  siteId: UUID;
  timestamp: Timestamp;
}

export interface Operation<V> {
  id: Id;
  locationId: Id | null;
  value: V;
}

export type OperationStart = Operation<null>;

export interface Node<A> {
  children: A[];
}

export interface Atom extends Node<Atom> {
  operation: Operation<any>;
}
