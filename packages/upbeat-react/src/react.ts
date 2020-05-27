import React, { useContext, useEffect, useState } from 'react';
import { UpbeatClient } from '@upbeat/client/src/client';
import { QueryBuilder, QueryX } from '@upbeat/client/src/query';

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

export const useUpbeatState = <D = unknown>(
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
