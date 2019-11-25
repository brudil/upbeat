import { UpbeatServerConfig } from './types';
import http from 'http';
import WebSocket from 'ws';
import uuid from 'uuid/v4';

class UpbeatServer {
  private server: http.Server;
  private wss: WebSocket.Server;
  private connections: {
    [key: string]: { socket: WebSocket; userId: string };
  } = {};
  private conf: UpbeatServerConfig;

  constructor(conf: UpbeatServerConfig) {
    this.conf = conf;
  }

  private handleNewConnection(socket: WebSocket, request: any): void {
    this.connections[uuid()] = {
      userId: request.auth,
      socket,
    };

    console.log('socket registered');

    socket.on('message', (msg) => {
      Object.values(this.connections).forEach((connection) =>
        connection.socket.send(msg),
      );
    });
  }

  private handleUpgrade(request: any, socket: any, head: any): void {
    const { wss } = this;
    this.conf.validateConnection(request).then((res) => {
      if (res !== false) {
        request.auth = res;

        wss.handleUpgrade(request, socket, head, function(ws) {
          wss.emit('connection', ws, request);
        });
      } else {
        console.log('destorying socket, validation failed');
        socket.destroy();
      }

      return;
    });
  }

  async listen(port: number | string): Promise<void> {
    this.server = http.createServer({});
    this.wss = new WebSocket.Server({
      noServer: true,
      clientTracking: false,
    });

    this.server.on('upgrade', this.handleUpgrade.bind(this));
    this.wss.on('connection', this.handleNewConnection.bind(this));

    this.server.listen(port);
  }
}

export const createUpbeatServer = (config: UpbeatServerConfig) => {
  return new UpbeatServer(config);
};
