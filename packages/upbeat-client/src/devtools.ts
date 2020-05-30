import { Schema } from '@upbeat/schema/src';
import { devToolEmitter } from './debug';
import { UpbeatClientConfig } from './types';

export interface UpbeatDevtool {
  getLogs(): any[];
  getResourceCache(): any;
  getSchema(): Schema;
}

export const createUpbeatDevtool = (
  schema: Schema,
  _config: UpbeatClientConfig,
): UpbeatDevtool => {
  const logItems: any[] = [];
  let logCount = 0;

  devToolEmitter.on('log', (name, subKey, content) => {
    logItems.push({ id: logCount++, name, subKey, content });
  });

  return {
    getLogs() {
      return logItems;
    },
    getResourceCache() {
      return 11;
    },
    getSchema() {
      return schema;
    },
  };
};
