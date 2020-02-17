import { UpbeatResource } from '@upbeat/types/src';
import {
  IntermediateResource,
  IntermediateResourceMap,
  Operation,
  TypedOperation,
} from './types';
import { isLaterTimestamp } from '@upbeat/core/src/timestamp';
import { Resource } from '@upbeat/schema-parser/src/types';

type OperationApplicationResponse = [boolean, IntermediateResource];

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
  if (
    !resource?.properties[operation.property]?.timestamp ||
    isLaterTimestamp(
      operation.timestamp,
      resource.properties[operation.property].timestamp,
    )
  ) {
    return [
      true,
      {
        ...resource,
        properties: { ...resource.properties, [operation.property]: operation },
      },
    ];
  }

  return [false, resource];
}

/**
 * From a list of operations, a intermediate representation is constructed and
 * returned
 */
export async function buildIntermediateResourceFromOperations<
  R extends UpbeatResource
>(
  _resourceSchema: Resource,
  operations: TypedOperation<R['_type'], Extract<keyof R, string>>[],
): Promise<IntermediateResourceMap> {
  const resources: IntermediateResourceMap = {};

  operations.forEach((op) => {
    if (!resources.hasOwnProperty(op.resourceId)) {
      resources[op.resourceId] = { id: op.resourceId, properties: {} };
    }

    const resource = resources[op.resourceId];
    resources[op.resourceId] = applyOperationToIntermediateResource(
      resource,
      op,
    )[1];
  });

  return resources;
}
