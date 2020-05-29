/**
 * @packageDocumentation
 * @module @upbeat/client/types
 */

import { Type } from '@upbeat/schema/src';
import { UpbeatInvalidApplication } from '../errors';
import { LastWriteWinsType } from './types/lastWriteWins';
import { MapType } from './types/Map';
import { SetType } from './types/Set';

const typeDefinitionMap: { [key: string]: CRDTTypes } = {
  String: LastWriteWinsType,
  Boolean: LastWriteWinsType,
  Orderable: LastWriteWinsType,
  Set: SetType,
};

export type CRDTTypes =
  | typeof LastWriteWinsType
  | typeof MapType
  | typeof SetType;

/**
 * Given a type identifier, return a TypeDefinition
 */
export function getHandlersForType(type: Type): CRDTTypes {
  if (typeDefinitionMap.hasOwnProperty(type.identifier)) {
    return typeDefinitionMap[type.identifier];
  }

  throw new UpbeatInvalidApplication(
    `Handlers for type ${type.identifier} (${JSON.stringify(
      type.subtype,
    )}) do not exist.`,
  );
}
