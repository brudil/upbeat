import React, { useLayoutEffect, useRef } from 'react';
import { Container } from './Container';
import JSONTree from 'react-json-tree';
import { ModuleNames, QueryBuilder, UpbeatDevtool } from '@upbeat/client';
import { monokai } from 'base16';

// const moduleMapName: { [key in ModuleNames]: string } = {
//   ResourceCache: 'RC',
//   Worker: 'W',
//   Intermediate: 'I',
//   Changeset: 'CS',
//   Sync: 'S',
//   Persistence: 'P',
//   LiveQuery: 'LQ',
//   Transport: 'T',
// };

const moduleMapColor: { [key in ModuleNames]: string } = {
  ResourceCache: '#34b3c4',
  Worker: '#000000',
  Intermediate: '#c46634',
  Changeset: '#77c434',
  Sync: '#b634c4',
  Persistence: '#3447c4',
  LiveQuery: '#34c46e',
  Transport: '#c43434',
};

const Content: React.FC<{ content: any; id: string }> = ({ id, content }) => {
  if (id === 'LiveQuery:Registered') {
    return <code>{QueryBuilder.fromSerialised(content.query).toString()}</code>;
  }

  if (typeof content === 'object') {
    return (
      <JSONTree data={content} theme={{ ...monokai, base00: 'transparent' }} />
    );
  }

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
                <div>
                  <span
                    title={item.name}
                    style={{
                      borderTopLeftRadius: '4px',
                      borderBottomLeftRadius: '4px',
                      backgroundColor: moduleMapColor[item.name],
                      fontWeight: 700,
                      color: 'white',
                      padding: '0 2px',
                      fontSize: '12px',
                    }}
                  >
                    {item.name}
                  </span>
                  <span
                    style={{
                      borderTopRightRadius: '4px',
                      borderBottomRightRadius: '4px',
                      backgroundColor: `${moduleMapColor[item.name]}aa`,
                      fontWeight: 700,
                      color: 'white',
                      padding: '0 2px',
                      fontSize: '12px',
                    }}
                  >
                    {item.key.toUpperCase()}
                  </span>
                </div>
                <span>
                  <Content
                    content={item.data}
                    id={`${item.name}:${item.key}`}
                  />
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
