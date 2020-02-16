import { ResourceCache, ResourceCacheMap } from './types';

export function normaliseResourceCache<R>(resourceCache: ResourceCache<R>) {
  return Object.keys(resourceCache).reduce(
    (obj, key) => ({ ...obj, [key]: resourceCache[key].value }),
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
