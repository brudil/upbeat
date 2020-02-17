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

export async function constructObjectFromOperations<R extends UpbeatResource>(
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
