import { isLaterSerialisedTimestamp } from '@upbeat/core/src/timestamp';
import { createType, OperationWrapper } from '../utils';

export interface LWWSetOp {
  value: unknown;
}
export type LWWOperations = LWWSetOp;

/**
 * LastWriteWins type supports LWW updates for primitives. Used within Maps
 */
export const LastWriteWinsType = createType<
  'LWW',
  { operation?: OperationWrapper<LWWOperations> },
  unknown,
  LWWOperations
>('LWW', {
  apply: (intermediate, operation) => {
    if (
      !intermediate.operation ||
      isLaterSerialisedTimestamp(
        operation.fullOperation.timestamp,
        intermediate.operation.fullOperation.timestamp,
      )
    ) {
      return [true, { operation }];
    }

    return [false, intermediate];
  },
  realise: (property) => {
    return property?.operation?.atomOperation.value ?? null;
  },
  create() {
    return { operation: undefined };
  },
});
