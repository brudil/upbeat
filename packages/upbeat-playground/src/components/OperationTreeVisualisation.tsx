/**
 * @packageDocumentation
 * @module @upbeat/playground
 */

import React from 'react';
import Tree, { ReactD3TreeItem } from 'react-d3-tree';

export const OperationTreeVisualisation: React.FC<{
  tree: ReactD3TreeItem[] | ReactD3TreeItem;
}> = ({ tree }) => {
  return (
    <Tree
      data={tree}
      styles={{
        nodes: {
          node: {
            circle: {
              fill: '#52e2c5',
            },
            attributes: {
              stroke: '#000',
            },
          },
          leafNode: {
            circle: {
              fill: 'transparent',
            },
            attributes: {
              stroke: '#000',
            },
          },
        },
      }}
      transitionDuration={0}
    />
  );
};
