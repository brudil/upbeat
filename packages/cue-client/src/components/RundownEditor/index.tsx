import React from 'react';
import { RundownEditorHeader } from './RundownEditorHeader';
import { RundownEditorItem } from './RundownEditorItem';
import { RundownEditorProvider } from './RundownEditorContext';

export const RundownEditor: React.FC = ({}) => {
  return (
    <RundownEditorProvider>
      <div>
        <RundownEditorHeader />
        <RundownEditorItem />
        <RundownEditorItem />
        <RundownEditorItem />
        <RundownEditorItem />
      </div>
    </RundownEditorProvider>
  );
};
