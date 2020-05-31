import React from 'react';
import JSONTree from 'react-json-tree';
import { UpbeatDevtool } from '@upbeat/client';
import { jsonTheme } from './theme';

export const ResourceCacheView: React.FC<{ devtool: UpbeatDevtool }> = ({
  devtool,
}) => {
  const cache = devtool.getResourceCache();

  const obj = Object.fromEntries(cache.entries());

  const byResource = Object.entries(obj).reduce(
    (prev: any, [id, item]: [string, any]) => {
      const [resource, resourceId] = id.split('#');

      return prev.hasOwnProperty(resource)
        ? { ...prev, [resource]: { ...prev[resource], [resourceId]: item } }
        : { ...prev, [resource]: { [resourceId]: item } };
    },
    {},
  );

  return (
    <div style={{ fontSize: '12px' }}>
      {Object.entries(byResource).map(([resource, items]: [string, any[]]) => (
        <div key={resource}>
          <h2>{resource}</h2>{' '}
          <JSONTree
            data={items}
            theme={jsonTheme}
            invertTheme={false}
            hideRoot={true}
          />
        </div>
      ))}
    </div>
  );
};
