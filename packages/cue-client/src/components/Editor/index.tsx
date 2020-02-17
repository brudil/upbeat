import React from 'react';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { useEffect, useRef } from 'react';
import { schema } from './schema';
import { baseKeymap } from 'prosemirror-commands';
import { keymap } from 'prosemirror-keymap';
import { redo, undo, history } from 'prosemirror-history';
import { Global } from '@emotion/core';
import { proseMirrorStyles } from './styles';

export const Editor: React.FC = () => {
  const ref = useRef<null | HTMLDivElement>(null);
  const stateRef = useRef<null | EditorState>(null);
  const viewRef = useRef<null | EditorView>(null);

  useEffect(() => {
    if (ref.current !== null) {
      stateRef.current = EditorState.create({
        schema,
        plugins: [
          history(),
          keymap({ 'Mod-z': undo, 'Mod-y': redo }),
          keymap(baseKeymap),
        ],
      });
      viewRef.current = new EditorView(ref.current, {
        state: stateRef.current,
        dispatchTransaction(transaction) {
          console.log(
            'Document size went from',
            transaction.before.content.size,
            'to',
            transaction.doc.content.size,
          );
          if (viewRef.current !== null) {
            const view = viewRef.current;
            const newState = view.state.apply(transaction);
            view.updateState(newState);
          }
        },
      });
    }
  }, [ref]);

  return (
    <div
      css={{
        padding: '0 2rem',
      }}
    >
      <Global styles={proseMirrorStyles} />
      <div
        ref={ref}
        css={{
          padding: '1rem',
          fontFamily: 'Courier',
          minHeight: 400,
          maxWidth: 880,
          margin: 'auto',
          borderRadius: 6,
          boxShadow: '0 3px 16px rgba(40, 40, 40, 0.2)',
        }}
      />
    </div>
  );
};
