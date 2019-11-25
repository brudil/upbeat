import { Patch, produceWithPatches } from 'immer';
import NanoEvents from 'nanoevents';
import { Cb } from './types';

export interface Store {
  entities: {};
  transactions: [];
  auth: {
    isAuthenticated: boolean;
    credentials: null | {};
    loading: boolean;
  };
}

export const createUpbeatStore = () => {
  const emitter = new NanoEvents<{
    change: Store;
  }>();

  const patches: Patch[] = [];
  const inversePatches: Patch[] = [];

  let store: Store = {
    entities: {},
    transactions: [],
    auth: {
      isAuthenticated: true,
      loading: false,
      credentials: null,
    },
  };

  return {
    getState: () => store,
    subscribe(callback: Cb) {
      return emitter.on('change', callback);
    },
    produce(draft: (a: Store) => void) {
      const [
        nextState,
        producedPatches,
        producedInversePatches,
      ] = produceWithPatches(store, draft);
      store = nextState;
      patches.concat(producedPatches);
      inversePatches.concat(producedInversePatches);

      emitter.emit('change', nextState);
    },
  };
};
