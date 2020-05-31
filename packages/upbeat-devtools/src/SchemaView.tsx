import React from 'react';
import JSONTree from 'react-json-tree';
import { jsonTheme } from './theme';
import { UpbeatDevtool } from '@upbeat/client';

export const SchemaView: React.FC<{ devtool: UpbeatDevtool }> = ({
  devtool,
}) => {
  return (
    <JSONTree
      data={devtool.getSchema()}
      theme={jsonTheme}
      invertTheme={false}
      hideRoot={true}
    />
  );
};
