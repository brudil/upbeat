/**
 * @packageDocumentation
 * @module @upbeat/devtools
 */

import React, { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useUpbeat } from '@upbeat/react';
import { LogView } from './LogView';
import { Mode, View } from './constants';
import { OperationsView } from './OperationsView';
import { ResourceCacheView } from './ResourceCacheView';
import { PersistenceView } from './PersistenceView';
import { TopNav } from './TopNav';
import { Container } from './Container';
import { useUpdateOn } from './useUpdateOn';

export const UpbeatDevtools: React.FC = ({ children }) => {
  const [mode, setMode] = useState<Mode>(Mode.Vertical);
  const [view, setView] = useState<View>(View.Log);
  useHotkeys(
    'ctrl+k',
    () =>
      mode === Mode.Hidden ? setMode(Mode.Vertical) : setMode(Mode.Hidden),
    [mode],
  );
  const client = useUpbeat();
  useUpdateOn();

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
            backgroundColor: 'rgb(35, 40, 51)',
            color: '#eee',
            boxShadow: 'rgba(30, 30, 60, 0.3) 0px 3px 8px 1px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
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
              <div
                style={{
                  paddingBottom: '6px',
                  boxShadow: 'rgba(30, 30, 30, 0.4) 0px 6px 9px',
                  zIndex: 1,
                  backgroundColor: '#28282b',
                }}
              >
                <Container>
                  <h1
                    style={{
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      fontSize: '0.5rem',
                      opacity: 0.5,
                      textAlign: 'center',
                      paddingTop: '2px',
                    }}
                  >
                    Upbeat Devtools
                  </h1>
                  <TopNav onChange={setView} currentView={view} />
                </Container>
              </div>
              <div
                style={{ overflowY: 'scroll', paddingTop: '8px', flex: 'auto' }}
              >
                {view === View.Log && <LogView devtool={client.devtool} />}
                {view === View.Operations && <OperationsView />}
                {view === View.ResourceCache && <ResourceCacheView />}
                {view === View.Persistence && <PersistenceView />}
              </div>
            </React.Fragment>
          )}
        </div>
      )}
    </React.Fragment>
  );
};
