import { LastWriteWinsType, LWWSetOp } from '../types/lastWriteWins';
import {
  createPeerId,
  serialiseTimestamp,
  Timestamp,
} from '../../../../upbeat-core/src/timestamp';
import { OperationWrapper } from '../utils';

let type = LastWriteWinsType.create({});
const handleType = (): null => null;

const next = () => null;

const createOp = (
  value: number,
  timestamp: Timestamp,
): OperationWrapper<LWWSetOp> => ({
  fullOperation: {
    resource: 'X',
    resourceId: 'X',
    timestamp: serialiseTimestamp(timestamp),
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
      peerId: createPeerId(),
    });

    const op2 = createOp(10, {
      time: Date.now(),
      count: 15,
      peerId: createPeerId(),
    });

    const [change, secondType] = LastWriteWinsType.apply(type, op2, next);

    expect(change).toBeTruthy();

    const [change2] = LastWriteWinsType.apply(secondType, op1, next);

    expect(change2).toBeFalsy();
  });

  it('should realise a primitive', () => {
    expect(LastWriteWinsType.realise(type, handleType)).toBeNull();

    const [, nextLww] = LastWriteWinsType.apply(
      type,
      createOp(33, {
        time: Date.now(),
        count: 0,
        peerId: createPeerId(),
      }),
      next,
    );
    expect(LastWriteWinsType.realise(nextLww, handleType)).toBe(33);
  });
});
