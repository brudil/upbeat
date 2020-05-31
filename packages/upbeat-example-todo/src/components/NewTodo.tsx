import React, { useCallback, useState } from 'react';
import { Changeset, Query } from '@upbeat/client';
import { useUpbeat, useUpbeatQuery } from '@upbeat/react';
import { ResourcesSchema, TodoTagResource } from '../schema.generated';

export const NewTodo: React.FC = () => {
  const client = useUpbeat();

  const { loading: tagsLoading, data: tagsData } = useUpbeatQuery<
    TodoTagResource[]
  >(Query.resource<TodoTagResource>('TodoTag').all());

  const [newTodo, setNewTodo] = useState('');
  const [newTodoTag, setNewTodoTag] = useState('');

  const handleAddToDo = useCallback(() => {
    client.applyChangeset(
      Changeset.create<ResourcesSchema, 'Todo'>('Todo', {
        name: newTodo,
        complete: false,
        order: 3,
        tags: { add: [newTodoTag] },
      }),
    );
    setNewTodo('');
  }, [client, newTodo, setNewTodo]);

  return (
    <React.Fragment>
      <h2 className="text-xl font-bold mb-4">New todo</h2>
      <input
        type="text"
        placeholder="todo name"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
      />
      <select
        value={newTodoTag}
        onChange={(e) => setNewTodoTag(e.target.value)}
      >
        <option value={''} key={-1}>
          None
        </option>
        {!tagsLoading && tagsData !== undefined
          ? tagsData.map((tag) => (
              <option value={tag.id} key={tag.id}>
                {tag.name}
              </option>
            ))
          : null}
      </select>
      <br />
      <button onClick={handleAddToDo}>Add Todo</button>
    </React.Fragment>
  );
};
