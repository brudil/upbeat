import 'reflect-metadata';
import { createServer } from 'http';
import { readFileSync } from 'fs';
import { join } from 'path';
import { createConnection, getCustomRepository } from 'typeorm';
import { Server, Request, ResponseToolkit } from 'hapi';
import { graphqlHapi, graphiqlHapi } from 'apollo-server-hapi';
import { makeExecutableSchema } from 'graphql-tools';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { authenticate, validateJWT } from './utils/auth';
import { sign } from 'jsonwebtoken'
import { TeamRepository } from './repositories/TeamRepository';

const typeDefs = readFileSync(join(__dirname, '../src/schema.graphql'), 'utf-8');

const decor = (e: any) => e;

const resolvers = {
  Query: {
    async viewer(_: any, input: any, context: any, info: any) {
      return context.req.auth.isAuthenticated ? context.req.auth.credentials.user : null;
    }
  },
  Mutation: {
    async login(_: any, input: { username: string, password: string }) {
      const user = await authenticate(input.username, input.password);
      const token = user ? sign({
        userId: user.id,
      }, 'secret') : null;
      return {
        token,
        user
      };
    },
    async createTeam(_: any, input: any, context: any) {
      const teams = getCustomRepository(TeamRepository);
      const team = await teams.create({

      });

      return {}
    }
  }
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
} as any);

const HTTP_PORT = 8000;
const WS_PORT = 8400;

const server = new Server({
  host: 'localhost',
  port: HTTP_PORT,
  debug: { request: ['error'] },
  routes: {
    cors: {
      origin: ['*'],
      additionalHeaders: ['accept', 'Authorization', 'content-type', 'cache-control', 'Access-Control-Allow-Headers'],
    }
  }
});

server.route({
  method: 'OPTIONS',
  path: '/graphql',
  options: { auth: false },
    handler: (request: Request, res: ResponseToolkit) => {
      console.log(request.headers);
    return res.response({ ok: true })
      .header('Access-Control-Allow-Methods', 'POST')
      .header('Access-Control-Allow-Headers', 'content-type,authorization')
  }
})

const websocketServer = createServer((request, response) => {
  response.writeHead(404);
  response.end();
});

websocketServer.listen(WS_PORT, () => console.log(
  `Websocket Server is now running on http://localhost:${WS_PORT}`
));


createConnection()
  .then(async (connection) => {

    await server.register({
      plugin: graphqlHapi as any,
      options: {
        path: '/graphql',
        graphqlOptions: async (req: Request) => ({
          schema: schema,
          context: {
            db: connection,
            req,
          }
        }),
        route: {
          cors: true,
        },
      },
    });

    await server.register(require('hapi-auth-jwt2'));

    server.auth.strategy('jwt', 'jwt',
      {
        key: 'secret',
        verify: validateJWT,
        verifyOptions: { algorithms: ['HS256'] }
      });

    server.auth.default({
      strategy: 'jwt',
      mode: 'optional',
    });

    await server.register({
      plugin: graphiqlHapi as any,
      options: {
        path: '/graphiql',
        graphiqlOptions: {
          endpointURL: '/graphql',
          subscriptionsEndpoint: `ws://localhost:${WS_PORT}/graphql`,
        },
        route: {
          cors: true,
        },
      },
    });

    try {
      await server.start();
      SubscriptionServer.create({
        schema,
        execute,
        subscribe,
      }, { server: websocketServer, path: '/graphql' });

      console.log('Cue server started.');
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  })
  .catch((error) => console.log(error));
