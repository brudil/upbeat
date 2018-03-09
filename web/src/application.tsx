import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset';
import { ApolloLink } from 'apollo-link';
import { BrowserRouter as Router } from 'react-router-dom';
import settings from './settings';
import { ApplicationContainer } from './containers/ApplicationContainer';
import { getAuthenticationToken } from './utils/auth';

console.log('CUE 0.1');
console.log(`ENV: ${process.env.NODE_ENV}`);

const httpLink = new HttpLink({
  uri: `${settings.endpoint}/graphql`,
});

const middlewareLink = new ApolloLink((operation, forward) => {
  const token = getAuthenticationToken();

  if (token) {
    operation.setContext({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  if (forward) {
    return forward(operation);
  } else {
    return null;
  }
});

const link = middlewareLink.concat(httpLink as any);

const client = new ApolloClient({
  link: link as any,
  cache: new InMemoryCache() as any,
}) as any;


function renderApp() {
  ReactDOM.render(
    (
      <ApolloProvider client={client}>
        <Router>
          <ApplicationContainer />
        </Router>
      </ApolloProvider>
    ) as any,
    document.getElementById('app')
  );
}

try {
  (window as any).Typekit.load({
    active: function webfontsActivated() {
      console.log('[webfonts] Active.');
      renderApp();
    },
    inactive: function webfontsInactive() {
      renderApp();
    },
  });
} catch (e) {
  console.warn('[webfonts] failed to load');
  renderApp();
}
