/**
 * @packageDocumentation
 * @module @upbeat/devtools
 */

import React, { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useUpbeat } from '@upbeat/react';
import { UpbeatDevtool } from '@upbeat/client/src/devtools';

const Container: React.FC = ({ children }) => {
  return <div style={{ padding: '0 8px' }}>{children}</div>;
};

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

const TopNav: React.FC<{
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
        name="Persistence"
        view={View.Persistence}
        onChange={onChange}
        currentView={currentView}
      />
      <TopNavItem
        name="Operations"
        view={View.Operations}
        onChange={onChange}
        currentView={currentView}
      />
      <TopNavItem
        name="LiveQueries"
        view={View.Operations}
        onChange={onChange}
        currentView={currentView}
      />
    </ul>
  );
};

enum View {
  Log,
  Operations,
  ResourceCache,
  Persistence,
}

const LogView: React.FC<{ devtool: UpbeatDevtool }> = ({ devtool }) => {
  return (
    <div>
      <h2>Log view</h2>

      <ul>
        {devtool.getLogs().map((item) => {
          return (
            <li
              key={item.id}
              style={{ fontSize: '0.8rem', marginBottom: '10px' }}
            >
              <span style={{}}>{item.name}</span>
              <span>{item.subKey}</span>
              <span>{item.content}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const OperationsView = () => {
  return <h2>opers view</h2>;
};

const ResourceCacheView = () => {
  return <h2>Resource view</h2>;
};
const PersistenceView = () => {
  return <h2>Persistance view</h2>;
};

enum Mode {
  Vertical,
  Horizontal,
  Hidden,
}

export const UpbeatDevtools: React.FC = ({ children }) => {
  const [mode, setMode] = useState<Mode>(Mode.Hidden);
  const [view, setView] = useState<View>(View.Log);
  useHotkeys(
    'ctrl+k',
    () =>
      mode === Mode.Hidden ? setMode(Mode.Vertical) : setMode(Mode.Hidden),
    [mode],
  );
  const client = useUpbeat();

  return (
    <React.Fragment>
      {children}
      {mode !== Mode.Hidden && (
        <div
          style={{
            position: 'fixed',
            right: '16px',
            top: '16px',
            bottom: '16px',
            borderRadius: '16px',
            width: 360,
            backgroundColor: '#28282b',
            color: '#eee',
            boxShadow: 'rgba(30, 30, 60, 0.3) 0px 3px 8px 1px',
          }}
        >
          {client.devtool === null && (
            <React.Fragment>
              <h1
                style={{
                  fontWeight: 800,
                  textAlign: 'center',
                  padding: '2rem 0',
                }}
              >
                Unable to connect.
              </h1>
              <h2
                style={{
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  textAlign: 'center',
                  padding: '1rem 0',
                }}
              >
                <code>devtool</code> must be set to <code>true</code> in
                UpbeatConfig
              </h2>
            </React.Fragment>
          )}
          {client.devtool !== null && (
            <React.Fragment>
              <Container>
                <h1
                  style={{
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    fontSize: '0.5rem',
                    opacity: 0.5,
                  }}
                >
                  Upbeat Devtools
                </h1>
                <TopNav onChange={setView} currentView={view} />
              </Container>

              <Container>
                {view === View.Log && <LogView devtool={client.devtool} />}
                {view === View.Operations && <OperationsView />}
                {view === View.ResourceCache && <ResourceCacheView />}
                {view === View.Persistence && <PersistenceView />}
              </Container>
            </React.Fragment>
          )}
        </div>
      )}
    </React.Fragment>
  );
};
