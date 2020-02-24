import { LastWriteWinsType } from '../types/lastWriteWins';
import { Timestamp } from '../../../../upbeat-core/src/timestamp';

let type = LastWriteWinsType.create();
const handleType = () => null;

const createOp = (value: any, timestamp: Timestamp) => ({
  fullOperation: {
    id: '43',
    resource: 'X',
    resourceId: 'X',
    timestamp,
  },
  atomOperation: { value },
});

describe('LastWriteWinsType', () => {
  beforeEach(() => {
    type = LastWriteWinsType.create();
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

    const [_, nextLww] = LastWriteWinsType.apply(
      type,
      createOp(33, {
        time: Date.now(),
        count: 0,
      }),
    );

    expect(LastWriteWinsType.realise(nextLww, handleType)).toBe(33);
  });
});
