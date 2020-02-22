import { Type } from '../../../upbeat-schema/src';
import { UpbeatInvalidApplication } from '../errors';
import { TypeDefinition, TypeDefinitionMap } from './interfaces';
import { lastWriteWinsType } from './types/lastWriteWins';

const typeDefinitionMap: TypeDefinitionMap = {
  String: lastWriteWinsType,
  Boolean: lastWriteWinsType,
  Orderable: lastWriteWinsType,
  Set: lastWriteWinsType,
};

/**
 * Given a type identifier, return a TypeDefinition
 */
export function getHandlersForType(type: Type): TypeDefinition {
  if (typeDefinitionMap.hasOwnProperty(type.identifier)) {
    return typeDefinitionMap[type.identifier];
  }

  throw new UpbeatInvalidApplication(
    `Handlers for type ${type.identifier} (${JSON.stringify(
      type.subtype,
    )}) do not exist.`,
  );
}
