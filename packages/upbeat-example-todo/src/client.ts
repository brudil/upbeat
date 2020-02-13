import { createClient } from '../../upbeat-client/src/upbeat2';
import { schema } from './schema.generated';
// import {useUpbeatState} from "../../../upbeat-client/src/react";

export let client: any;

export function startClient() {
  return createClient(schema).then((c) => {
    client = c;
    return 1;
  });
}
