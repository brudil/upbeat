import { promisify } from 'util';
import { createClient } from 'redis';

const client = createClient();

export const redisClient = {
  get: promisify(client.get).bind(client),
  set: promisify(client.set).bind(client),
  hget: promisify(client.hget).bind(client),
  hmset: promisify(client.hmset).bind(client),
};
