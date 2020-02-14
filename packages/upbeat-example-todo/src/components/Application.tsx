import React, { useCallback, useState } from 'react';
import { Todo } from '../schema.generated';
import { useUpbeat, useUpbeatState } from '../../../upbeat-react/src/react';
import { create, update } from '../../../upbeat-client/src/changeset';

export const Application = () => {
  const { loading, data } = useUpbeatState((db) => db.getAll('TodoResource'));
  const client = useUpbeat();
  // const todos = [{ id: '1', name: 'buy milk', completed: false }, { id: '2', name: 'finish cue', completed: false }, { id: '3', name: 'build todo example', completed: true }];

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
                <li>
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
      </div>
    </div>
  );
};
