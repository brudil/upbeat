/**
 * @packageDocumentation
 * @module @upbeat/example-todo
 */

import { schema } from './schema.generated';
import { createClient, UpbeatClient } from '@upbeat/client/src/client';

// import {useUpbeatState} from "../../../upbeat-client/src/react";

export function startClient(): Promise<UpbeatClient> {
  return createClient(schema, {
    transport: [{ name: 'ws', uri: 'loop' }],
  });
}
