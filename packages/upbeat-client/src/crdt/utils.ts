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
export interface OperationWrapper<O> {
  atomOperation: O;
  fullOperation: BaseOperation;
}

/**
 * Holds everything needed for a type: create, realise, apply.
 */
export interface TypeDefinition<N extends string, I, A, O> {
  name: N;
  /**
   * Create a empty intermediate atom for the type
   */
  create(): I;

  /**
   * Realise a intermediate atom in to the types app atom
   */
  realise(property: I, handleType: (...a: any[]) => unknown): A;

  /**
   * Applies an operation of the type to the intermediate atom,
   * returning a new intermediate atom
   */
  apply(intermediate: I, operation: OperationWrapper<O>): [boolean, I];
}

/**
 * Create a CRDT Type
 */
export function createType<I, A, O, N extends string>(
  name: N,
  config: Omit<TypeDefinition<N, I, A, O>, 'name'>,
): TypeDefinition<N, I, A, O> {
  return { name, ...config };
}
