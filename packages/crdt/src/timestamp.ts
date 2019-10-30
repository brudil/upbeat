interface Clock {
  (): number;
}

interface Timestamp {
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

    return this.timestamp;
  }

  public update(incoming: Timestamp) {
    const currentTimestamp = { ...this.timestamp };

    this.timestamp.time = this.max(
      currentTimestamp.time,
      incoming.time,
      this.clock(),
    );

    if (
      this.timestamp.time === currentTimestamp.time &&
      incoming.time === currentTimestamp.time
    ) {
      this.timestamp.count = this.max(currentTimestamp.count, incoming.count);
    } else if (currentTimestamp.time === this.timestamp.time) {
      this.timestamp.count += 1;
    } else if (this.timestamp.time === incoming.time) {
      this.timestamp.count = incoming.count + 1;
    } else {
      this.timestamp.count = 0;
    }
  }

  private max(...numbers: number[]) {
    return numbers.reduce(
      (prev, current) => (prev > current ? prev : current),
      0,
    );
  }
}
