import React, { useContext } from 'react';
import { rundownEditorContext } from './RundownEditorContext';

export const RundownEditorHeader: React.FC = ({}) => {
  const [config] = useContext(rundownEditorContext);

  return (
    <div css={{ display: 'flex' }}>
      {config.displayCols.map((colName) => (
        <div key={colName} css={{ width: config.widthCols[colName] }}>
          {colName}
        </div>
      ))}
    </div>
  );
};
