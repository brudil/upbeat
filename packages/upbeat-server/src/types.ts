import { UpbeatApp } from '@upbeat/types/src';
import { ClientRequest } from 'http';

type validateConnection = (request: ClientRequest) => Promise<false | string>;

export interface UpbeatServerConfig {
  validateConnection;
  app: UpbeatApp;
}

export interface UpbeatResolvers<C extends UpbeatApp, CM = C['modules']> {
  modules: {
    [M in keyof CM]: {
      // @ts-ignore
      [P in keyof CM[M]]: (i: CM[M][P][0]) => CM[M][P][1];
    };
  };
}
