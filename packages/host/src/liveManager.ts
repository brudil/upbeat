import WebSocket from 'ws';
import http, { ClientRequest } from 'http';
import uuid from 'uuid/v4';

interface LiveManagerOptions {
  validateConnection(request: ClientRequest): Promise<false | string>;
}

export const createLiveManager = (options: LiveManagerOptions) => {
  const server = http.createServer({});
  const wss = new WebSocket.Server({ server, clientTracking: false });
  const connections: { [key: string]: WebSocket } = {};

  const handleNewConnection = (socket: WebSocket, request: any) => {
    connections[uuid()] = socket;

    console.log(request.auth);

    socket.on('message', () => {
      // user message ingress.
    });
  };

  const handleUpgrade = (request: any, socket: any, head: any) => {
    options.validateConnection(request).then((res) => {
      if (res !== false) {
        request.auth = res;

        wss.handleUpgrade(request, socket, head, function(ws) {
          wss.emit('connection', ws, request);
        });
      } else {
        console.log('destr');
        socket.destroy();
      }
      return;
    });
  };

  server.on('upgrade', handleUpgrade);
  wss.on('connection', handleNewConnection);

  return {
    start(port: string) {
      server.listen(port);
    },
  };
};
