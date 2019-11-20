import { DOMOutputSpec, Schema } from 'prosemirror-model';

const characterDom: DOMOutputSpec = [
  'div',
  {
    class: 'editor-character-node',
    style: 'text-transform:uppercase;color: red;',
  },
  0,
];
const parentheticalDom: DOMOutputSpec = [
  'div',
  {
    class: 'editor-parenthetical-node',
    style: 'font-style: italic;color:grey',
  },
  0,
];
const dialogueDom: DOMOutputSpec = [
  'div',
  { class: 'dialogue-character-node', style: 'color:black' },
  0,
];

export const schema = new Schema({
  nodes: {
    doc: { content: '(character | dialogue | parenthetical)+' },
    character: {
      content: 'text*',
      toDOM() {
        return characterDom;
      },
      parseDOM: [{ tag: '.editor-character-node' }],
    },
    parenthetical: {
      content: 'text*',
      toDOM() {
        return parentheticalDom;
      },
      parseDOM: [{ tag: '.editor-parenthetical-node' }],
    },
    dialogue: {
      content: 'text*',
      toDOM() {
        return dialogueDom;
      },
      parseDOM: [{ tag: '.editor-dialogue-node' }],
    },
    text: {},
  },
});
