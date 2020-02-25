import { Schema, Resource } from '@upbeat/schema/src';
import { UpbeatId } from '../../upbeat-types/src';
import { MapIntermediateAtom, MapType } from './crdt/types/Map';
import { ResourceOperation } from './operations';

export interface IntermediateResource {
  id?: UpbeatId;
  resourceSchema: Resource;
  value: MapIntermediateAtom;
}
export type IntermediateResourceMap = { [id: string]: IntermediateResource };

export function createIntermediateResourceForResource(
  resource: Resource,
  id: UpbeatId,
): IntermediateResource {
  return {
    ...resource,
    id,
    resourceSchema: resource,
    value: MapType.create(resource),
  };
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
  operation: ResourceOperation,
): [boolean, any] {
  // const propertySchema = resource.resourceSchema.properties[operation.property];
  //
  // if (!propertySchema) {
  //   throw new UpbeatInvalidApplication(
  //     `Given property in operation "${operation.property}" does not exist within ${operation.resource} schema`,
  //   );
  // }

  return MapType.apply(resource.value, {
    fullOperation: operation,
    atomOperation: operation.operation[0],
  });
}

/**
 * From a list of operations, a intermediate representation is constructed and
 * returned
 */
export async function buildIntermediateResourceFromOperations(
  schema: Schema,
  operations: ResourceOperation[],
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
 * Turns a IntermediateResource in to a Resource.
 * */
export function realiseIntermediateResource(
  resourceCache: IntermediateResource,
) {
  const properties = MapType.realise(
    resourceCache.value,
    resourceCache.resourceSchema,
  );

  return { id: resourceCache.id, ...properties };
}
