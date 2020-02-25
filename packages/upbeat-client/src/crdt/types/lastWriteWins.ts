import { isLaterTimestamp } from '@upbeat/core/src/timestamp';
import { createType, OperationWrapper } from '../utils';

/**
 * LastWriteWins type supports LWW updates for primitives. Used within Maps
 */
export const LastWriteWinsType = createType<
  'LWW',
  { operation?: OperationWrapper<any> },
  unknown,
  { value: unknown }
>('LWW', {
  apply: (intermediate, operation) => {
    if (
      !intermediate.operation ||
      isLaterTimestamp(
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
