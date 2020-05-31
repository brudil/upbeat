/**
 * @packageDocumentation
 * @module @upbeat/core
 */
import { v4 as uuidv4 } from 'uuid';

interface Clock {
  (): number;
}

export interface Timestamp {
  time: number;
  count: number;
  peerId: string;
}

export function serialiseTimestamp(timestamp: Timestamp): string {
  return [
    new Date(timestamp.time).toISOString(),
    ('0000' + timestamp.count.toString(16).toUpperCase()).slice(-4),
    ('0000000000000000' + timestamp.peerId).slice(-16),
  ].join('-');
}

export function parseTimestamp(timestamp: string): Timestamp {
  if (typeof timestamp === 'string') {
    const parts = timestamp.split('-');
    if (parts && parts.length === 5) {
      const time = Date.parse(parts.slice(0, 3).join('-')).valueOf();
      const count = parseInt(parts[3], 16);
      const peerId = parts[4];
      if (!isNaN(time) && !isNaN(count)) return { time, count, peerId };
    }
  }
  throw new Error('invalid serialised timestamp');
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
  if (timeA.count > timeB.count) {
    return true;
  }

  return timeA.peerId > timeB.peerId;
};

export const isLaterSerialisedTimestamp = (
  timeA: string,
  timeB: string,
): boolean => {
  return isLaterTimestamp(parseTimestamp(timeA), parseTimestamp(timeB));
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

export function createPeerId(): string {
  return uuidv4().replace(/-/g, '').slice(-16);
}

export const createHLCClock = (peerId: string, clock: Clock): HLCClock => {
  let timestamp: Timestamp = {
    time: 0,
    count: 0,
    peerId: ('0000000000000000' + peerId).slice(-16),
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
