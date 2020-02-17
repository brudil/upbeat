import React from 'react';
import { ProjectBreadcrumb } from '../ProjectBreadcrumb';
import { UserDropdown } from '../UserDropdown';

export const StatusBar: React.FC = () => {
  return (
    <div css={{ display: 'flex', padding: '0.5rem 1rem 1rem 0' }}>
      <ProjectBreadcrumb />
      <UserDropdown />
    </div>
  );
};
