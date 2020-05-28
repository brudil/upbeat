/**
 * @packageDocumentation
 * @module @upbeat/playground
 */

import React, { useEffect, useState } from 'react';
import { Heading } from './Heading';

import { createNetworkSimulator } from '@upbeat/testing/src/networkSimulator';
import { createPeer } from '@upbeat/core/src/peer';
import { Client } from './Client';

const manager = createNetworkSimulator();

const james = createPeer({ debugSiteId: 'james' });
const al = createPeer({ debugSiteId: 'al' });
const fran = createPeer({ debugSiteId: 'fran' });
const andy = createPeer({ debugSiteId: 'andy' });

manager.attachClient(james);
manager.attachClient(al);
manager.attachClient(fran);
manager.attachClient(andy);

setTimeout(() => james.insertCharAt(0, 'j'), 200);
setTimeout(() => james.insertCharAt(1, 'a'), 205);
setTimeout(() => james.insertCharAt(2, 'm'), 210);
setTimeout(() => fran.insertCharAt(2, 'f'), 300);
setTimeout(() => andy.insertCharAt(3, 'z'), 400);
setTimeout(() => james.removeCharAt(4), 666);
setTimeout(() => james.insertCharAt(4, 's'), 10000);

// setInterval(() => james.insertCharAt(0, 'x'), 20)

export const Application: React.FC = () => {
  const [tick, forceUpdate] = useState(0);

  useEffect(() => {
    manager.on('tick', (tickCount) => forceUpdate(tickCount));
  }, []);

  const consistent = Array.from(manager.clients.values()).every(
    (clientContainer, _i, arr) =>
      clientContainer.client.assembleString() ===
      arr[0].client.assembleString(),
  );

  return (
    <div>
      <h1 className="text-2xl">
        CRDT Playground{' '}
        <span
          className={`float-right uppercase font-bold text-base text-${
            consistent ? 'green' : 'red'
          }-600`}
        >
          {consistent ? 'Consistent' : 'Inconsistent'}
        </span>
      </h1>
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
                      id: {JSON.stringify(op.id, undefined, 2)}
                    </pre>
                    <pre className="text-xs">
                      locationId: {JSON.stringify(op.locationId, undefined, 2)}
                    </pre>
                    <pre className="text-xs">
                      value: {JSON.stringify(op.value, undefined, 2)}
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
