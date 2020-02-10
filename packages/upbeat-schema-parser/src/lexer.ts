import { createToken, Lexer } from 'chevrotain';

export const OpenBrace = createToken({ name: 'OpenBrace', pattern: '{' });
export const CloseBrace = createToken({ name: 'CloseBrace', pattern: '}' });
export const OpenParen = createToken({ name: 'OpenParen', pattern: '(' });
export const CloseParen = createToken({ name: 'CloseParen', pattern: ')' });
export const ResourceKeyword = createToken({
  name: 'ResourceKeyword',
  pattern: 'resource',
});
export const SpaceKeyword = createToken({
  name: 'SpaceKeyword',
  pattern: 'space',
});
export const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

export const Identifier = createToken({
  name: 'Identifier',
  pattern: /[a-zA-Z]+/,
});
export const Semi = createToken({ name: 'Semi', pattern: ';' });

export const tokens = [
  OpenBrace,
  CloseBrace,
  OpenParen,
  CloseParen,
  ResourceKeyword,
  SpaceKeyword,
  WhiteSpace,
  Identifier,
  Semi,
];

export const upbeatLexer = new Lexer(tokens);
