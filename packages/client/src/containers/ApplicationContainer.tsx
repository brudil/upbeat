import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ProjectSidebar } from '../components/ProjectSidebar';
import { Global } from '@emotion/core';
import { RushProvider } from '../../../rush/src/context';
import { createRush } from '../../../rush/src/rush';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Episode } from './Episode';

const rush = createRush();

export const ApplicationContainerComponent: React.FC = () => {
  return (
    <HelmetProvider>
      <Helmet titleTemplate="%s | Cue" defaultTitle="Cue" />
      <RushProvider value={rush}>
        <Router>
          <div>
            <Global
              styles={{
                body: {
                  margin: 0,
                  padding: 0,
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                },
              }}
            />
            <div
              css={{
                display: 'flex',
              }}
            >
              <ProjectSidebar />
              <div css={{ flex: 'auto', marginLeft: '1rem' }}>
                <Switch>
                  <Route path={'/show/episode'} component={Episode} />
                </Switch>
              </div>
            </div>
          </div>
        </Router>
      </RushProvider>
    </HelmetProvider>
  );
};
