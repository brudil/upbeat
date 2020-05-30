import React, { useLayoutEffect, useRef } from 'react';
import { UpbeatDevtool } from '@upbeat/client/src/devtools';
import { Container } from './Container';
import JSONTree from 'react-json-tree';
import { UpbeatModule } from '@upbeat/client/src/debug';

const moduleMapName: { [key in UpbeatModule]: string } = {
  ResourceCache: 'RC',
  Worker: 'W',
  Intermediate: 'I',
  Changeset: 'CS',
  Sync: 'S',
  Persistence: 'P',
  LiveQuery: 'LQ',
  Transport: 'T',
};

const Content: React.FC<{ content: any }> = ({ content }) => {
  try {
    const obj = JSON.parse(content);
    return <JSONTree data={obj} />;
  } catch {
    return content ?? '';
  }
};

export const LogView: React.FC<{ devtool: UpbeatDevtool }> = ({ devtool }) => {
  const logItems = devtool.getLogs();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current !== null) {
      console.log('scrolling');
      messagesEndRef.current.scrollIntoView();
    }
  };

  useLayoutEffect(scrollToBottom);

  return (
    <div>
      <ul>
        {logItems.map((item) => {
          return (
            <li
              key={item.id}
              style={{
                fontSize: '0.8rem',
                marginBottom: '10px',
                borderBottom: '1px solid grey',
              }}
            >
              <Container>
                <span
                  title={item.name}
                  style={{
                    borderRadius: '2px',
                    backgroundColor: 'white',
                    fontWeight: 900,
                    color: 'black',
                    padding: '0 2px',
                    letterSpacing: '-1px',
                    fontSize: '10px',
                  }}
                >
                  {moduleMapName[item.name]}
                </span>
                <span>{item.key}</span>
                <span>
                  <Content content={item.data} />
                </span>
              </Container>
            </li>
          );
        })}
        <div ref={messagesEndRef} />
      </ul>
    </div>
  );
};
