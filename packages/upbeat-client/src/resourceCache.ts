import {
  Operation,
  IntermediateResource,
  IntermediateResourceMap,
} from './types';
import { UpbeatId } from '../../upbeat-types/src';
import { UpbeatPersistence } from './persistance';
import {
  applyOperationToIntermediateResource,
  constructObjectFromOperations,
} from './materialiser';

/*
 * ResourceCache
 * We need a intermediate type for quick in-memory comparision when new
 * operations come in.
 *
 * The ResourceCache of an resource instance is the same shape as the resource,
 * but each property contains the latest operation, rather than just the value.
 *
 * */

export function realiseIntermediateResource(
  resourceCache: IntermediateResource,
) {
  const properties = Object.entries(resourceCache.properties).reduce(
    (obj, [key, value]) => ({ ...obj, [key]: (value as Operation).value }),
    {},
  );

  return { id: resourceCache.id, ...properties };
}

export function realiseIntermediateResourceMap(map: IntermediateResourceMap) {
  return Object.keys(map).reduce(
    (obj, key) => ({
      ...obj,
      [key]: realiseIntermediateResource(map[key]),
    }),
    {},
  );
}

interface ResourceCache {}

const cacheKey = (resourceName: string, id: string) => `${resourceName}#${id}`;

export function createResourceCache(persistence: UpbeatPersistence) {
  const cache = new Map<string, IntermediateResource>();

  /*
   *
   * */
  const getIntermediateById = async (
    resourceName: string,
    id: UpbeatId,
  ): Promise<IntermediateResource> => {
    const resource = cache.get(cacheKey(resourceName, id));

    if (resource) {
      return resource;
    }

    try {
      const operations = await persistence.getOperationsByResourceKey(
        resourceName,
        id,
      );

      if (operations.length <= 0) {
        throw new Error('no ops');
      }

      const intermediate = await constructObjectFromOperations({}, operations);
      cache.set(cacheKey(resourceName, id), intermediate[id]);

      return intermediate[id];
    } catch (e) {
      return { id, properties: {} };
    }
  };

  return {
    async applyOperation(operation: Operation) {
      const resource = await getIntermediateById(
        operation.resource,
        operation.resourceId,
      );

      const [hasChanged, nextResource] = applyOperationToIntermediateResource(
        resource,
        operation,
      );
      cache.set(
        cacheKey(operation.resource, operation.resourceId),
        nextResource,
      );
      if (hasChanged) {
        console.log(
          operation.resource + 'Resource',
          realiseIntermediateResource(nextResource),
        );
        try {
          await persistence._UNSAFEDB.put(
            operation.resource + 'Resource',
            realiseIntermediateResource(nextResource),
          );
        } catch (e) {
          console.error(e);
          console.log('failed save of op');
        }
      }
    },
    async getById(resourceName: string, id: UpbeatId) {
      return realiseIntermediateResource(
        await getIntermediateById(resourceName, id),
      );
    },
  };
}
