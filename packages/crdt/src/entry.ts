import { createClient } from './client';
import { createClientManager } from './clientManager';
import ReactDOM from 'react-dom';
import React from 'react';
import { Application } from './playgroundui/Application';
// import './main.css';

// Our local networking manager.
// const manager = createClientManager();
//
// const james = createClient({ debugSiteId: 'james' });
// const al = createClient({ debugSiteId: 'al' });
// const fran = createClient({ debugSiteId: 'fran' });
// const andy = createClient({ debugSiteId: 'andy' });
//
// manager.addClient(james);
// manager.addClient(al);
// manager.addClient(fran);
// manager.addClient(andy);
//

ReactDOM.render(
  React.createElement(Application),
  document.querySelector('#app'),
);
