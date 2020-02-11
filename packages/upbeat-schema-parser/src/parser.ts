import { CstParser } from 'chevrotain';
import {
  CloseBrace,
  Identifier,
  OpenBrace,
  ResourceKeyword,
  Semi,
  SpaceKeyword,
  tokens,
  upbeatLexer,
} from './lexer';
import { Property, Resource, Schema, Space } from './types';

class UpbeatSchemaParser extends CstParser {
  constructor() {
    super(tokens);

    this.performSelfAnalysis();
  }

  private propertyDef = this.RULE('propertyDef', () => {
    this.CONSUME(Identifier, { LABEL: 'type' });
    this.CONSUME1(Identifier, { LABEL: 'name' });
    this.CONSUME2(Semi);
  });

  public resourceDef = this.RULE('resourceDef', () => {
    this.CONSUME(ResourceKeyword);
    this.CONSUME4(Identifier);
    this.CONSUME2(OpenBrace);
    this.MANY(() => this.SUBRULE(this.propertyDef));
    this.CONSUME3(CloseBrace);
  });

  public spaceDef = this.RULE('spaceDef', () => {
    this.CONSUME(SpaceKeyword);
    this.CONSUME4(Identifier);
    this.CONSUME2(OpenBrace);
    this.MANY(() => this.SUBRULE(this.propertyDef));
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

class AstVisitor extends BaseVisitor {
  constructor() {
    super();
    this.validateVisitor();
  }

  schemaDef(ctx: any): Schema {
    const scopes: any[] = ctx.scopeDef.map((scope: any) => this.visit(scope));
    return {
      resources: scopes
        .filter((scope) => scope.type === 'RESOURCE')
        .map((scope) => scope.value),
      spaces: scopes
        .filter((scope) => scope.type === 'SPACE')
        .map((scope) => scope.value),
    };
  }

  scopeDef(
    ctx: any,
  ): { type: 'RESOURCE'; value: Resource } | { type: 'SPACE'; value: Space } {
    if (ctx.resourceDef) {
      return { type: 'RESOURCE', value: this.visit(ctx.resourceDef) };
    }

    return { type: 'SPACE', value: this.visit(ctx.spaceDef) };
  }

  spaceDef(ctx: any): Space {
    const Ident = ctx.Identifier.map((identToken: any) => identToken.image);

    return {
      identifier: Ident,
      properties: this.visit(ctx.propertyDef),
    };
  }

  resourceDef(ctx: any): Resource {
    const Ident = ctx.Identifier[0].image;

    return {
      identifier: Ident,
      properties: ctx.propertyDef.map((prop: any) => this.visit(prop)),
    };
  }

  propertyDef(ctx: any): Property {
    return {
      identifier: ctx.name[0].image,
      type: { identifier: ctx.type[0].image, subtype: null },
    };
  }
}

const toAstVisitorInstance = new AstVisitor();

export function parseInput(text: string) {
  const lexingResult = upbeatLexer.tokenize(text);

  parser.input = lexingResult.tokens;
  const cst = parser.schemaDef();

  if (parser.errors.length > 0) {
    throw new Error('Parsing error!' + parser.errors);
  }

  return toAstVisitorInstance.visit(cst);
}
