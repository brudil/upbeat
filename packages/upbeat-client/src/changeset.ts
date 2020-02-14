import { UpbeatResource } from '../../upbeat-types/src';

export interface UpdateChangeset<R> {
  resource: string;
  id: string;
  properties: Partial<R>;
  action: 'UPDATE';
}

export interface CreateChangeset<R> {
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
