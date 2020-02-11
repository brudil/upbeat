import { CstParser } from 'chevrotain';
import {
  CloseBrace,
  CloseParen,
  Identifier,
  OpenBrace,
  OpenParen,
  ResourceKeyword,
  Semi,
  SpaceKeyword,
  tokens,
  upbeatLexer,
} from './lexer';
import { Property, Resource, Schema, Space, Scope } from './types';

class UpbeatSchemaParser extends CstParser {
  constructor() {
    super(tokens);

    this.performSelfAnalysis();
  }

  private propertyDef = this.RULE('propertyDef', () => {
    this.SUBRULE(this.typeDef);
    this.CONSUME(Identifier);
    this.CONSUME1(Semi);
  });

  private typeDef = this.RULE('typeDef', () => {
    this.CONSUME(Identifier);
    this.OPTION(() => {
      this.CONSUME1(OpenParen);
      this.SUBRULE(this.typeDef);
      this.CONSUME2(CloseParen);
    });
  });

  public resourceDef = this.RULE('resourceDef', () => {
    this.CONSUME(ResourceKeyword);
    this.CONSUME4(Identifier);
    this.CONSUME2(OpenBrace);
    this.AT_LEAST_ONE(() => this.SUBRULE(this.propertyDef));
    this.CONSUME3(CloseBrace);
  });

  public spaceDef = this.RULE('spaceDef', () => {
    this.CONSUME(SpaceKeyword);
    this.CONSUME4(Identifier);
    this.CONSUME2(OpenBrace);
    this.AT_LEAST_ONE(() => this.SUBRULE(this.propertyDef));
    this.CONSUME3(CloseBrace);
  });

  public scopeDef = this.RULE('scopeDef', () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.resourceDef) },
      { ALT: () => this.SUBRULE(this.spaceDef) },
    ]);
  });

  public schemaDef = this.RULE('schemaDef', () => {
    this.AT_LEAST_ONE(() => {
      this.SUBRULE(this.scopeDef);
    });
  });
}

const parser = new UpbeatSchemaParser();
const BaseVisitor = parser.getBaseCstVisitorConstructor();

const mapToIdentifier = (a: { identifier: string }[]) => {
  return a.reduce(
    (obj: any, prop) => ({ ...obj, [prop.identifier]: prop }),
    {},
  );
};

// TODO: see how best to remove any from the context argument
class AstVisitor extends BaseVisitor {
  constructor() {
    super();
    this.validateVisitor();
  }

  schemaDef(ctx: any): Schema {
    const scopes: Scope[] = ctx.scopeDef.map((scope: any) => this.visit(scope));
    return {
      resources: mapToIdentifier(
        scopes
          .filter((scope) => scope.type === 'RESOURCE')
          .map((scope) => scope.value),
      ),
      spaces: mapToIdentifier(
        scopes
          .filter((scope) => scope.type === 'SPACE')
          .map((scope) => scope.value),
      ),
    };
  }

  scopeDef(ctx: any): Scope {
    if (ctx.resourceDef) {
      return { type: 'RESOURCE', value: this.visit(ctx.resourceDef) };
    }

    return { type: 'SPACE', value: this.visit(ctx.spaceDef) };
  }

  typeDef(ctx: any) {
    return {
      type: ctx.Identifier[0].image,
      subtype: ctx.typeDef ? this.visit(ctx.typeDef) : null,
    };
  }

  spaceDef(ctx: any): Space {
    return {
      identifier: ctx.Identifier[0].image,
      properties: mapToIdentifier(
        ctx.propertyDef.map((prop: any) => this.visit(prop)),
      ),
    };
  }

  resourceDef(ctx: any): Resource {
    const Ident = ctx.Identifier[0].image;

    return {
      identifier: Ident,
      properties: mapToIdentifier(
        ctx.propertyDef.map((prop: any) => this.visit(prop)),
      ),
    };
  }

  propertyDef(ctx: any): Property {
    return {
      identifier: ctx.Identifier[0].image,
      type: this.visit(ctx.typeDef),
    };
  }
}

const toAstVisitorInstance = new AstVisitor();

export function parseInput(text: string): Schema {
  const lexingResult = upbeatLexer.tokenize(text);

  parser.input = lexingResult.tokens;
  const cst = parser.schemaDef();

  if (parser.errors.length > 0) {
    throw new Error('Parsing error!' + parser.errors);
  }

  return toAstVisitorInstance.visit(cst);
}
