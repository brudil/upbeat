// import Hapi from '@hapi/hapi';
import { pool } from '../setup/db';
import { redisClient } from '../setup/redis';
import {
  createUpbeatServer,
  UpbeatOperationResolvers,
} from '@upbeat/server/src';
import { CueApp } from '@withcue/shared/src';
console.log(`@withcue/host live - WS Server`);
console.log(`listening at `, process.env.PORT);
console.log(pool);

async function validateConnection(req: any) {
  const token = req.url.slice(8);
  const userId = await redisClient.get(`live:token:${token}`);
  if (userId) {
    return userId;
  }

  return false;
}

const app: UpbeatOperationResolvers<CueApp> = {
  operations: {
    async loginAuth([username, password]) {
      return {
        username,
        firstName: password,
        lastName: 'david',
      };
    },
    async edit([content]) {
      return content;
    },
  },
};

const upbeat = createUpbeatServer({ app, validateConnection });

upbeat.listen(process.env.PORT || 8000).then(() => {
  console.log('CUE/upbeat listening!');
});
