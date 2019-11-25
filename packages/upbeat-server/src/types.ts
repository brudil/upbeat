import { UpbeatApp, UpbeatOp } from '@upbeat/types/src';
import { ClientRequest } from 'http';

type ValidateConnection = (request: ClientRequest) => Promise<false | string>;

export interface UpbeatServerConfig {
  validateConnection: ValidateConnection;
  app: UpbeatApp;
}

type Resolver<O extends UpbeatOp> = (
  args: Parameters<O>,
  toolkit: any,
) => Promise<ReturnType<O>>;

export interface UpbeatOperationResolvers<
  C extends UpbeatApp,
  OM extends any = C['operations']
> {
  operations: {
    [P in keyof OM]: Resolver<OM[P]>;
  };
}
