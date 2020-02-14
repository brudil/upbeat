import ReactDOM from 'react-dom';
import React from 'react';
import { Application } from './components/Application';
import { startClient } from './client';
import { UpbeatProvider } from '../../upbeat-react/src/react';

async function start() {
  const client = await startClient();

  ReactDOM.render(
    React.createElement(
      UpbeatProvider,
      { value: client },
      React.createElement(Application),
    ),
    document.querySelector('#app'),
  );
}

start();
