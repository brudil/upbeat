import React from 'react';
import ReactDOM from 'react-dom';
import { ApplicationContainerComponent } from './containers/ApplicationContainer';

console.log('CUE 0.1');
console.log(`ENV: ${process.env.NODE_ENV}`);

ReactDOM.render(<ApplicationContainerComponent/>, document.querySelector('.app'));
