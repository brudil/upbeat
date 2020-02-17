import React, { createContext, useState } from 'react';

interface RundownEditorUIState {
  displayCols: string[];
  widthCols: {
    [col: string]: number;
  };
}

export const rundownEditorContext = createContext<[RundownEditorUIState, any]>([
  { displayCols: [], widthCols: {} },
  () => {},
]);

export const RundownEditorProvider: React.FC = ({ children }) => {
  const [state, setState] = useState({
    displayCols: ['itemId', 'name', 'notes', 'type'],
    widthCols: {
      itemId: 50,
      name: 200,
      notes: 100,
      type: 100,
    },
  });

  return (
    <rundownEditorContext.Provider value={[state, setState]}>
      {children}
    </rundownEditorContext.Provider>
  );
};
