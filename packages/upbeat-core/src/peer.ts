import { Id, Operation, UUID } from './types';
import { createHLCClock } from './timestamp';
import {
  CharOperationTypes,
  createStringPipeline,
  DeleteCharOperation,
  InsertCharOperation,
} from './structures/string';
import NanoEvents from 'nanoevents';
import uuid from 'uuid';

export interface Peer {
  createId(): Id;
  siteId: UUID;
  on: NanoEvents<any>['on'];
  receive(operation: Operation<any>): void;

  insertCharAt(index: number, char: string): void;
  removeCharAt(index: number): void;
  text: any;
  assembleString(): string;
}

export function createPeer(options: { debugSiteId?: string } = {}): Peer {
  const siteId: UUID = options.debugSiteId || uuid();
  const clock = createHLCClock(Date.now);
  const emitter = new NanoEvents<{
    send: Operation<any>;
  }>();

  const data = {
    text: createStringPipeline(),
  };

  const createId = (): Id => {
    return Object.freeze({
      siteId,
      timestamp: clock.now(),
    });
  };

  return {
    text: data.text,
    siteId,
    createId,
    on: emitter.on.bind(emitter),
    assembleString: data.text.getString,
    receive(operation: Operation<any>) {
      clock.update(operation.id.timestamp);
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
    removeCharAt(index) {
      const operation: DeleteCharOperation = {
        id: createId(),
        locationId: data.text.getLocationIdAtIndex(index),
        value: {
          type: CharOperationTypes.DELETE,
        },
      };

      data.text.ingress(operation);
      emitter.emit('send', operation);
    },
  };
}
