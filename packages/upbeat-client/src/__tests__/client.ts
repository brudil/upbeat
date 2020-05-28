import { createClient } from '../client';
import { Query } from '../query';

describe('UpbeatClient', () => {
  it('should create UpbeatClient', async () => {
    (global as any).BroadcastChannel = class {};
    const client = await createClient({ resources: {}, spaces: {} }, {});

    expect(client).not.toBeUndefined();
  });

  it('should create a live query', async () => {
    (global as any).BroadcastChannel = class {};
    const client = await createClient({ resources: {}, spaces: {} }, {});

    const lq = client.createLiveQuery(
      Query.resource<{ x: string; _type: 'example' }>('example')
        .where('x', 'y', Query.Comparator.Equals)
        .build(),
      jest.fn(),
    );
    expect(lq).not.toBeUndefined();
  });
});
