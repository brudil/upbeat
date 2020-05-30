import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router } from 'react-router-dom';
import { UpbeatProvider } from '@upbeat/react/src';
import { createClient } from '@upbeat/client/src/client';

const upbeat = createClient({});
/*
{
  uri: 'ws://localhost:8011',
}
 */
(window as any).upbeat = upbeat;

export const Providers: React.FC = ({ children }) => {
  return (
    <HelmetProvider>
      <UpbeatProvider value={upbeat}>
        <Router>{children}</Router>
      </UpbeatProvider>
    </HelmetProvider>
  );
};
