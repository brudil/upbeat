import React from 'react';
import { Changeset } from '@upbeat/client/src';
import { useUpbeatChangeset } from '@upbeat/react/src/react';
import { Todo as TodoSchema } from '../schema.generated';

export const Todo: React.FC<{ todo: TodoSchema }> = ({ todo }) => {
  const deleteTodo = useUpbeatChangeset((id: string) =>
    Changeset.update<TodoSchema>('Todo', id, { tombstone: true }),
  );
  const checkTodo = useUpbeatChangeset((todo: TodoSchema) =>
    Changeset.update<TodoSchema>('Todo', todo.id, { complete: !todo.complete }),
  );

  return (
    <li key={todo.id}>
      <input
        type="checkbox"
        checked={todo.complete}
        onChange={() => checkTodo(todo)}
      />
      {todo.name}
      <button
        onClick={() => deleteTodo(todo.id)}
        className="text-sm bg-red-900 text-white font-bold"
      >
        x
      </button>
    </li>
  );
};
