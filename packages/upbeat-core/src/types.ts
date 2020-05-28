/**
 * @packageDocumentation
 * @module @upbeat/core
 */

import { Timestamp } from './timestamp';

export type UUID = string;

export interface GivenId {
  siteId: UUID;
  timestamp: Timestamp;
}

export const RootId = 'ROOT_ID';

export type Id = GivenId | 'ROOT_ID';

export interface Operation<V> {
  id: Id;
  locationId: Id;
  value: V;
}

export type OperationStart = Operation<null>;

export interface Node<A> {
  children: A[];
}

export interface Atom extends Node<Atom> {
  operation: Operation<unknown>;
}
