import React, { useContext } from 'react';
import { rundownEditorContext } from './RundownEditorContext';

interface RundownEditorHeaderProps {}

export const RundownEditorHeader: React.FC<RundownEditorHeaderProps> = ({}) => {
  const [config] = useContext(rundownEditorContext);

  return (
    <div css={{ display: 'flex' }}>
      {config.displayCols.map((colName) => (
        <div css={{ width: config.widthCols[colName] }}>{colName}</div>
      ))}
    </div>
  );
};
