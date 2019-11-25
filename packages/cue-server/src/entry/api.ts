import Hapi from '@hapi/hapi';
import hapiCookie from '@hapi/cookie';
import { pool } from '../setup/db';
import { authenticateUser, getUserById } from '../data/user';
import { redisClient } from '../setup/redis';
import uuid from 'uuid';

const init = async () => {
  console.log(`@withcue/host api - API Server`);
  console.log(`listening at `, process.env.PORT);
  console.log(process.env.DATABASE_URL);
  const app = new Hapi.Server({
    debug: { request: ['error'] },
    port: process.env.PORT,
    host: process.env.HOST,
    state: {
      strictHeader: false,
    },
    routes: {
      cors: {
        origin: ['*'],
        credentials: true,
      },
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
        const account = await getUserById(pool, session.id);
        return { valid: true, credentials: account };
      } catch (e) {
        console.error(e);
        return { valid: false };
      }
    },
  });

  app.auth.default({ strategy: 'session', mode: 'try' });

  interface Credentials extends Hapi.AuthCredentials {
    id: string;
  }

  interface RequestAuth extends Hapi.RequestAuth {
    credentials: Credentials;
  }

  interface Request extends Hapi.Request {
    auth: RequestAuth;
  }

  interface LoginRequest extends Request {
    payload: {
      emailAddress: string;
      password: string;
    };
  }

  app.route({
    method: 'post',
    path: '/auth',
    handler: async (request: LoginRequest) => {
      const { emailAddress, password } = request.payload;

      const [success, user] = await authenticateUser(pool, {
        emailAddress,
        password,
      });
      if (success && user) {
        request.cookieAuth.set({ id: user.id });
      }

      return { success, user };
    },
  });

  app.route({
    method: 'post',
    path: '/session',
    handler: async (request: LoginRequest) => {
      // const user = await getUserById(pool, "4753b14f-9499-4516-913b-bcf23a4ab371");
      // request.cookieAuth.set({ id: user.id });

      return {
        payload: {
          authenticated: request.auth.isAuthenticated,
          credentials: request.auth.credentials,
        },
      };
    },
  });

  app.route({
    method: 'post',
    path: '/live',
    handler: async (request: LoginRequest) => {
      const token = uuid(); // todo: secure token
      await redisClient.set(
        `live:token:${token}`,
        request.auth.credentials.id,
        ['EX', 60],
      );

      return {
        payload: { token },
      };
    },
  });

  await app.start();
};

init();
