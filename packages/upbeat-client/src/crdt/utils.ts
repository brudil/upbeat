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

import { ResourceOperation } from '../operations';

/**
 * An operation often needs the entire operation, along with the
 */
export interface OperationWrapper<O> {
  atomOperation: O;
  fullOperation: ResourceOperation;
}

/**
 * Holds everything needed for a type: create, realise, apply.
 */
export interface TypeDefinition<N extends string, I, A, O> {
  name: N;
  /**
   * Create a empty intermediate atom for the type
   */
  create(schema: any): I;

  /**
   * Realise a intermediate atom in to the types app atom
   */
  realise(property: I, schema: any): A;

  /**
   * Applies an operation of the type to the intermediate atom,
   * returning a new intermediate atom
   */
  apply(intermediate: I, operation: OperationWrapper<O>): [boolean, I];
}

/**
 * Create a CRDT Type
 */
export function createType<N extends string, I, A, O>(
  name: N,
  config: Omit<TypeDefinition<N, I, A, O>, 'name'>,
): TypeDefinition<N, I, A, O> {
  return { name, ...config };
}

export type OperationsFrom<S> = S extends TypeDefinition<
  string,
  unknown,
  unknown,
  infer O
>
  ? O
  : never;
export type AppAtomFrom<S> = S extends TypeDefinition<
  string,
  unknown,
  infer A,
  unknown
>
  ? A
  : never;
export type IntermediateFrom<S> = S extends TypeDefinition<
  string,
  infer I,
  unknown,
  unknown
>
  ? I
  : never;
