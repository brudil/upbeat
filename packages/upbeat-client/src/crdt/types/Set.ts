//LWW-Element-Set

import { createType, OperationWrapper } from '../utils';

export interface SetAddOperation<V> {
  type: 'ADD';
  value: V;
}

export interface SetRemoveOperation<V> {
  type: 'REMOVE';
  value: V;
}

export type SetOperations<T> = SetAddOperation<T> | SetRemoveOperation<T>;

export interface SetInternalAtom {
  addOps: OperationWrapper<SetAddOperation<unknown>>[];
  removeOps: OperationWrapper<SetRemoveOperation<unknown>>[];
}

export const SetType = createType<
  'SET',
  SetInternalAtom,
  unknown[],
  SetOperations<any>
>('SET', {
  apply(intermediate, operation) {
    if (operation.atomOperation.type === 'REMOVE') {
      return [
        true,
        {
          ...intermediate,
          removeOps: [
            ...intermediate.removeOps,
            operation as OperationWrapper<SetRemoveOperation<unknown>>,
          ],
        },
      ];
    }

    if (operation.atomOperation.type === 'ADD') {
      return [
        true,
        {
          ...intermediate,
          addOps: [
            ...intermediate.addOps,
            operation as OperationWrapper<SetAddOperation<unknown>>,
          ],
        },
      ];
    }

    return [false, intermediate];
  },
  realise(internal) {
    return internal.addOps
      .filter(
        (addOp) =>
          !internal.removeOps
            .map((rOp) => rOp.atomOperation.value)
            .includes(addOp.atomOperation.value),
      )
      .map((op) => op.atomOperation.value);
  },
  create() {
    return {
      addOps: [],
      removeOps: [],
    };
  },
});
