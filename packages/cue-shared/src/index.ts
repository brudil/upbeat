import { UpbeatApp } from '@upbeat/types/src';

interface User {
  username: string;
  firstName: string;
  lastName: string;
}

export type LoginOperation = (username: string, password: string) => User;
export type EditOperation = (content: string) => string;

export interface CueAppOperations {
  loginAuth: LoginOperation;
  edit: EditOperation;
}

export interface CueApp extends UpbeatApp {
  operations: CueAppOperations;
}
