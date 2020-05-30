import { useEffect, useState } from 'react';
import { useUpbeat } from '@upbeat/react';

export const useUpdateOn = () => {
  const client = useUpbeat();

  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (client.devtool) {
      client.devtool.emitter.on('update', () => {
        forceUpdate((tick) => tick + 1);
      });
    }
  }, [client.devtool]);
};
