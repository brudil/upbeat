interface Clock {
  (): number;
}

export interface Timestamp {
  time: number;
  count: number;
}

const max = (...numbers: number[]) => {
  return numbers.reduce(
    (prev, current) => (prev > current ? prev : current),
    0,
  );
};

export const createHLCClock = (clock: Clock) => {
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
    update(incomingTimestamp: Timestamp) {
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
