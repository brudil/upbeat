import WebSocket from 'ws';
import http, { ClientRequest } from 'http';
import uuid from 'uuid/v4';

interface LiveManagerOptions {
  validateConnection(request: ClientRequest): Promise<boolean>;
}

export const createLiveManager = (options: LiveManagerOptions) => {
  const server = http.createServer({});
  const wss = new WebSocket.Server({ server });
  const connections: { [key: string]: WebSocket } = {};

  const handleNewConnection = (
    socket: WebSocket,
    request: http.ClientRequest,
  ) => {
    options.validateConnection(request).then((valid) => {
      if (valid) {
        connections[uuid()] = socket;

        socket.on('message', () => {
          // user message ingress.
        });
      } else {
        socket.send('go away');
      }
    });
  };

  wss.on('connection', handleNewConnection);

  return {
    start(port: string) {
      server.listen(port);
    },
  };
};
