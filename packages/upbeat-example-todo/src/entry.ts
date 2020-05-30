/**
 * @packageDocumentation
 * @module @upbeat/example-todo
 */

import ReactDOM from 'react-dom';
import React from 'react';
import { Application } from './components/Application';
import { startClient } from './client';
import { UpbeatProvider } from '@upbeat/react';
import { UpbeatDevtools } from '@upbeat/devtools';

async function start(): Promise<void> {
  const client = await startClient();

  ReactDOM.render(
    React.createElement(
      UpbeatProvider,
      { value: client },
      React.createElement(UpbeatDevtools, {}, React.createElement(Application)),
    ),
    document.querySelector('#app'),
  );
}

start().catch((e) => console.error(e));
