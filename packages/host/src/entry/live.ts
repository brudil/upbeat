// import Hapi from '@hapi/hapi';
import { pool } from '../setup/db';
import { createLiveManager } from '../liveManager';
import { redisClient } from '../setup/redis';
console.log(`@withcue/host live - WS Server`);
console.log(`listening at `, process.env.PORT);
console.log(pool);

const live = createLiveManager({
  async validateConnection(req: any) {
    const token = req.url.slice(8);
    const userId = await redisClient.get(`live:token:${token}`);
    console.log(token, userId);
    if (userId) {
      return userId;
    }

    return false;
  },
});

live.start(process.env.PORT || '');
