import { UpbeatResource } from '@upbeat/types/src';
import { Resource } from '@upbeat/schema/src';
import { UpbeatId } from '../../upbeat-types/src';
import { Operation, TypedOperation } from './operations';
import { Property, Schema } from '../../upbeat-schema/src';
import { UpbeatInvalidApplication } from './errors';
import { getHandlersForType } from './crdt';

export interface IntermediateResource {
  id?: UpbeatId;
  resourceSchema: Resource;
  properties: {
    [property: string]: PropertyWrapper;
  };
}
export type IntermediateResourceMap = { [id: string]: IntermediateResource };

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

  getHandlersForType(prop.type.identifier).cre;

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
