// import Hapi from '@hapi/hapi';
import { pool } from '../setup/db';
import { redisClient } from '../setup/redis';
import { createUpbeatServer, UpbeatResolvers } from '@upbeat/server/src';
import { CueApp } from '@cue/shared/src';
console.log(`@withcue/host live - WS Server`);
console.log(`listening at `, process.env.PORT);
console.log(pool);

async function validateConnection(req: any) {
  const token = req.url.slice(8);
  const userId = await redisClient.get(`live:token:${token}`);
  console.log(token, userId);
  if (userId) {
    return userId;
  }

  return false;
}

const app: UpbeatResolvers<CueApp> = {
  modules: {
    auth: {
      login({ username, password }) {
        return {
          username: username,
          firstName: password,
          lastName: 'dave',
        };
      },
    },
  },
};

const upbeat = createUpbeatServer({ app, validateConnection });

upbeat.listen(process.env.PORT || '').then(() => {
  console.log('CUE/upbeat listening!');
});
