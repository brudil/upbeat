/**
 * @packageDocumentation
 * @module @upbeat/schema-parser
 */

import { createToken, Lexer } from 'chevrotain';

export const OpenBrace = createToken({ name: 'OpenBrace', pattern: '{' });
export const CloseBrace = createToken({ name: 'CloseBrace', pattern: '}' });
export const OpenParen = createToken({ name: 'OpenParen', pattern: '(' });
export const CloseParen = createToken({ name: 'CloseParen', pattern: ')' });
export const QuestionMark = createToken({ name: 'QuestionMark', pattern: '?' });
export const GreaterThan = createToken({ name: 'GreaterThan', pattern: '>' });
export const OpenBracket = createToken({ name: 'OpenBracket', pattern: '[' });
export const CloseBracket = createToken({ name: 'CloseBracket', pattern: ']' });
export const Comma = createToken({ name: 'Comma', pattern: ',' });
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
  QuestionMark,
  ResourceKeyword,
  SpaceKeyword,
  WhiteSpace,
  Identifier,
  Semi,
  GreaterThan,
  OpenBracket,
  CloseBracket,
  Comma,
];

export const upbeatLexer = new Lexer(tokens);
