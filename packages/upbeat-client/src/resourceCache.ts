/**
 * @packageDocumentation
 * @module @upbeat/client/resourceCache
 */

import { UpbeatId } from '../../upbeat-types/src';
import {
  applyOperationToIntermediateResource,
  buildIntermediateResourceFromOperations,
  createIntermediateResourceForResource,
  IntermediateResource,
  realiseIntermediateResource,
} from './intermediate';
import { log } from './debug';
import { Schema } from '@upbeat/schema/src';
import { UpbeatPersistence } from './persistence/interfaces';
import { SerialisedResourceOperation } from './operations';

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
  applyOperation(operation: SerialisedResourceOperation): Promise<void>;

  /**
   * Get a resource instance by resource and ID. Uses cache where possible,
   * constructing and caching otherwise.
   **/
  // getById<X>(resourceName: string, id: UpbeatId): Promise<X>;
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
          if (nextResource.tombstone) {
            log(
              'ResourceCache',
              `Deleting ${operation.resource}#${nextResource.id}`,
            );
            if (nextResource.id) {
              await persistence.deleteResourceObject(
                operation.resource,
                nextResource.id,
              );
            }
          } else {
            log(
              'ResourceCache',
              'Persist',
              `${operation.resource}#${nextResource.id}`,
            );
            await persistence.putResourceObject(
              operation.resource,
              realiseIntermediateResource(nextResource),
            );
          }
        } catch (e) {
          console.error(e);
          console.log('failed save of op');
        }
      }
    },
    // async getById<R>(resourceName, id): Promise<R> {
    //   return realiseIntermediateResource(
    //     await getIntermediateById(resourceName, id),
    //   );
    // },
  };
}
