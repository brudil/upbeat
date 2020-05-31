/**
 * @packageDocumentation
 * @module @upbeat/client/changeset
 */

import { ChangesetResource } from '../../upbeat-types/src';
import { Schema } from '@upbeat/schema/src';
import { serialiseTimestamp, Timestamp } from '@upbeat/core';
import { SerialisedResourceOperation } from './operations';
import { v4 as uuid } from 'uuid';
import { getHandlersForType } from './crdt';
import { log } from './debug';

/**
 * Changesets. Changesets are largely, probably, a Good Idea(TM).
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
  properties: Partial<ChangesetResource<R>>;
  action: 'UPDATE';
}

interface CreateChangeset<R> {
  resource: string;
  properties: Omit<Omit<ChangesetResource<R>, 'id'>, '_type'>;
  action: 'CREATE';
}

export type Changeset<R> = CreateChangeset<R> | UpdateChangeset<R>;

/**
 * Create changeset helper, takes the ResourceSchema along with the name of the
 * resource for type safety.
 */
export function create<R, N extends keyof R = keyof R>(
  resourceName: N,
  properties: Omit<Omit<ChangesetResource<R[N]>, 'id'>, '_type'>,
): Changeset<R[N]> {
  return {
    action: 'CREATE',
    properties,
    resource: resourceName as string,
  };
}

/**
 * Update changeset helper, takes the ResourceSchema along with the name of the
 * resource for type safety.
 */
export function update<R, N extends keyof R>(
  resourceName: N,
  id: string,
  properties: Partial<ChangesetResource<R[N]>>,
): Changeset<R[N]> {
  return {
    action: 'UPDATE',
    properties,
    id,
    resource: resourceName as string,
  };
}

/**
 * Convenience export for importing Changeset helpers.
 */
export const Changeset = {
  create,
  update,
};

/**
 * Creates a series of operations from a single changeset.
 *
 * This works by using the resources' schema to determine the correct operations
 * for any specific type.
 */
export function createOperationsFromChangeset(
  changeset: Changeset<unknown>,
  schema: Schema,
  now: () => Timestamp,
): SerialisedResourceOperation[] {
  const operations: SerialisedResourceOperation[] = [];
  // we get a changeset
  // we look at the schema
  // for each prop we defer to the schema given handler for that property (think deep)
  // this generates operations
  const endBuild = log('Changeset', 'Build', '', true);
  const id = changeset.action === 'CREATE' ? uuid() : changeset.id;

  for (const [prop, value] of Object.entries(changeset.properties)) {
    if (!schema.resources[changeset.resource].properties.hasOwnProperty(prop)) {
      throw new Error(`given property does not exist in schema: ${prop}`);
    }

    const type = schema.resources[changeset.resource].properties[prop].type;

    const handler = getHandlersForType(type);

    let internalOp: any = null;
    switch (handler.name) {
      case 'LWW':
        internalOp = {
          value,
        };
        break;
      case 'SET':
        if ((value as any).add.length > 0) {
        }
        internalOp = { type: 'ADD', value: (value as any).add[0] };
        break;
    }

    const operation: SerialisedResourceOperation = {
      resourceId: id,
      resource: changeset.resource,
      operation: [
        {
          type: 'SELECT',
          property: prop,
        },
        internalOp,
      ],
      timestamp: serialiseTimestamp(now()),
    };

    log('Changeset', 'Operation', JSON.stringify(operation));
    operations.push(operation);
  }

  endBuild();

  return operations;
}
