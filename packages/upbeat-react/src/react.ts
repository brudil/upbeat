import React, { useContext, useEffect, useState } from 'react';
import { UpbeatClient } from '@upbeat/client/src/client';
import { Query } from '../../upbeat-client/src/types';

const UpbeatContext = React.createContext<UpbeatClient | null>(null);

const { Provider: UpbeatProvider, Consumer } = UpbeatContext;
export { UpbeatProvider, Consumer };

export const useUpbeat = (): UpbeatClient => {
  const upbeat = useContext(UpbeatContext);

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

export const useUpbeatState = (query: Query) => {
  const client = useUpbeat();
  const [data, setData] = useState(undefined);

  useEffect(() => {
    const unregister = client.createLiveQuery(query, setData);
    return () => {
      unregister();
    };
  }, [client]);

  return {
    loading: !data,
    data,
  };
};
