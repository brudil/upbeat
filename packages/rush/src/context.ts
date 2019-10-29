import React, { useContext } from 'react';
import { RushInstance } from './rush';

const RushContext = React.createContext<RushInstance | null>(null);

const { Provider: RushProvider, Consumer } = RushContext;
export { RushProvider, Consumer };

export const useRush = (): RushInstance => {
  const rush = useContext(RushContext);

  if (rush === null) {
    throw new Error('No rush instance provided');
  }

  return rush;
};

export const useRushOperation = (createdOperation: any) => {
  // todo
  const rush = useRush();
  const symbol = Symbol('rush op');

  return {
    data: null,
    perform(variables: any) {
      // @ts-ignore
      rush.operation(createdOperation, variables, symbol);
    },
  };
};

// @ts-ignore
export const useRushState = <A>(query: (store) => A): A => {
  const rush = useRush();

  return rush.read();
};
