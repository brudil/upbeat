import { UpbeatResource } from '../../upbeat-types/src';

/**
 * Changesets. Changesets are largely, probably, a Good Idea.
 *
 * Operations have specific requirements to meet the meaning within CRDTs.
 * Where as we would sooner client applications not need to think about these
 * requirements where not necessary.
 *
 * Changesets our our client facing API, operations are internal.
 *
 * A one-way transformation is performed. Changeset -> Operation(s)
 */

interface UpdateChangeset<R> {
  resource: string;
  id: string;
  properties: Partial<R>;
  action: 'UPDATE';
}

interface CreateChangeset<R> {
  resource: string;
  properties: Omit<Omit<R, 'id'>, '_type'>;
  action: 'CREATE';
}

export type Changeset<R> = CreateChangeset<R> | UpdateChangeset<R>;

export function create<R extends UpbeatResource>(
  resourceName: R['_type'],
  properties: Omit<Omit<R, 'id'>, '_type'>,
): Changeset<R> {
  return {
    action: 'CREATE',
    properties,
    resource: resourceName,
  };
}

export function update<R extends UpbeatResource>(
  resourceName: R['_type'],
  id: string,
  properties: Partial<R>,
): Changeset<R> {
  return {
    action: 'UPDATE',
    properties,
    id,
    resource: resourceName,
  };
}
