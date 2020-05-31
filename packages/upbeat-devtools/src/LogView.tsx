import React, { useLayoutEffect, useRef } from 'react';
import { Container } from './Container';
import JSONTree from 'react-json-tree';
import {
  ModuleNames,
  QueryBuilder,
  UpbeatDevtool,
  LogItem,
} from '@upbeat/client';
import { jsonTheme } from './theme';

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
  if (id === 'Sync:NEW HASH') {
    return <code>{content}</code>;
  }

  if (id === 'LiveQuery:Registered') {
    return (
      <div>
        <code>{QueryBuilder.fromSerialised(content.query).toString()}</code>
      </div>
    );
  }

  if (typeof content === 'object') {
    return (
      <JSONTree
        data={content}
        theme={jsonTheme}
        invertTheme={false}
        hideRoot={true}
      />
    );
  }

  try {
    const obj = JSON.parse(content);
    return (
      <JSONTree
        data={obj}
        theme={jsonTheme}
        invertTheme={false}
        hideRoot={true}
      />
    );
  } catch {
    return content ?? '';
  }
};

function simpleNestedLogs(logs: LogItem[]) {
  const nestedLog = [];
  console.log(logs);

  let depth = 0;

  for (let i = 0; i < logs.length; i++) {
    const current = logs[i];

    if (current.name === 'Transport') {
      continue;
    }

    if (current.key === 'End') {
      depth--;
      continue;
    }

    nestedLog.push({ item: current, depth: depth });

    if (current.withEnd) {
      depth++;
    }
  }

  return nestedLog;
}

export const LogView: React.FC<{ devtool: UpbeatDevtool }> = ({ devtool }) => {
  const logItems = simpleNestedLogs(devtool.getLogs());
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
        {logItems.map(({ item, depth }) => {
          return (
            <li
              key={item.id}
              style={{
                marginLeft: `${depth * 12}px`,
                fontSize: '0.8rem',
                paddingTop: '11px',
                marginTop: '-7px',
                paddingBottom: '4px',
                borderLeft: '1px solid grey',
                borderBottom: '1px solid grey',
                borderBottomLeftRadius: '12px',
              }}
            >
              <Container>
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
                <Content content={item.data} id={`${item.name}:${item.key}`} />
              </Container>
            </li>
          );
        })}
        <div ref={messagesEndRef} />
      </ul>
    </div>
  );
};
