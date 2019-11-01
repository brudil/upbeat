import NanoEvents from 'nanoevents';
import { Client } from './client';
import { Operation, UUID } from './types';

export enum ClientStatus {
  ONLINE,
  OFFLINE,
}

export interface ClientContainer {
  client: Client;
  status: ClientStatus;
  operationQueue: Operation<any>[];
}

export function createNetworkSimulator() {
  const clients = new Map<UUID, ClientContainer>();
  const operationLog: Operation<any>[] = [];
  const emitter = new NanoEvents<{
    tick: number;
  }>();
  let tickCount = 0;

  const networkOperation = (client: Client, operation: any) => {
    clients.forEach((clientContainer) => {
      // if (clientContainer.client.siteId !== client.siteId) {
      clientContainer.operationQueue.push(operation);
      // }
    });
  };

  setInterval(() => {
    tickCount = tickCount + 1;
    emitter.emit('tick', tickCount);
  }, 100);

  emitter.on('tick', () => {
    clients.forEach((clientContainer) => {
      if (
        clientContainer.operationQueue.length > 0 &&
        clientContainer.status === ClientStatus.ONLINE
      ) {
        const op = clientContainer.operationQueue.shift();
        setTimeout(
          () => clientContainer.client.receive(op),
          Math.round(Math.random() * 10) * 10,
        );
      }
    });
  });

  return {
    attachClient(client: Client) {
      clients.set(client.siteId, {
        client,
        status: ClientStatus.ONLINE,
        operationQueue: [],
      });
      client.on('send', (operation) => {
        operationLog.push(operation);
        networkOperation(client, operation);
      });
    },
    clients,
    operationLog,
    on: emitter.on.bind(emitter),
  };
}
