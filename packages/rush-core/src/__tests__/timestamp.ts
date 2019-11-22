import {
  createHLCClock,
  isEqualTimestamp,
  isLaterTimestamp,
  max,
} from '../timestamp';
import { sleep } from '@rush/testing/src/sleep';

it('should create a clock', function() {
  const clock = createHLCClock(Date.now);

  expect(clock).toBeDefined();
});

it('should create a timestamp', async function() {
  const clock = createHLCClock(Date.now);

  const timeA = clock.now();
  const timeB = clock.now();

  expect(timeA).toBeDefined();

  expect(isLaterTimestamp(timeA, timeB)).toBeFalsy();
  expect(isLaterTimestamp(timeB, timeA)).toBeTruthy();

  expect(isEqualTimestamp(timeB, timeB)).toBeTruthy();
  expect(isEqualTimestamp(timeB, timeA)).toBeFalsy();

  await sleep(30);

  const timeC = clock.now();

  expect(isLaterTimestamp(timeC, timeB)).toBeTruthy();
});

it('should update with remote timestamp', function() {
  const clockA = createHLCClock(Date.now);
  const clockB = createHLCClock(Date.now);

  const timeB1 = clockB.now();
  clockA.update(timeB1);

  const timeA1 = clockA.now();

  expect(isEqualTimestamp(timeB1, timeA1)).toBeFalsy();
});

describe('max', () => {
  it('should create pick the highest number', function() {
    expect(max(-900, 121, 8)).toBe(121);
  });
});
