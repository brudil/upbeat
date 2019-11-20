import React from 'react';
import { Link } from 'react-router-dom';

export const ProjectBreadcrumbSegment: React.FC<{ to: string }> = ({
  to,
  children,
}) => {
  return (
    <li
      css={{
        '&:after': {
          content: '"/"',
          color: '#5C5C5C',
        },
      }}
    >
      <Link
        to={to}
        css={{ padding: '0 0.2rem', color: '#5C5C5C', textDecoration: 'none' }}
      >
        {children}
      </Link>
    </li>
  );
};

export const ProjectBreadcrumb = () => {
  return (
    <ul
      css={{
        width: '100%',
        padding: 0,
        margin: 0,
        listStyle: 'none',
        display: 'flex',
        '& li:last-child:': {
          fontWeight: 'bold',
          ':after': {
            display: 'none',
          },
        },
      }}
    >
      <ProjectBreadcrumbSegment to="/urf">URF</ProjectBreadcrumbSegment>
      <ProjectBreadcrumbSegment to="/urf/kettled">
        Kettled
      </ProjectBreadcrumbSegment>
      <ProjectBreadcrumbSegment to="/urf/kettled/e46d930a-2682-46b9-95a3-539639701e10/">
        Episode 3
      </ProjectBreadcrumbSegment>
    </ul>
  );
};
