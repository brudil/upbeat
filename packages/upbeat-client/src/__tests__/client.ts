import { createClient } from '../client';
import { createQuery } from '../query';

describe('UpbeatClient', () => {
  it('should create UpbeatClient', async () => {
    (global as any).BroadcastChannel = class {};
    const client = await createClient({ resources: {}, spaces: {} });

    expect(client).not.toBeUndefined();
  });

  it('should create a live query', async () => {
    (global as any).BroadcastChannel = class {};
    const client = await createClient({ resources: {}, spaces: {} });

    const lq = client.createLiveQuery(
      createQuery('example', ({ where }) => where('x', 'y')),
      jest.fn(),
    );
    expect(lq).not.toBeUndefined();
  });
});
