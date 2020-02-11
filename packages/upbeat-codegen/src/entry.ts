import { Schema, Property } from '@upbeat/schema-parser/dist/types';
import { parseInput } from '@upbeat/schema-parser/dist/parser';

const _terfaceTemplate = (name: string, properties: Property[]) =>
  `export interface ${name} {
  id: UpbeatId;
${Object.values(properties)
  .map((prop) => `  ${prop.identifier}: ${prop.type.identifier};`)
  .join('\n')}
}`;

export function generateTs(schema: Schema) {
  return [
    `export type UpbeatId = string;`,
    ...Object.values(schema.resources).map((res) =>
      _terfaceTemplate(res.identifier, res.properties),
    ),
    ...Object.values(schema.spaces).map((res) =>
      _terfaceTemplate(res.identifier, res.properties),
    ),
  ].join('\n\n');
}

console.log(
  generateTs(
    parseInput(`
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
`),
  ),
);
