import React from 'react';
import { RundownEditorHeader } from './RundownEditorHeader';
import { RundownEditorItem } from './RundownEditorItem';
import { RundownEditorProvider } from './RundownEditorContext';

interface RundownEditorProps {}

export const RundownEditor: React.FC<RundownEditorProps> = ({}) => {
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
