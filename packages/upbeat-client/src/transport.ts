import { createNanoEvents, Emitter } from 'nanoevents';
import { SerialisedResourceOperation } from './operations';
import { log } from './debug';
import { UpbeatTransportConfig, UpbeatTransportWebSocketConfig } from './types';

interface UpbeatTransport {
  ws: WebSocket;
  send(message: any): any;
  on: Emitter<WorkerEmitter>['on'];
}

interface WorkerEmitter {
  operation: [string, SerialisedResourceOperation];
}

export const createUpbeatTransportWebSocket = async (
  config: UpbeatTransportWebSocketConfig,
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
      log('Transport', 'lost', 'Retrying in 2000ms');
      setTimeout(() => setupWs().then((newWs) => (ws = newWs)), 2000);
    };

    return w;
  };

  ws = await setupWs();

  const send = (message: any) => {
    if (ws && ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(message));
      log('Transport', 'SEND', JSON.stringify(message));
    } else {
      log('Transport', 'QUEUE', 'Message queued for send until connection.');
      setTimeout(() => send(message), 50);
    }
  };

  send({ type: 'SUBSCRIBE', channel: 'live/TBA' });

  return {
    ws,
    send,
    on: emitter.on.bind(emitter),
  };
};

export const createTransports = async (
  config: UpbeatTransportConfig[],
): Promise<UpbeatTransport[]> => {
  const transports: UpbeatTransport[] = [];
  for (const transport of config) {
    switch (transport.name) {
      case 'intertab':
        continue;
      case 'ws':
        transports.push(await createUpbeatTransportWebSocket(transport));
    }
  }

  return transports;
};
