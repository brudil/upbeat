import { Interpolation } from '@emotion/core';

export const proseMirrorStyles: Interpolation = {
  '.ProseMirror': {
    position: 'relative',
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
    fontVariantLigatures: 'none',
  },

  '.ProseMirror pre': {
    whiteSpace: 'pre-wrap',
  },
  '.ProseMirror li': {
    position: 'relative',
  },
  '.ProseMirror-hideselection *::selection': { background: 'transparent' },
  '.ProseMirror-hideselection *::-moz-selection': { background: 'transparent' },
  '.ProseMirror-hideselection': { caretColor: 'transparent' },

  '.ProseMirror-selectednode': {
    outline: '2px solid #8cf',
  },

  /* Make sure li selections wrap around markers */

  'li.ProseMirror-selectednode': {
    outline: 'none',
  },

  'li.ProseMirror-selectednode:after': {
    content: "''",
    position: 'absolute',
    left: -32,
    right: -2,
    top: -2,
    bottom: -2,
    border: '2px solid #8cf',
    pointerEvents: 'none',
  },
};
