import ReactDOM from 'react-dom';
import React from 'react';

console.log('CUE 0.1');
console.log(`ENV: ${process.env.NODE_ENV}`);

ReactDOM.render(<h1>CUE</h1>, document.querySelector('.App'));
