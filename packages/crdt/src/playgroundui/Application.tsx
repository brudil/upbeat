import React, { useEffect, useState } from 'react';
import { Heading } from './Heading';

import { createNetworkSimulator } from '../networkSimulator';
import { createClient } from '../client';
import { Client } from './Client';

const manager = createNetworkSimulator();

const james = createClient({ debugSiteId: 'james' });
const al = createClient({ debugSiteId: 'al' });
const fran = createClient({ debugSiteId: 'fran' });
const andy = createClient({ debugSiteId: 'andy' });

manager.attachClient(james);
manager.attachClient(al);
manager.attachClient(fran);
manager.attachClient(andy);

setTimeout(() => james.insertCharAt(0, 'j'), 200);
setTimeout(() => james.insertCharAt(0, 'a'), 201);
setTimeout(() => james.insertCharAt(0, 'm'), 202);
setTimeout(() => fran.insertCharAt(0, 'e'), 200);
setTimeout(() => andy.insertCharAt(0, 'z'), 600);
setTimeout(() => james.removeCharAt(6), 666);
setTimeout(() => james.insertCharAt(0, 's'), 10000);

export const Application = () => {
  const [tick, forceUpdate] = useState(0);

  useEffect(() => {
    setInterval(() => {
      forceUpdate((number) => number + 1);
    }, 100);
  }, []);

  return (
    <div>
      <h1 className="text-2xl">CRDT Playground</h1>
      <div className="flex flex-row">
        <div className="p-2 m-2 bg-gray-100 w-1/6 ">
          <Heading>Settings</Heading>

          <button>Add client</button>

          <div>Tick: {tick}</div>
        </div>
        <div className="p-2 m-2 bg-gray-800 text-white w-1/6">
          <Heading>Operation log</Heading>
          <ul>
            {manager.operationLog
              .slice()
              .reverse()
              .map((op) => {
                return (
                  <li className="text-sm my-2 py-2 border-b-2">
                    <div>site: {op.id.siteId}</div>
                    <div>time: {op.id.timestamp.time}</div>
                    <div>count: {op.id.timestamp.count}</div>
                    <pre className="text-xs">
                      value: {JSON.stringify(op, undefined, 2)}
                    </pre>
                  </li>
                );
              })}
          </ul>
        </div>
        <div className="p-2 m-2 flex-auto ">
          <Heading>Clients</Heading>
          {Array.from(manager.clients.values()).map((clientContainer) => (
            <Client
              key={clientContainer.client.siteId}
              clientContainer={clientContainer}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
