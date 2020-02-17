import { Schema } from '@upbeat/schema-parser/src/types';
import uuid from 'uuid/v4';
import { createUpbeatWorker } from './worker';
import { Changeset } from './changeset';
import './query';
import { Query } from './query';

export interface UpbeatClient {
  createLiveQuery(query: Query, hook: (cb) => void): () => void;
  sendOperation(c: Changeset<unknown>): void;
}

export async function createClient(schema: Schema): Promise<UpbeatClient> {
  const worker = await createUpbeatWorker(schema);

  const liveQueries: { [id: string]: { hook: any } } = {};
  worker.emitter.on('liveChange', ([id, data]) => {
    if (liveQueries.hasOwnProperty(id)) {
      liveQueries[id].hook(data);
    }
  });
  /*
   * What does upbeat client do?
   * We have two sides.
   * API and Worker.
   * App <-> Client <-> Worker <-> External data sources
   * The Worker can be run-inline or within a web worker for performance reasons.
   *
   * # The Client
   * The App issues two types of commands.
   * - Operations, which change data
   * - And queries, that read data.
   *
   * The client provides these two categories APIs
   *
   *
   *  # The Worker
   * The worker is in charge of persistence and ingress/egress to external sources.
   * Due to the ability to run within a webworker, the Client/Worker interop must be JSON serialisable.
   * TODO: Using the Schema types, we can re-hydrate objects that would be string serialised - such as dates
   *
   * The Worker manages a Database that is queryable.
   * The Database is created from operations on resources.
   * An entire log of these operations is also persisted.
   * These operations are then synced to different clients.
   * */

  return {
    createLiveQuery(query, hook) {
      const id = uuid();

      worker.createLiveQuery(query, id);

      liveQueries[id] = {
        hook,
      };

      return () => {
        delete liveQueries[id];
      };
    },
    sendOperation(changeset) {
      console.log(
        `%cUpbeatOp%c ${changeset.resource}#${
          changeset.action === 'UPDATE' ? changeset.id : 'NEW'
        } ${JSON.stringify(changeset.properties)}`,
        'border-radius: 4px;padding: 1px 2px;font-weight: bold; color: white;background: black;',
        'font-weight: normal;',
      );
      worker.addOperation(changeset);
    },
  };
}
