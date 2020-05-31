/**
 * @packageDocumentation
 * @module @upbeat/client/transport
 */

import { createNanoEvents, Unsubscribe } from 'nanoevents';
import { SerialisedResourceOperation } from './operations';
import { log } from './debug';
import { UpbeatTransportConfig, UpbeatTransportWebSocketConfig } from './types';

interface WorkerEmitter {
  operation(op: SerialisedResourceOperation): void;
}

/**
 * Public API for Upbeat Transport middleware.
 */
export interface UpbeatTransport {
  /**
   * Send a message.
   */
  send(message: any): any;

  /**
   * Emitter for receiving messages.
   */
  on<K extends keyof WorkerEmitter>(
    event: K,
    cb: WorkerEmitter[K],
  ): Unsubscribe;
}

export const createUpbeatTransportWebSocket = async (
  _config: UpbeatTransportWebSocketConfig,
): Promise<UpbeatTransport> => {
  let ws: WebSocket | null = null;
  const emitter = createNanoEvents<WorkerEmitter>();

  const setupWs = async () => {
    // const data = await fetch('http://localhost:8010/live', {
    //   method: 'post',
    //   credentials: 'include',
    // }).then((res) => res.json());

    const w = new WebSocket(
      `ws://localhost:8009/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkbiI6IlNpbW9uIiwidXNlcklkIjoiMjIiLCJpYXQiOjE1MTYyMzkwMjJ9.ipRr9pszD7sXJO1DWy6JqE6SgrcB_VisrynkbUFl5yA`,
    ); //${data.payload.token}
    w.onmessage = function (data: any) {
      const event = JSON.parse(data.data);
      emitter.emit('operation', event.operation);
    };

    w.onclose = () => {
      ws = null;
      log('Transport', 'Lost', 'Retrying in 2000ms');
      setTimeout(() => setupWs().then((newWs) => (ws = newWs)), 2000);
    };

    return w;
  };

  ws = await setupWs();

  const send = (message: any) => {
    if (ws && ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(message));
      log('Transport', 'Send', JSON.stringify(message));
    } else {
      log('Worker', 'Queue', 'Message queued for send until connection.');
      setTimeout(() => send(message), 50);
    }
  };

  send({ type: 'SUBSCRIBE', channel: 'live/TBA' });

  return {
    send,
    on(event, cb) {
      return emitter.on(event, cb);
    },
  };
};

export const createTransports = async (
  config: UpbeatTransportConfig[],
): Promise<UpbeatTransport> => {
  const emitter = createNanoEvents<WorkerEmitter>();
  const transports: UpbeatTransport[] = [];
  for (const transport of config) {
    switch (transport.name) {
      case 'intertab':
        continue;
      case 'ws':
        transports.push(await createUpbeatTransportWebSocket(transport));
    }
  }

  transports.forEach((t) => {
    t.on('operation', (operation) => {
      emitter.emit('operation', operation);
    });
  });

  return {
    send(operation) {
      transports.forEach((t) =>
        t.send({
          type: 'OperationSent',
          operation: operation,
          roomId: 'TBA',
        }),
      );
    },
    on(event, cb) {
      return emitter.on(event, cb);
    },
  };
};
