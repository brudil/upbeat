import React from 'react';
import { ProjectBreadcrumb } from '../ProjectBreadcrumb';
import { UserDropdown } from '../UserDropdown';

export const StatusBar = () => {
  return (
    <div css={{ display: 'flex' }}>
      <ProjectBreadcrumb />
      <UserDropdown />
    </div>
  );
};
