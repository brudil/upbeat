import { UpbeatServerConfig } from './types';
import http from 'http';
import WebSocket from 'ws';
import uuid from 'uuid/v4';
import { UpbeatApp } from '../../upbeat-types/src';

class UpbeatServer {
  private server: http.Server;
  private wss;
  private connections: {
    [key: string]: { socket: WebSocket; userId: string };
  } = {};
  private app: UpbeatApp;

  constructor(conf: UpbeatServerConfig) {
    this.app = conf.app;
  }

  private handleNewConnection(socket: WebSocket, request: any): void {
    this.connections[uuid()] = {
      userId: request.auth,
      socket,
    };

    console.log(request.auth);

    socket.on('message', (msg) => {
      Object.values(this.connections).forEach((connection) =>
        connection.socket.send(msg),
      );
    });
  }

  private handleUpgrade(request: any, socket: any, head: any): void {
    options.validateConnection(request).then((res) => {
      if (res !== false) {
        request.auth = res;

        this.wss.handleUpgrade(request, socket, head, function(ws) {
          this.wss.emit('connection', ws, request);
        });
      } else {
        socket.destroy();
      }

      return;
    });
  }

  async listen(port: number): Promise<void> {
    this.server = http.createServer({});
    this.wss = new WebSocket.Server({
      server: this.server,
      clientTracking: false,
    });
    this.server.listen(port);

    this.server.on('upgrade', this.handleUpgrade);
    this.wss.on('connection', this.handleNewConnection);
  }
}

export const createUpbeatServer = (config: UpbeatServerConfig) => {
  return new UpbeatServer(config);
};
