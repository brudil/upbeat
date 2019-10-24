import React from 'react';
import { NavLink } from 'react-router-dom';

const MenuSection: React.FC<{ heading: string }> = ({ children, heading }) => {
  return (
    <section css={{ marginBottom: '2rem' }}>
      <h3 css={{ textTransform: 'uppercase', margin: 0, fontSize: 10, color: '#5E5E5E', padding: '0 1rem' }}>{heading}</h3>
      <ul css={{ padding: 0, margin: 0, listStyle: 'none', fontFamily: 'Helvetica Neue, Arial', fontWeight: 'bold' }}>
        {children}
      </ul>
    </section>
  );
};

const MenuItem: React.FC<{ to: string }> = ({ to, children }) => {
  return (
    <li css={{ display: 'block'}}>
      <NavLink to={to} activeClassName="active" css={{ position: 'relative', textDecoration: 'none', padding: '0.3rem 1rem', display: 'block', color: '#333333', '&:after': {
          content: '""',
          // width: 0,
          display: 'block',
          position: 'absolute',
          right: 0,
          top: 4,
          bottom: 4,
          backgroundImage: 'linear-gradient(90deg, #5600D5 0%, #3000A3 100%)',
          transition: 'width 200ms ease',
        }, '&.active:after, &.active:hover:after': {
          width: 3,
        },'&:hover:after': {
          width: 1,
        } }}>{children}</NavLink>
    </li>
  );
};

export const ProjectSidebar = () => {
  return (
    <aside css={{ background: '#F7F7F7', minWidth: 110, minHeight: '100vh', boxShadow: '-2px 0 4px rgba(0, 0, 0, 0.5)' }}>
      <h1>CUE</h1>
      <MenuSection heading="Episode">
        <MenuItem to={`/project/overview`}>Overview</MenuItem>
        <MenuItem to={`/project/scripts`}>Scripts</MenuItem>
        <MenuItem to={`/project/rundown`}>Rundown</MenuItem>
        <MenuItem to={`/project/objects`}>Objects</MenuItem>
      </MenuSection>
      <MenuSection heading="Show">
        <MenuItem to={`/show/overview`}>Overview</MenuItem>
        <MenuItem to={`/show/schedule`}>Schedule</MenuItem>
        <MenuItem to={`/show/episodes`}>Episodes</MenuItem>
        <MenuItem to={`/show/configuration`}>Configuration</MenuItem>
      </MenuSection>
    </aside>
  )
};
