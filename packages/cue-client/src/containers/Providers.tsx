import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { UpbeatProvider } from '@upbeat/client/src/context';
import { BrowserRouter as Router } from 'react-router-dom';
import { createUpbeat } from '@upbeat/client/src/upbeat';

const upbeat = createUpbeat();

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
