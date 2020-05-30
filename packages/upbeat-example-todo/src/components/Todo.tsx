import React from 'react';
import { Changeset } from '@upbeat/client/src';
import { useUpbeatChangeset } from '@upbeat/react';
import { ResourcesSchema, TodoResource } from '../schema.generated';

export const Todo: React.FC<{ todo: TodoResource }> = ({ todo }) => {
  const deleteTodo = useUpbeatChangeset((id: string) =>
    Changeset.update<ResourcesSchema, 'Todo'>('Todo', id, { tombstone: true }),
  );
  const checkTodo = useUpbeatChangeset((todo: TodoResource) =>
    Changeset.update<ResourcesSchema, 'Todo'>('Todo', todo.id, {
      complete: !todo.complete,
    }),
  );

  return (
    <li key={todo.id}>
      <input
        type="checkbox"
        checked={todo.complete}
        onChange={() => checkTodo(todo)}
      />
      {todo.name}
      {todo.tags.map((tag) => (
        <small>{`tag:${tag}`}</small>
      ))}
      <button
        onClick={() => deleteTodo(todo.id)}
        className="text-sm bg-red-900 text-white font-bold"
      >
        x
      </button>
    </li>
  );
};
