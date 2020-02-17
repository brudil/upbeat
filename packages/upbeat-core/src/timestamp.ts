interface Clock {
  (): number;
}

export interface Timestamp {
  time: number;
  count: number;
}

export const max = (...numbers: number[]): number => {
  return numbers.reduce(
    (prev, current) => (prev > current ? prev : current),
    0,
  );
};

export const isLaterTimestamp = (
  timeA: Timestamp,
  timeB: Timestamp,
): boolean => {
  // if time is bigger, we're sorted lads
  if (timeA.time > timeB.time) {
    return true;
  }

  // if we're matched on time, let's see if the counts differ.
  return timeA.time === timeB.time && timeA.count > timeB.count;
};

export const isEqualTimestamp = (
  timeA: Timestamp,
  timeB: Timestamp,
): boolean => {
  // if time is bigger, we're sorted lads
  return timeA.time === timeB.time && timeA.count === timeB.count;
};

interface HLCClock {
  now(): Timestamp;
  update(incomingTimestamp: Timestamp): void;
}

export const createHLCClock = (clock: Clock): HLCClock => {
  let timestamp: Timestamp = {
    time: 0,
    count: 0,
  };

  return {
    now() {
      const currentTimestamp = { ...timestamp };
      timestamp = { ...timestamp, time: max(timestamp.time, clock()) };

      if (timestamp.time !== currentTimestamp.time) {
        timestamp = { ...timestamp, count: 0 };
        return Object.freeze(timestamp);
      }

      timestamp = { ...timestamp, count: timestamp.count + 1 };

      return Object.freeze({ ...timestamp });
    },
    update(incomingTimestamp) {
      const prevTimestamp = { ...timestamp };

      timestamp = {
        ...timestamp,
        time: max(prevTimestamp.time, incomingTimestamp.time, clock()),
      };

      if (
        timestamp.time === prevTimestamp.time &&
        incomingTimestamp.time === prevTimestamp.time
      ) {
        timestamp = {
          ...timestamp,
          count: max(prevTimestamp.count, incomingTimestamp.count),
        };
      } else if (prevTimestamp.time === timestamp.time) {
        timestamp = { ...timestamp, count: timestamp.count += 1 };
      } else if (timestamp.time === incomingTimestamp.time) {
        timestamp = {
          ...timestamp,
          count: incomingTimestamp.count + 1,
        };
      } else {
        timestamp = { ...timestamp, count: 0 };
      }
    },
  };
};
