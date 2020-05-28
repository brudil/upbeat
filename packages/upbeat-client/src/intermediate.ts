/**
 * @packageDocumentation
 * @module @upbeat/client/intermediate
 */

import { Schema, Resource } from '@upbeat/schema/src';
import { UpbeatId } from '../../upbeat-types/src';
import { MapIntermediateAtom, MapOperations, MapType } from './crdt/types/Map';
import { SerialisedResourceOperation } from './operations';
import { getHandlersForType } from './crdt';

export interface IntermediateResource {
  id?: UpbeatId;
  resourceSchema: Resource;
  value: MapIntermediateAtom;
  tombstone: boolean;
}
export type IntermediateResourceMap = { [id: string]: IntermediateResource };

export function createIntermediateResourceForResource(
  resource: Resource,
  id: UpbeatId,
): IntermediateResource {
  return {
    id,
    resourceSchema: resource,
    value: MapType.create(resource),
    tombstone: false,
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
  operation: SerialisedResourceOperation,
): [boolean, IntermediateResource] {
  // const propertySchema = resource.resourceSchema.properties[operation.property];
  //
  // if (!propertySchema) {
  //   throw new UpbeatInvalidApplication(
  //     `Given property in operation "${operation.property}" does not exist within ${operation.resource} schema`,
  //   );
  // }
  const [changed, mapAtom] = MapType.apply(
    resource.value,
    {
      fullOperation: operation,
      atomOperation: operation.operation[0] as MapOperations,
    },
    (res: any) => {
      return getHandlersForType(
        resource.resourceSchema.properties[
          (operation.operation[0] as MapOperations).property
        ].type,
      ).apply(
        res,
        {
          fullOperation: operation,
          atomOperation: operation.operation[1] as any, // todo
        },
        null,
      )[1];
    },
  );
  return [
    changed,
    {
      ...resource,
      value: mapAtom,
    },
  ];
}

/**
 * From a list of operations, a intermediate representation is constructed and
 * returned
 */
export async function buildIntermediateResourceFromOperations(
  schema: Schema,
  operations: SerialisedResourceOperation[],
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
