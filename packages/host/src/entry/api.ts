import Hapi from '@hapi/hapi';
import hapiCookie from '@hapi/cookie';
import { pool } from '../setup/db';
import { getUserById } from '../data/user';

const init = async () => {
  const app = new Hapi.Server({
    port: process.env.PORT,
    host: process.env.HOST,
    state: {
      strictHeader: false,
    },
  });

  await app.register(hapiCookie);

  app.auth.strategy('session', 'cookie', {
    cookie: {
      name: 'cue-app',
      password: '!wsYhFA*C2U6nz=Bu^%A@^F#SF3&kSR6',
      isSecure: false,
    },
    redirectTo: false,
    validateFunc: async (_request: unknown, session: any) => {
      try {
        const account = await pool.anyFirst(getUserById(session.id));
        if (!account) {
          return { valid: false };
        }

        return { valid: true, credentials: account };
      } catch (e) {
        console.error(e);
        return { valid: false };
      }
    },
  });

  app.auth.default({ strategy: 'session', mode: 'try' });

  await app.start();
};

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

init();
