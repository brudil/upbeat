import fs from 'fs';
import path from 'path';
import { Schema, Property, Type } from '@upbeat/schema/src';
import { parseInput } from '@upbeat/schema-parser/dist/parser';

const usedTypes = new Set();

const builtInTypes: { [name: string]: string } = {
  String: 'UpbeatString',
  Int: 'UpbeatInt',
  Boolean: 'UpbeatBoolean',
  Reference: 'UpbeatReference',
  Orderable: 'UpbeatOrderable',
  Set: 'UpbeatSet',
};

const typeGen = (type: Type): string => {
  if (builtInTypes.hasOwnProperty(type.identifier)) {
    usedTypes.add(builtInTypes[type.identifier]);
  }

  return (
    (builtInTypes.hasOwnProperty(type.identifier)
      ? builtInTypes[type.identifier]
      : type.identifier) + (type.subtype ? `<${typeGen(type.subtype)}>` : '')
  );
};

const _terfaceTemplate = (name: string, properties: Property[]): string =>
  `export interface ${name} extends UpbeatResource {
  _type: '${name}';
  id: UpbeatId;
${properties
  .map((prop) => `  ${prop.identifier}: ${typeGen(prop.type)};`)
  .join('\n')}
}`;

export function generateTs(schema: Schema): string {
  const file = [
    ...Object.values(schema.resources).map((res) =>
      _terfaceTemplate(res.identifier, Object.values(res.properties)),
    ),
    ...Object.values(schema.spaces).map((res) =>
      _terfaceTemplate(res.identifier, Object.values(res.properties)),
    ),
    `export const schema = ${JSON.stringify(schema)};`,
  ];

  file.unshift(
    `import { UpbeatId, UpbeatResource, ${Array.from(usedTypes.values()).join(
      ', ',
    )}} from '@upbeat/types/src';`,
  );

  return file.join('\n\n');
}

const spec = fs.readFileSync(path.join(process.cwd(), './src/spec.ub'), {
  encoding: 'utf-8',
});

console.log(generateTs(parseInput(spec)));
