import { isLaterTimestamp } from '../../upbeat-core/src/timestamp';
import { Type } from '../../upbeat-schema/src';
import { UpbeatInvalidApplication } from './errors';
import { IntermediateResource, PropertyWrapper } from './intermediate';
import { Operation } from './operations';

interface RealiseHandler {
  (property: PropertyWrapper): any;
}

export type OperationApplicationResponse = [boolean, IntermediateResource];

export interface OperationApplicationHandler {
  (
    resource: IntermediateResource,
    operation: Operation,
  ): OperationApplicationResponse;
}

interface TypeDefinition {
  application: OperationApplicationHandler;
  realise: RealiseHandler;
}

interface TypeDefinitionMap {
  [typeName: string]: TypeDefinition;
}

const lWWPropertyApply: OperationApplicationHandler = (resource, operation) => {
  if (
    !resource?.properties[operation.property]?.operation ||
    isLaterTimestamp(
      operation.timestamp,
      resource.properties[operation.property].operation.timestamp,
    )
  ) {
    return [
      true,
      {
        ...resource,
        properties: {
          ...resource.properties,
          [operation.property]: {
            ...resource.properties[operation.property],
            operation,
          },
        },
      },
    ];
  }

  return [false, resource];
};

const lwwPropertyRealise: RealiseHandler = (property) => {
  return property?.operation?.value;
};

const typeDefinitionMap: TypeDefinitionMap = {
  String: {
    application: lWWPropertyApply,
    realise: lwwPropertyRealise,
  },
  Boolean: {
    application: lWWPropertyApply,
    realise: lwwPropertyRealise,
  },
  Orderable: {
    application: lWWPropertyApply,
    realise: lwwPropertyRealise,
  },
  Set: {
    application: lWWPropertyApply,
    realise: lwwPropertyRealise,
  },
};

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
