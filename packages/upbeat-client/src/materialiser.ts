import { UpbeatResource } from '../../upbeat-types/src';
import { ResourceCacheMap, TypedOperation } from './types';
import { isLaterTimestamp } from '../../upbeat-core/src/timestamp';
import { Resource } from '@upbeat/schema-parser/src/types';

export async function constructObjectFromOperations<R extends UpbeatResource>(
  _resourceSchema: Resource,
  operations: TypedOperation<R['_type'], Extract<keyof R, string>>[],
): Promise<ResourceCacheMap<R>> {
  const resources: ResourceCacheMap<R> = {};

  operations.forEach((op) => {
    if (!resources.hasOwnProperty(op.resourceId)) {
      resources[op.resourceId] = {};
    }

    const resource = resources[op.resourceId];
    const timestamp = resource[op.property]?.timestamp;
    if (
      !timestamp ||
      (timestamp && isLaterTimestamp(op.timestamp, timestamp))
    ) {
      resource[op.property] = op;
    }
  });

  return resources;
}
