import { Cb } from './types';
import { createUpbeatStore } from './store';
import NanoEvents from 'nanoevents';
import { UpbeatApp } from '@upbeat/types/src';
import uuid from 'uuid/v4';

type PromiseifyOperation<O extends M> = (
  ...args: Parameters<O>
) => Promise<{ data: ReturnType<O> }>;

type UpbeatOperationMap<
  A extends UpbeatApp,
  OM extends any = A['operations']
> = {
  [M in keyof OM]: PromiseifyOperation<OM[M]>;
};

export interface UpbeatInstance<A extends UpbeatApp> {
  getState(): any;
  storeSubscribe(cb: Cb): () => void;
  subscribe: NanoEvents<any>['on'];
  operation: UpbeatOperationMap<A>;
}

export interface UpbeatClientConf {
  uri: string;
}

export const createUpbeat = <A extends UpbeatApp>(
  conf: UpbeatClientConf,
): UpbeatInstance<A> => {
  const store = createUpbeatStore();
  const emitter = new NanoEvents<any>();

  const ws = new WebSocket(conf.uri);
  ws.onmessage = function(data: any) {
    const event = JSON.parse(data.data);
    emitter.emit(event.type, event);
  };
  // manages auth; transport layer; subscriptions.

  const checkAuth = async () => {
    const auth = await fetch('http://localhost:3001/session', {
      method: 'get',
    }).then((res) => res.json());
    if (auth.authenticated) {
      store.produce((draft) => {
        draft.auth.isAuthenticated = true;
        draft.auth.loading = false;
        draft.auth.credentials = auth.credidentials;
      });
    } else {
      store.produce((draft) => {
        draft.auth.loading = false;
      });
    }
  };

  checkAuth();

  return {
    getState() {
      return store.getState();
    },
    storeSubscribe: store.subscribe,
    subscribe: emitter.on.bind(emitter),
    operation: new Proxy(
      {},
      {
        get(obj, prop) {
          return (...args: any) => {
            console.log({ args, prop, obj });
            ws.send(
              JSON.stringify({
                operation: prop,
                args: args,
                id: uuid(),
              }),
            );
          };
        },
      },
    ) as UpbeatOperationMap<A>,
  };
};
