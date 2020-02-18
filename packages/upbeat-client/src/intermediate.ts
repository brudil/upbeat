import { UpbeatResource } from '@upbeat/types/src';
import { isLaterTimestamp } from '@upbeat/core/src/timestamp';
import { Resource } from '@upbeat/schema/src';
import { UpbeatId } from '../../upbeat-types/src';
import { ResourceOperation, SetOperations } from './operations';
import { Operation, TypedOperation } from './operations';
import { Property, Schema, Type } from '../../upbeat-schema/src';
import { UpbeatInvalidApplication } from './errors';

interface StringProperty {
  type: 'String';
  operation?: ResourceOperation<string>;
}

interface BooleanProperty {
  type: 'Boolean';
  operation?: ResourceOperation<string>;
}

interface SetProperty<T> {
  type: 'Set';
  operations: ResourceOperation<SetOperations<T>>[];
}

type PropertyWrapper = StringProperty | BooleanProperty | SetProperty<unknown>;

interface RealiseHandler {
  (property: PropertyWrapper): any;
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

function getHandlersForType(type: Type): TypeDefinition {
  if (typeDefinitionMap.hasOwnProperty(type.identifier)) {
    return typeDefinitionMap[type.identifier];
  }

  throw new UpbeatInvalidApplication(
    `Handlers for type ${type.identifier} (${JSON.stringify(
      type.subtype,
    )}) do not exist.`,
  );
}

export interface IntermediateResource {
  id?: UpbeatId;
  resourceSchema: Resource;
  properties: {
    [property: string]: PropertyWrapper;
  };
}
export type IntermediateResourceMap = { [id: string]: IntermediateResource };

type OperationApplicationResponse = [boolean, IntermediateResource];

function getIntermediatePropertyType(prop: Property): PropertyWrapper {
  if (prop.type.identifier === 'Boolean') {
    return {
      type: 'Boolean',
      operation: undefined,
    };
  }

  if (prop.type.identifier === 'String') {
    return {
      type: 'String',
      operation: undefined,
    };
  }

  if (prop.type.identifier === 'Set') {
    return {
      type: 'Set',
      operations: [],
    };
  }
  if (prop.type.identifier === 'Orderable') {
    return {
      type: 'Set',
      operations: [],
    };
  }

  throw new UpbeatInvalidApplication(
    `Property type "${prop.type.identifier}" not defined!`,
  );
}

export function createIntermediateResourceForResource(
  resource: Resource,
  id: UpbeatId,
): IntermediateResource {
  return {
    ...resource,
    id,
    resourceSchema: resource,
    properties: Object.fromEntries(
      Object.entries(resource.properties).map(([prop, value]) => [
        prop,
        getIntermediatePropertyType(value),
      ]),
    ),
  };
}

/**
 * From a list of operations, a intermediate representation is constructed and
 * returned
 */
export async function buildIntermediateResourceFromOperations<
  R extends UpbeatResource
>(
  schema: Schema,
  operations: TypedOperation<R['_type'], Extract<keyof R, string>>[],
): Promise<IntermediateResourceMap> {
  const resources: IntermediateResourceMap = {};

  operations.forEach((op) => {
    if (!resources.hasOwnProperty(op.resourceId)) {
      resources[op.resourceId] = createIntermediateResourceForResource(
        schema.resources[op.resource],
        op.resourceId,
      );
    }

    const resource = resources[op.resourceId];
    resources[op.resourceId] = applyOperationToIntermediateResource(
      resource,
      op,
    )[1];
  });

  return resources;
}

interface OperationApplicationHandler {
  (
    resource: IntermediateResource,
    operation: Operation,
  ): OperationApplicationResponse;
}

/**
 * Takes an operation and the intermediate resource to see if the resource
 * will change having been applied. Returns if it has changed, the
 * next intermediate representation.
 *
 * TODO: Is this the right place for the hasChanged?
 *  Sometimes ops will be non-ops, but unique - think two adds in a set
 *
 */
export function applyOperationToIntermediateResource(
  resource: IntermediateResource,
  operation: Operation,
): OperationApplicationResponse {
  const propertySchema = resource.resourceSchema.properties[operation.property];

  if (!propertySchema) {
    throw new UpbeatInvalidApplication(
      `Given property in operation "${operation.property}" does not exist within ${operation.resource} schema`,
    );
  }

  const operationApplication = getHandlersForType(propertySchema.type)
    .application;

  return operationApplication(resource, operation);
}

/**
 * Turns a IntermediateResource in to a Resource.
 * */
export function realiseIntermediateResource(
  resourceCache: IntermediateResource,
) {
  const properties = Object.fromEntries(
    Object.entries(resourceCache.properties).map(([key, value]) => {
      const type = getHandlersForType(
        resourceCache.resourceSchema.properties[key].type,
      );

      return [key, type.realise(value)];
    }),
  );

  return { id: resourceCache.id, ...properties };
}
