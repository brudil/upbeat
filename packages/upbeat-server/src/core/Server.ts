import WebSocket from 'ws';
import d from 'debug';
import Redis from 'ioredis';
import { Client } from './Client';
import { printBanner } from './print';
import http from 'http';
import { verify } from 'jsonwebtoken';
import { Config, EgressManger, FanOutSelector, MessageHandler } from '../types';

const debug = d('rt');

export class RTServiceServer {
  private wss: WebSocket.Server;
  private clients = new Set<Client>();
  // private channels = new Set<Channel>();
  private pub: Redis.Redis;
  private sub: Redis.Redis;
  private server: http.Server;
  private handlers: { [key: string]: MessageHandler<any, any> };
  private channels: Map<string, Set<Client>> = new Map();

  constructor(appConfig: Config) {
    printBanner();
    // this.config = appConfig;

    this.setupWs();
    this.setupPubSub();
    debug('service now listening');

    this.handlers = appConfig.modules.reduce(
      (prev, module) => ({ ...prev, ...module.handlers }),
      {},
    );
  }

  private setupWs() {
    this.server = http.createServer();

    this.wss = new WebSocket.Server({
      noServer: true,
    });

    this.server.on('upgrade', async (request, socket, head) => {
      debug('upgrade');
      const token = request.url.slice(8);
      try {
        const valid = await verify(token, 'bloop');
        if (valid) {
          this.wss.handleUpgrade(request, socket, head, (ws) => {
            this.wss.emit('connection', ws, request, valid);
          });
        }
      } catch (e) {
        console.log(e, token);
        debug('upgrade failed');
        socket.destroy();
        return;
      }
    });
    this.wss.on('connection', (ws: WebSocket, _x: any, info: any) => {
      this.clients.add(new Client(ws, this, info));
      debug(`client connected: ${info.dn}`);
    });

    setInterval(() => {
      this.clients.forEach((client) => {
        if (!client.heartbeat()) {
          this.cleanUpClient(client);
        }
      });
    }, 30000);
  }

  private setupPubSub() {
    this.pub = new Redis(6379); //, "redis-master");
    this.sub = new Redis(6379); //, "redis-master");

    this.sub.subscribe('rt-fan');
    this.sub.on('message', (channel, message) => {
      if (channel === 'rt-fan') {
        const msg = JSON.parse(message);
        this.deliverEgressMessage(msg.payload, msg.selector);
      }
    });
  }

  public handleExternalMessage(client: Client, message: string) {
    const payload = JSON.parse(message.toString());
    debug(`message->${payload.type}`);
    if (payload.type === 'SUBSCRIBE') {
      // perform authorisation
      const channelSet =
        this.channels.get(payload.channel) ?? new Set<Client>();
      channelSet.add(client);
      this.channels.set(payload.channel, channelSet);
      debug('SUB to', payload.channel);
    } else if (payload.type === 'UNSUBSCRIBE') {
      const channelSet = this.channels.get(payload.channel);
      if (channelSet) {
        channelSet.delete(client);
        this.channels.set(payload.channel, channelSet);
      }
      debug('UNSUB to', payload.channel);
    } else {
      if (this.handlers.hasOwnProperty(payload.type)) {
        const manager: EgressManger<unknown> = (payload, selector) => {
          this.pub.publish('rt-fan', JSON.stringify({ payload, selector }));
        };
        this.handlers[payload.type](payload, manager, client);
      }
    }
  }

  private deliverEgressMessage(
    payload: any,
    selector: FanOutSelector | undefined,
  ) {
    console.log('DELIVERING', payload, 'to', selector);
    if (selector) {
      const channel = this.channels.get(selector.channel.join('/'));
      if (channel) {
        channel.forEach((client) => {
          client.send(payload);
        });
      }
    }
  }

  private cleanUpClient(client: Client) {
    debug('cleaning client');
    this.clients.delete(client);
  }

  public listen(port: number) {
    this.server.listen(port);
  }

  public register() {}
}
