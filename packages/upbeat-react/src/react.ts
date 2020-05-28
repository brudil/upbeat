/**
 * @packageDocumentation
 * @module @upbeat/react
 */

import React, { useCallback, useContext, useEffect, useState } from 'react';
import { UpbeatClient } from '@upbeat/client/src/client';
import { QueryBuilder } from '@upbeat/client/src/query';
import { Changeset } from '@upbeat/client/src';

const UpbeatContext = React.createContext<UpbeatClient | null>(null);

const { Provider: UpbeatProvider, Consumer } = UpbeatContext;
export { UpbeatProvider, Consumer };

export const useUpbeat = (): UpbeatClient => {
  const upbeat = useContext<UpbeatClient | null>(UpbeatContext);

  if (upbeat === null) {
    throw new Error('No upbeat instance provided');
  }

  return upbeat;
};

// export const useUpbeatOperation = (createdOperation: any) => {
//   // todo
//   const upbeat = useUpbeat();
//   const symbol = Symbol('upbeat op');
//
//   return {
//     data: null,
//     perform(variables: any) {
//       upbeat.sendOperation(createdOperation, variables, symbol);
//     },
//   };
// };

export const useUpbeatQuery = <D = unknown>(
  query: QueryBuilder<unknown>,
): { loading: boolean; data: D | undefined } => {
  const client = useUpbeat();
  const [data, setData] = useState(undefined);

  useEffect(() => {
    const unregister = client.createLiveQuery(query.build(), setData);
    return () => {
      unregister();
    };
  }, []);

  return {
    loading: !data,
    data,
  };
};

type ReplaceReturnType<T extends (...a: any) => any, TNewReturn> = (
  ...a: Parameters<T>
) => TNewReturn;

export const useUpbeatChangeset = <R, A extends (...a: any) => Changeset<R>>(
  changesetFn: A,
): ReplaceReturnType<A, void> => {
  const client = useUpbeat();
  return useCallback((...args) => {
    client.applyChangeset(changesetFn(...(args as any)));
  }, []);
};
