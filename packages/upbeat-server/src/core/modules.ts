/**
 * @packageDocumentation
 * @module @upbeat/server
 */

import { MessageHandler } from '../types';

export interface ChannelConf<CT extends { type: string }> {
  key: string;
  handlers: {
    [P in CT['type']]: MessageHandler<Extract<CT, { type: P }>, any>;
  };
}

export const createModule = <CT extends { type: string }>(
  config: ChannelConf<CT>,
) => config;

export type extractGeneric<Type> = Type extends ChannelConf<infer X>
  ? X
  : never;
