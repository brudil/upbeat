import { LastWriteWinsType, LWWSetOp } from '../types/lastWriteWins';
import { Timestamp } from '../../../../upbeat-core/src/timestamp';
import { OperationWrapper } from '../utils';

let type = LastWriteWinsType.create({});
const handleType = (): null => null;

const createOp = (
  value: number,
  timestamp: Timestamp,
): OperationWrapper<LWWSetOp> => ({
  fullOperation: {
    id: '43',
    resource: 'X',
    resourceId: 'X',
    timestamp,
    operation: [{ value }],
  },
  atomOperation: { value },
});

describe('LastWriteWinsType', () => {
  beforeEach(() => {
    type = LastWriteWinsType.create({});
  });

  it('should ensure the last write wins', () => {
    const op1 = createOp(10, {
      time: Date.now(),
      count: 10,
    });

    const op2 = createOp(10, {
      time: Date.now(),
      count: 15,
    });

    const [change, secondType] = LastWriteWinsType.apply(type, op2);

    expect(change).toBeTruthy();

    const [change2] = LastWriteWinsType.apply(secondType, op1);

    expect(change2).toBeFalsy();
  });

  it('should realise a primitive', () => {
    expect(LastWriteWinsType.realise(type, handleType)).toBeNull();

    const [, nextLww] = LastWriteWinsType.apply(
      type,
      createOp(33, {
        time: Date.now(),
        count: 0,
      }),
    );

    expect(LastWriteWinsType.realise(nextLww, handleType)).toBe(33);
  });
});
