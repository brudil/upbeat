import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { RushProvider } from '../../../rush/src/context';
import { BrowserRouter as Router } from 'react-router-dom';
import { createRush } from '../../../rush/src/rush';

const rush = createRush();

(window as any).rush = rush;

export const Providers: React.FC = ({ children }) => {
  return (
    <HelmetProvider>
      <RushProvider value={rush}>
        <Router>{children}</Router>
      </RushProvider>
    </HelmetProvider>
  );
};
