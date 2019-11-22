import { createPipelineType } from '../pipeline';
import { Operation, OperationStart } from '../types';

export enum CharOperationTypes {
  DELETE,
  INSERT,
}

export type DeleteCharOperation = Operation<{
  type: CharOperationTypes.DELETE;
}>;

export type InsertCharOperation = Operation<{
  type: CharOperationTypes.INSERT;
  contents: string[];
}>;

export type CharOperations =
  | OperationStart
  | DeleteCharOperation
  | InsertCharOperation;

export const createStringPipeline = createPipelineType<CharOperations>(
  () => 1,
  () => 1,
);
