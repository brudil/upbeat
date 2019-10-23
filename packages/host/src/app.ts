// import Hapi from '@hapi/hapi';
import WebSocket from 'ws';
import http from 'http';
import {pool} from './db';
console.log(`@withcue/host`);
console.log(pool);
const server = http.createServer({});
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log('received: %s', message);
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

server.listen(8080);

