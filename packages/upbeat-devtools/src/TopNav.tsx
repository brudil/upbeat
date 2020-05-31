import React from 'react';
import { View } from './constants';

const TopNavItem: React.FC<{
  name: string;
  onChange: (name: View) => void;
  view: View;
  currentView: View;
}> = ({ name, onChange, view, currentView }) => {
  return (
    <li style={{ padding: 0, margin: 0 }}>
      <button
        style={{
          padding: '0 6px',
          textTransform: 'uppercase',
          fontWeight: 700,
          fontSize: '0.8rem',
          ...(currentView === view ? { textDecoration: 'underline' } : {}),
        }}
        onClick={() => onChange(view)}
      >
        {name}
      </button>
    </li>
  );
};
export const TopNav: React.FC<{
  onChange: (name: View) => void;
  currentView: View;
}> = ({ onChange, currentView }) => {
  return (
    <ul
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: 0,
        margin: 0,
      }}
    >
      <TopNavItem
        name="Log"
        view={View.Log}
        onChange={onChange}
        currentView={currentView}
      />
      <TopNavItem
        name="ResourceCache"
        view={View.ResourceCache}
        onChange={onChange}
        currentView={currentView}
      />
      <TopNavItem
        name="Schema"
        view={View.Schema}
        onChange={onChange}
        currentView={currentView}
      />
    </ul>
  );
};
