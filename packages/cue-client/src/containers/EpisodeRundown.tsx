import React from 'react';
import { Helmet } from 'react-helmet-async';
import { RundownEditor } from '../components/RundownEditor';

export const EpisodeRundown: React.FC = () => {
  return (
    <div>
      <Helmet title={'Rundown'} />
      <h1>Rundown</h1>
      <RundownEditor />
    </div>
  );
};
