/**
 * @packageDocumentation
 * @module @upbeat/server
 */

import { Client } from './core/Client';
import { ChannelConf } from './core/modules';

export interface TokenInfo {
  dn: string;
  userId: number;
}

export interface FanOutSelector {
  channel: [string, string];
}

export type HandlerOutput<O> = [O, FanOutSelector?];

export interface EgressManger<O> {
  (message: O, selector?: FanOutSelector): void;
}

/**
 * A message handler provides a simple process for a given type.
 * It takes an client message, and returns a hydrated message and a selector for distribution.
 * */
export interface MessageHandler<I, O> {
  (payload: Omit<I, 'type'>, egress: EgressManger<O>, client: Client): Promise<
    void
  >;
}

export interface Config {
  modules: ChannelConf<any>[]; //todo
}
