import { UpbeatId } from '../../upbeat-types/src';
import { UpbeatPersistence } from './persistence';
import {
  applyOperationToIntermediateResource,
  buildIntermediateResourceFromOperations,
  createIntermediateResourceForResource,
  IntermediateResource,
  realiseIntermediateResource,
} from './intermediate';
import { log } from './debug';
import { Schema } from '../../upbeat-schema/src';
import { Operation } from './operations';

/**
 * ResourceCache
 * We need a intermediate type for quick in-memory comparision when new
 * operations come in.
 *
 * The ResourceCache of an resource instance is the same shape as the resource,
 * but each property contains the latest operation, rather than just the value.
 *
 * */

/**
 * Creates a cache key used within the ResourceCache, combing resourceName and ID
 * */
const cacheKey = (resourceName: string, id: string): string =>
  `${resourceName}#${id}`;

/**
 * A ResourceCache handles
 * - Applying operations to persistence
 * - Getting resource instances
 *
 * It is an optimisation so that every update and query doesn't rely on the
 * backing data store for getting operations.
 */
interface ResourceCache {
  /**
   * Applies operation locally, persisting when possible.
   * */
  applyOperation(operation: Operation): Promise<void>;

  /**
   * Get a resource instance by resource and ID. Uses cache where possible,
   * constructing and caching otherwise.
   **/
  getById(resourceName: string, id: UpbeatId): Promise<any>;
}

export function createResourceCache(
  schema: Schema,
  persistence: UpbeatPersistence,
): ResourceCache {
  const cache = new Map<string, IntermediateResource>();

  /**
   * Gets a intermediate representation of an resource instance
   *
   * This works by getting all operations for the instance and applying them
   * according to the schema. (TODO)
   *
   * In the future, we hope to used persisted caches, for performance after
   * reloads
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

      const intermediate = await buildIntermediateResourceFromOperations(
        schema,
        operations,
      );

      cache.set(cacheKey(resourceName, id), intermediate[id]);

      return intermediate[id];
    } catch (e) {
      return createIntermediateResourceForResource(
        schema.resources[resourceName],
        id,
      );
    }
  };

  return {
    async applyOperation(operation) {
      const resource = await getIntermediateById(
        operation.resource,
        operation.resourceId,
      );

      console.log(resource);

      const [hasChanged, nextResource] = applyOperationToIntermediateResource(
        resource,
        operation,
      );

      cache.set(
        cacheKey(operation.resource, operation.resourceId),
        nextResource,
      );

      if (hasChanged) {
        try {
          if (nextResource.properties.tombstone) {
            log(
              'ResourceCache',
              `Deleting ${operation.resource}#${nextResource.id}`,
            );
            await persistence._UNSAFEDB.delete(
              operation.resource + 'Resource',
              nextResource.id,
            );
          } else {
            log(
              'ResourceCache',
              `Persisting ${operation.resource}#${nextResource.id}`,
            );
            await persistence._UNSAFEDB.put(
              operation.resource + 'Resource',
              realiseIntermediateResource(nextResource),
            );
          }
        } catch (e) {
          console.error(e);
          console.log('failed save of op');
        }
      }
    },
    async getById(resourceName, id) {
      return realiseIntermediateResource(
        await getIntermediateById(resourceName, id),
      );
    },
  };
}
