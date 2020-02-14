import { schema } from './schema.generated';
import { createClient } from '../../upbeat-client/src/client';
// import {useUpbeatState} from "../../../upbeat-client/src/react";

export function startClient() {
  return createClient(schema).then((c) => {
    return c;
  });
}
