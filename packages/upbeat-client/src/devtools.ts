import { Schema } from '@upbeat/schema/src';
import { devToolEmitter, ModuleNames } from './debug';
import { UpbeatClientConfig } from './types';
import { createNanoEvents, Emitter } from 'nanoevents';
import { debounce } from 'ts-debounce';
import { UpbeatWorker } from './worker';

export interface LogItem {
  id: number;
  name: ModuleNames;
  key: string;
  data: any;
  withEnd: boolean;
}

interface ExternalEmitter {
  update(): void;
}

export interface UpbeatDevtool {
  getLogs(): LogItem[];
  getResourceCache(): any;
  getSchema(): Schema;
  emitter: Emitter<ExternalEmitter>;
}

export const createUpbeatDevtool = (
  schema: Schema,
  _config: UpbeatClientConfig,
  worker: UpbeatWorker,
): UpbeatDevtool => {
  const logItems: any[] = [];
  let logCount = 0;

  const emitter = createNanoEvents<ExternalEmitter>();
  const update = debounce(() => emitter.emit('update'), 100);

  devToolEmitter.on('log', (name, subKey, content, withEnd) => {
    logItems.push({
      id: logCount++,
      name,
      key: subKey,
      data: content,
      withEnd,
    });
    update();
  });

  return {
    emitter,
    getLogs() {
      return logItems;
    },
    getResourceCache() {
      return worker.devtool.cache.getCache();
    },
    getSchema() {
      return schema;
    },
  };
};
