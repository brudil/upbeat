import { ResourceCache, ResourceCacheMap } from './types';

/*
 * ResourceCache
 * We need a intermediate type for quick in-memory comparision when new
 * operations come in.
 *
 * The ResourceCache of an resource instance is the same shape as the resource,
 * but each property contains the latest operation, rather than just the value.
 *
 * */

export function normaliseResourceCache<R>(resourceCache: ResourceCache<R>) {
  return Object.entries(resourceCache).reduce(
    (obj, [key, value]) => ({ ...obj, [key]: value }),
    {},
  );
}

export function normaliseResourceCacheMap<R>(map: ResourceCacheMap<R>) {
  return Object.keys(map).reduce(
    (obj, key) => ({
      ...obj,
      [key]: { id: key, ...normaliseResourceCache(map[key]) },
    }),
    {},
  );
}
