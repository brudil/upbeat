import { upbeatLexer } from '../lexer';
import { parseInput } from '../parser';

const SPEC = `
resource Todo {
  String name;
  Boolean complete;
  CreatedDate createdAt;
  User user;
  Tag tags;
  Int order;
}

resource Tag {
  String name;
  String color;
}

space Project {
  Todo todos;
}
`;

const BAD_SPEC = `
res Do_C {
  String name;
}
`;

describe('spec', () => {
  it('does not fail to lex', () => {
    const lexingResult = upbeatLexer.tokenize(SPEC);
    expect(lexingResult.errors.length).toBe(0);
  });

  it('bad formatting to fail', () => {
    const parseAst = () => parseInput(BAD_SPEC);

    expect(parseAst).toThrow();
  });

  it('has found resources and spaces', () => {
    const ast = parseInput(SPEC);

    expect(Object.keys(ast.spaces).length).toBe(1);
    expect(Object.keys(ast.resources).length).toBe(2);
  });
});
