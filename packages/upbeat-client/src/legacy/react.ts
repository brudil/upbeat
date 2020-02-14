import React, { useContext, useEffect, useState } from 'react';
import { UpbeatInstance } from './upbeat';
import { UpbeatApp } from '@upbeat/types/src';

const UpbeatContext = React.createContext<UpbeatInstance<any> | null>(null);

const { Provider: UpbeatProvider, Consumer } = UpbeatContext;
export { UpbeatProvider, Consumer };

export const useUpbeat = <A extends UpbeatApp>(): UpbeatInstance<A> => {
  const upbeat = useContext(UpbeatContext);

  if (upbeat === null) {
    throw new Error('No upbeat instance provided');
  }

  return upbeat;
};

export const useUpbeatOperation = (createdOperation: any) => {
  // todo
  const upbeat = useUpbeat();
  const symbol = Symbol('upbeat op');

  return {
    data: null,
    perform(variables: any) {
      // @ts-ignore
      upbeat.operation(createdOperation, variables, symbol);
    },
  };
};

// @ts-ignore
export const useUpbeatState = <A>(query: (store) => A): A => {
  const upbeat = useUpbeat();
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    const unsubscribe = upbeat.storeSubscribe(() => forceUpdate(1));

    return unsubscribe;
  }, []);

  return upbeat.getState();
};
