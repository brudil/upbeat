import React from 'react';
import { Login } from './Login';
import ViewerQuery from './ViewerQuery.graphql';
import { graphql } from 'react-apollo';

function ApplicationContainerComponent() {
  return (
    <div>
      <Login />
    </div>
  );
}

export const ApplicationContainer = graphql(ViewerQuery)(ApplicationContainerComponent);
