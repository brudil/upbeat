import React from 'react';
import ReactDOM from 'react-dom';
import { ApplicationContainerComponent } from './containers/ApplicationContainer';
import { Providers } from './containers/Providers';

console.log('CUE 0.1');
console.log(`ENV: ${process.env.NODE_ENV}`);

ReactDOM.render(
  <Providers>
    <ApplicationContainerComponent />
  </Providers>,
  document.querySelector('.app'),
);
