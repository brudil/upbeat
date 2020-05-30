/**
 * @packageDocumentation
 * @module @upbeat/client/client
 */

import { Schema } from '@upbeat/schema/src';
import { v4 as uuid } from 'uuid';
import { createUpbeatWorker } from './worker';
import { Changeset } from './changeset';
import './query';
import { log, UpbeatModule } from './debug';
import { UpbeatClientConfig } from './types';
import { SerialisedQuery } from './query';
import { createUpbeatDevtool, UpbeatDevtool } from './devtools';

export interface UpbeatClient {
  createLiveQuery(query: SerialisedQuery, hook: (cb: any) => void): () => void;
  applyChangeset(c: Changeset<unknown>): void;
  devtool: UpbeatDevtool | null;
}

/**
 * Creates an UpbeatClient, used by the users app.
 */
export async function createClient(
  schema: Schema,
  config: UpbeatClientConfig,
): Promise<UpbeatClient> {
  const worker = await createUpbeatWorker(schema, config);

  const devtool =
    config.devtool ?? false ? createUpbeatDevtool(schema, config) : null;

  const liveQueries: { [id: string]: { hook: any } } = {};
  worker.emitter.on('liveChange', (id, data) => {
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
    devtool,
    createLiveQuery(query, hook) {
      const id = uuid();

      worker.createLiveQuery(query, id);
      log(
        UpbeatModule.LiveQuery,
        'REGISTERED',
        `${id} ${JSON.stringify(query)}`,
      );

      liveQueries[id] = {
        hook,
      };

      return () => {
        log(UpbeatModule.LiveQuery, 'UNREGISTERED', `${id}`);
        delete liveQueries[id];
      };
    },
    applyChangeset(changeset) {
      log(
        UpbeatModule.Worker,
        `${changeset.resource}#${
          changeset.action === 'UPDATE' ? changeset.id : 'NEW'
        } ${JSON.stringify(changeset.properties)}`,
      );
      worker.addOperation(changeset);
    },
  };
}
