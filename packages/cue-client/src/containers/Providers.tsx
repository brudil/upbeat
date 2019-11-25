import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { UpbeatProvider } from '@upbeat/client/src/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { createUpbeat } from '@upbeat/client/src/upbeat';
import { CueApp } from '@withcue/shared/src';

const upbeat = createUpbeat<CueApp>({
  uri: 'ws://localhost:8008',
});

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
