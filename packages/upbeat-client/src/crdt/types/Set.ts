//LWW-Element-Set

import { createType } from '../utils';

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
  addOps: SetAddOperation<any>[];
  removeOps: SetRemoveOperation<any>[];
}

export const SetType = createType<
  'SET',
  SetInternalAtom,
  any[],
  SetOperations<any>
>('SET', {
  apply(intermediate, operation) {
    console.log('SET APPLY', intermediate, operation);

    if (operation.atomOperation.type === 'REMOVE') {
      return [
        true,
        {
          ...intermediate,
          removeOps: [...intermediate.removeOps, operation.atomOperation],
        },
      ];
    }

    return [
      true,
      {
        ...intermediate,
        addOps: [...intermediate.addOps, operation.atomOperation],
      },
    ];
  },
  realise(internal) {
    console.log('SET REALISE', internal);
    return internal.addOps
      .filter(
        (addOp) =>
          !internal.removeOps.map((rOp) => rOp.value).includes(addOp.value),
      )
      .map((op) => op.value);
  },
  create() {
    return {
      addOps: [],
      removeOps: [],
    };
  },
});
