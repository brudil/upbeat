import ReactDOM from 'react-dom';
import React from 'react';
import { Application } from './components/Application';
import { startClient } from './client';

async function start() {
  await startClient();

  ReactDOM.render(
    React.createElement(Application),
    document.querySelector('#app'),
  );
}

start();
