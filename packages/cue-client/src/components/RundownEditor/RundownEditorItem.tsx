import React, { useContext } from 'react';
import { rundownEditorContext } from './RundownEditorContext';

interface RundownEditorItemProps {}

export const RundownEditorItem: React.FC<RundownEditorItemProps> = ({}) => {
  const [config] = useContext(rundownEditorContext);

  console.log(config);

  return (
    <div css={{ display: 'flex' }}>
      {config.displayCols.map((colName) => (
        <div css={{ width: config.widthCols[colName] }}>x</div>
      ))}
    </div>
  );
};
