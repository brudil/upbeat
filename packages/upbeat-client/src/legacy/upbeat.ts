import { Cb } from '../types';
import { createUpbeatStore } from './store';
import NanoEvents from 'nanoevents';
import { UpbeatApp, UpbeatOp } from '@upbeat/types/src';
import uuid from 'uuid/v4';

type PromiseifyOperation<O extends UpbeatOp> = (
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
  const operationQueue: any = [];
  let ws: null | WebSocket = null;
  // manages auth; transport layer; subscriptions.

  const setupWs = async () => {
    const data = await fetch('http://localhost:8010/live', {
      method: 'post',
      credentials: 'include',
    }).then((res) => res.json());

    const w = new WebSocket(`${conf.uri}?token=${data.payload.token}`);
    w.onmessage = function(data: any) {
      const event = JSON.parse(data.data);
      emitter.emit(event.type, event);
    };

    w.onclose = () => {
      ws = null;
      setTimeout(() => setupWs().then((newWs) => (ws = newWs)), 2000);
    };

    return w;
  };

  const checkAuth = async () => {
    const auth = await fetch('http://localhost:8010/session', {
      method: 'post',
      credentials: 'include',
    }).then((res) => res.json());
    if (auth.payload.authenticated) {
      store.produce((draft) => {
        draft.auth.isAuthenticated = true;
        draft.auth.loading = false;
        draft.auth.credentials = auth.credidentials;
      });
      ws = await setupWs();
    } else {
      store.produce((draft) => {
        draft.auth.loading = false;
        draft.auth.isAuthenticated = false;
      });
    }
  };

  checkAuth();

  const runQueue = () => {
    if (operationQueue.length <= 0 || ws === null) {
      return;
    }

    const op = operationQueue.shift();
    ws.send(JSON.stringify(op));

    if (operationQueue.length > 0) {
      runQueue();
    }
  };

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
            operationQueue.push({
              operation: prop,
              args: args,
              id: uuid(),
            });

            runQueue();
          };
        },
      },
    ) as UpbeatOperationMap<A>,
  };
};
