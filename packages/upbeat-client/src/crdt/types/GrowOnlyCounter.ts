import { CRDTType, createType } from '../utils';

interface GOCDeltaOp {
  delta: number;
}

export const GrowOnlyCounter: CRDTType<
  'GOC',
  { operations: GOCDeltaOp[] },
  number,
  GOCDeltaOp
> = createType('GOC', {
  apply(atom, op) {
    return [];
  },
});
