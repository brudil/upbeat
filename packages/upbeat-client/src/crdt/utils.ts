/*
 * What is a type and what does it do?
 *
 * A type is a basic atom within our CRDT.
 *
 * A type describes:
 *  - the shape of it to the application
 *  - the shape of its internal representation
 *  - the operations it accepts
 *
 * A type consists of three methods:
 *  - create: create an empty intermediate atom
 *  - apply: given the current intermediate atom, and an operation return the
 *    next internal atom.
 *  - realise: given the intermediate atom, return the application state.
 * */

import { BaseOperation } from '../operations';

/**
 * An operation often needs the entire operation, along with the
 */
interface OperationWrapper<O> {
  atomOperation: O;
  fullOperation: BaseOperation;
}

/**
 * Applies an operation to the intermediate atom, returning a new intermediate
 * atom
 */
export interface TypeOperationApplication<I, O> {
  (resource: I, operation: OperationWrapper<O>): [boolean, I];
}

/**
 * TypeRealise handles turning a intermediate atom in to a app atom.
 */
export interface TypeRealise<I, A> {
  (property: I): A;
}

/**
 * Holds everything needed for a type: create, realise, apply.
 */
export interface TypeDefinition<I, A, O> {
  /**
   * Create a empty intermediate atom for the type
   */
  create(): I;

  /**
   * Realise a intermediate atom in to the types app atom
   */
  realise: TypeRealise<I, A>;

  /**
   * Apply a operation of the type of to the intermediate atom
   */
  apply: TypeOperationApplication<I, O>;
}

/**
 * Create a CRDT Type
 */
export function createType<I, A, O>(config: {
  apply: TypeOperationApplication<I, O>;
  realise: TypeRealise<I, A>;
  create: () => I;
}): TypeDefinition<I, A, O> {
  return config;
}
