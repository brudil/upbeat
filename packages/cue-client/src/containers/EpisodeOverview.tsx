import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Editor } from '../components/Editor';

export const EpisodeOverview: React.FC = () => {
  return (
    <div>
      <Helmet title={'Overview'} />
      <h1>Overview</h1>
      <Editor />
    </div>
  );
};
