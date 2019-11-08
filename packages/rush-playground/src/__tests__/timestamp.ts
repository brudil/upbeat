import { createHLCClock } from '../timestamp';

it('should create timestamp', function() {
  const clock = createHLCClock(Date.now);

  expect(clock).toBeDefined();
});
