import WebSocket from 'ws';
import { TokenInfo } from '../types';
import { RTServiceServer } from './Server';
import { ServerSent } from '../messages';

export class Client {
  // private token: string;
  private ws: WebSocket;
  private isAlive: boolean = true;
  private info: TokenInfo;

  constructor(ws: WebSocket, service: RTServiceServer, info: TokenInfo) {
    this.ws = ws;

    this.info = info;
    // this.token = 'xxx';
    ws.on('message', service.handleExternalMessage.bind(service, this));
    ws.on('pong', () => (this.isAlive = true));
  }

  send(message: ServerSent) {
    this.ws.send(JSON.stringify(message));
  }

  getUserState() {
    return {
      displayName: this.info.dn,
    };
  }

  serialise() {
    return {
      displayName: this.info.dn,
    };
  }

  heartbeat() {
    if (!this.isAlive) {
      this.close();

      return false;
    }

    this.isAlive = false;
    this.ws.ping(() => null);

    return true;
  }

  close() {
    this.ws.terminate();
  }
}
