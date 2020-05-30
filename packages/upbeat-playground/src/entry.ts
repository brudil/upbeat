/**
 * @packageDocumentation
 * @module @upbeat/playground
 */

import ReactDOM from 'react-dom';
import React from '@upbeat/react/src';
import { Application } from './components/Application';

ReactDOM.render(
  React.createElement(Application),
  document.querySelector('#app'),
);
