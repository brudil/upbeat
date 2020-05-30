/**
 * @packageDocumentation
 * @module @upbeat/example-todo
 */

import React from 'react';
import { TodoResource } from '../schema.generated';
import { useUpbeatQuery } from '@upbeat/react';
import { Query } from '@upbeat/client/src';
import { Todo } from './Todo';
import { NewTodo } from './NewTodo';
import { Tags } from './Tags';

export const Application: React.FC = () => {
  const { loading, data } = useUpbeatQuery<TodoResource[]>(
    Query.resource<TodoResource>('Todo')
      .orderBy('order')
      .where('complete', false, Query.Comparator.Equals)
      .all(),
  );

  return (
    <div>
      <h1 className="text-2xl">Upbeat Todo</h1>
      <div className="flex flex-row">
        <div className="p-2 m-2 bg-gray-100 w-1/6 ">
          <h2 className="text-xl font-bold mb-4">Todos</h2>
          {!loading && data !== undefined && (
            <ul>
              {data.map((todo) => (
                <Todo key={todo.id} todo={todo} />
              ))}
            </ul>
          )}
        </div>
        <div className="p-2 m-2 bg-gray-100 w-1/6 ">
          <NewTodo />
        </div>

        <div className="p-2 m-2 bg-gray-100 w-1/6 ">
          <Tags />
        </div>
      </div>
    </div>
  );
};
