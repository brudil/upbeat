import { Atom, Id, Operation, UUID } from './types';
import { createHLCClock } from './timestamp';
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
  assembleString(): string;
}

export function createClient(options: { debugSiteId?: string } = {}): Client {
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

  const assembleString = () => {
    let chars = [];

    const tree = (atoms: Atom[]) => {
      atoms.forEach((atom) => {
        if (atom.operation.value.type === CharOperationTypes.DELETE) {
          chars.pop();
        } else {
          chars = chars.concat(atom.operation.value.contents);
        }

        tree(atom.children);
      });
    };

    tree(data.text.operationTree.children);

    return chars.join('');
  };

  return {
    text: data.text,
    siteId,
    createId,
    on: emitter.on.bind(emitter),
    assembleString,
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

      // data.text.ingress(operation);
      emitter.emit('send', operation);
    },
    removeCharAt(index) {},
  };
}
