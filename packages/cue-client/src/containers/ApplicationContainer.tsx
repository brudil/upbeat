import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { ProjectSidebar } from '../components/ProjectSidebar';
import { Global } from '@emotion/core';
import { Helmet } from 'react-helmet-async';
import { Episode } from './Episode';
import { Providers } from './Providers';
import { useUpbeatState } from '@upbeat/client/src/context';
import { AuthLogin } from './AuthLogin';
import { MarketingHomepage } from './MarketingHomepage';

export const ApplicationContainerComponent: React.FC = () => {
  const state = useUpbeatState((store) => store.auth.isAuthenticated);

  console.log(state);
  return (
    <Providers>
      <div>
        <Helmet titleTemplate="%s | Cue" defaultTitle="Cue" />
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
        {state.auth.loading && <h1>Loading</h1>}
        {state.auth.isAuthenticated ? (
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
        ) : (
          <Switch>
            <Route path="/" component={MarketingHomepage} exact />
            <Route path="/login" component={AuthLogin} />
          </Switch>
        )}
      </div>
    </Providers>
  );
};
