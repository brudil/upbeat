import React from 'react';

export const ProjectSidebar = () => {
  return (
    <aside css={{ background: '#F7F7F7', width: 200, minHeight: '100vh', boxShadow: '-2px 0 4px rgba(0, 0, 0, 0.5)' }}>
      <h1>CUE</h1>
      <ul>
        <li>Overview</li>
        <li>Scripts</li>
        <li>Rundown</li>
        <li>Objects</li>
      </ul>
    </aside>
  )
};
