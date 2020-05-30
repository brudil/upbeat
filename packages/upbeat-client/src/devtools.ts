import { Schema } from '@upbeat/schema/src';
import { devToolEmitter, UpbeatModule } from './debug';
import { UpbeatClientConfig } from './types';
import { createNanoEvents, Emitter } from 'nanoevents';
import { debounce } from 'ts-debounce';

interface LogItem {
  id: number;
  name: UpbeatModule;
  key: string;
  data: any;
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
): UpbeatDevtool => {
  const logItems: any[] = [];
  let logCount = 0;

  const emitter = createNanoEvents<ExternalEmitter>();
  const update = debounce(() => emitter.emit('update'), 100);

  devToolEmitter.on('log', (name, subKey, content) => {
    logItems.push({ id: logCount++, name, key: subKey, data: content });
    update();
  });

  return {
    emitter,
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
