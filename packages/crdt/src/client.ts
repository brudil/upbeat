import { Id, Operation, UUID } from './types';
import { HLC } from './timestamp';
import {
  CharOperationTypes,
  createStringPipeline,
  InsertCharOperation,
} from './structures/string';
import NanoEvents from 'nanoevents';
import uuid from 'uuid';

export interface Client {
  createId(): Id;
  siteId: UUID;
  on: NanoEvents<any>['on'];
  receive(operation: Operation<any>): void;

  insertCharAt(index: number, char: string);
  removeCharAt(index: number);
  text: any;
}

export function createClient(): Client {
  const siteId: UUID = uuid();
  const clock = new HLC(Date.now);
  const emitter = new NanoEvents<{
    send: Operation<any>;
  }>();

  const data = {
    text: createStringPipeline(),
  };

  const createId = (): Id => {
    return {
      siteId,
      timestamp: clock.now(),
    };
  };

  return {
    text: data.text,
    siteId,
    createId,
    on: emitter.on.bind(emitter),
    receive(operation: Operation<any>) {
      data.text.ingress(operation);
    },
    insertCharAt(index, char) {
      const operation: InsertCharOperation = {
        id: createId(),
        locationId: data.text.getLocationIdAtIndex(index),
        value: {
          type: CharOperationTypes.INSERT,
          contents: [char],
        },
      };

      data.text.ingress(operation);
      emitter.emit('send', operation);
    },
    removeCharAt(index) {},
  };
}
