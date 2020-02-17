import React, { useCallback, useState } from 'react';
import { Todo } from '../schema.generated';
import { useUpbeat, useUpbeatState } from '../../../upbeat-react/src/react';
import { create, update } from '@upbeat/client/src/changeset';
import { createQuery } from '@upbeat/client/src/query';

export const Application: React.FC = () => {
  const { loading, data } = useUpbeatState(
    createQuery('TodoResource', ({ where }) => where('*', '*')),
  );

  const { loading: tagsLoading, data: tagsData } = useUpbeatState(
    createQuery('TodoTagResource', ({ where }) => where('*', '*')),
  );

  const client = useUpbeat();

  const [newTodo, setNewTodo] = useState('');
  const handleAddToDo = useCallback(() => {
    client.sendOperation(
      create<Todo>('Todo', {
        name: newTodo,
        complete: false,
        order: 3,
        tags: [],
      }),
    );
    setNewTodo('');
  }, [client, newTodo, setNewTodo]);

  const handleToDoCheck = useCallback(
    (todo) => {
      client.sendOperation(
        update<Todo>('Todo', todo.id, { complete: !todo.complete }),
      );
    },
    [client],
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
                <li key={todo.id}>
                  <input
                    type="checkbox"
                    checked={todo.complete}
                    onChange={() => handleToDoCheck(todo)}
                  />
                  {todo.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="p-2 m-2 bg-gray-100 w-1/6 ">
          <h2 className="text-xl font-bold mb-4">New todo</h2>
          <input
            type="text"
            placeholder="todo name"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button onClick={handleAddToDo}>Add Todo</button>
        </div>

        <div className="p-2 m-2 bg-gray-100 w-1/6 ">
          <h2 className="text-xl font-bold mb-4">Tags</h2>
          {!tagsLoading && tagsData !== undefined ? (
            <ul>
              {tagsData.map((tag) => (
                <li key={tag.id}>{tag.name}</li>
              ))}
            </ul>
          ) : null}
          <h2 className="text-xl font-bold mb-4">Create tag</h2>
          <input
            type="text"
            placeholder="todo name"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button onClick={handleAddToDo}>Add Tag</button>
        </div>
      </div>
    </div>
  );
};
