import { UpbeatApp } from '@upbeat/types/src';

interface User {
  username: string;
  firstName: string;
  lastName: string;
}

export interface CueApp extends UpbeatApp {
  modules: {
    auth: {
      login: [{ username: string; password: string }, User];
    };
  };
}
