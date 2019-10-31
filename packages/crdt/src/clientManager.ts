import { Client } from './client';
import { Operation, UUID } from './types';

export enum ClientStatus {
  ONLINE,
  OFFLINE,
}

interface ClientContainer {
  client: Client;
  status: ClientStatus;
  operationQueue: Operation<any>[];
}

export function createClientManager() {
  const clients = new Map<UUID, ClientContainer>();

  const networkOperation = (client: Client, operation: any) => {
    clients.forEach((clientContainer) => {
      if (clientContainer.client.siteId !== client.siteId) {
        clientContainer.operationQueue.push(operation);
      }
    });
  };

  setInterval(() => {
    clients.forEach((clientContainer) => {
      if (clientContainer.operationQueue.length > 0) {
        clientContainer.client.receive(clientContainer.operationQueue.shift());
      }
    });
  }, 100);

  return {
    addClient(client: Client) {
      console.log(`client ${client.siteId} registered, they are ONLINE`);
      console.log(client);
      clients.set(client.siteId, {
        client,
        status: ClientStatus.ONLINE,
        operationQueue: [],
      });
      client.on('send', (operation) => {
        networkOperation(client, operation);
      });
    },
  };
}
