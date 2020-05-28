/**
 * @packageDocumentation
 * @module @upbeat/server
 */

import { SerialisedResourceOperation } from '@upbeat/client/src/operations';

export enum ClientType {
  Message = 'Message',
  OperationSent = 'OperationSent',
}

export enum ServerType {
  Message = 'Message',
  OperationReceived = 'OperationReceived',
}

export interface Message {
  type: 'Message';
  body: string;
}

export interface User {
  displayName: string;
}

export interface OperationReceived {
  type: 'OperationReceived';
  operation: SerialisedResourceOperation;
}

export interface OperationSent {
  type: 'OperationSent';
  operation: SerialisedResourceOperation;
  roomId: string;
}

export interface Subscribe {
  type: 'SUBSCRIBE';
  channel: string;
}

export interface Unsubscribe {
  type: 'UNSUBSCRIBE';
  channel: string;
}

export type ClientSent = Message | OperationSent | Subscribe | Unsubscribe;

export type ServerSent = Message | OperationReceived;
