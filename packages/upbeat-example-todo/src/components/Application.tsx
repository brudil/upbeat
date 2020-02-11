import React from 'react';

export const Application = () => {
  return (
    <div>
      <h1 className="text-2xl">Upbeat Todo</h1>
      <div className="flex flex-row">
        <div className="p-2 m-2 bg-gray-100 w-1/6 ">
          <h2>Todos</h2>

          <button>Add Todo</button>
        </div>
      </div>
    </div>
  );
};
