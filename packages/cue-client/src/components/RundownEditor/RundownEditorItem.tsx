import React, { useContext } from 'react';
import { rundownEditorContext } from './RundownEditorContext';

export const RundownEditorItem: React.FC = ({}) => {
  const [config] = useContext(rundownEditorContext);

  console.log(config);

  return (
    <div css={{ display: 'flex' }}>
      {config.displayCols.map((colName) => (
        <div key={colName} css={{ width: config.widthCols[colName] }}>
          x
        </div>
      ))}
    </div>
  );
};
