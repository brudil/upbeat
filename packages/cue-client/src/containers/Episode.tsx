import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { EpisodeOverview } from './EpisodeOverview';
import { EpisodeRundown } from './EpisodeRundown';
import { EpisodeScripts } from './EpisodeScripts';
import { EpisodeObjects } from './EpisodeObjects';
import { StatusBar } from '../components/StatusBar';

export const Episode: React.FC = () => {
  return (
    <div>
      <StatusBar />
      <Switch>
        <Route path={'/show/episode/overview'} component={EpisodeOverview} />
        <Route path={'/show/episode/rundown'} component={EpisodeRundown} />
        <Route path={'/show/episode/scripts'} component={EpisodeScripts} />
        <Route path={'/show/episode/objects'} component={EpisodeObjects} />
      </Switch>
    </div>
  );
};
