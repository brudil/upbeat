interface Clock {
  (): number;
}

export interface Timestamp {
  time: number;
  count: number;
}

export class HLC {
  public static global = new HLC(Date.now);
  clock: Clock;
  timestamp: Timestamp;

  constructor(clock: Clock) {
    this.clock = clock;
    this.timestamp = {
      time: 0,
      count: 0,
    };
  }

  public now() {
    const currentTimestamp = { ...this.timestamp };
    this.timestamp.time = this.max(this.timestamp.time, this.clock());

    if (this.timestamp.time !== currentTimestamp.time) {
      this.timestamp.count = 0;
      return this.timestamp;
    }

    this.timestamp.count += 1;

    return Object.freeze({ ...this.timestamp });
  }

  public update(incomingTimestamp: Timestamp) {
    const prevTimestamp = { ...this.timestamp };

    this.timestamp.time = this.max(
      prevTimestamp.time,
      incomingTimestamp.time,
      this.clock(),
    );

    if (
      this.timestamp.time === prevTimestamp.time &&
      incomingTimestamp.time === prevTimestamp.time
    ) {
      this.timestamp = {
        ...this.timestamp,
        count: this.max(prevTimestamp.count, incomingTimestamp.count),
      };
    } else if (prevTimestamp.time === this.timestamp.time) {
      this.timestamp = { ...this.timestamp, count: this.timestamp.count += 1 };
    } else if (this.timestamp.time === incomingTimestamp.time) {
      this.timestamp = {
        ...this.timestamp,
        count: incomingTimestamp.count + 1,
      };
    } else {
      this.timestamp = { ...this.timestamp, count: 0 };
    }
  }

  private max(...numbers: number[]) {
    return numbers.reduce(
      (prev, current) => (prev > current ? prev : current),
      0,
    );
  }
}
