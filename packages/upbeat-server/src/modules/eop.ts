import { MessageHandler } from '../types';
import { createModule } from '../core/modules';
import {
  ClientType,
  OperationReceived,
  OperationSent,
  ServerType,
} from '../messages';

const OperationSync: MessageHandler<OperationSent, OperationReceived> = async (
  { operation, roomId },
  send,
) => {
  send(
    {
      type: ServerType.OperationReceived,
      operation,
    },
    { channel: ['live', roomId] },
  );
};

export const EphemeralOperationsModule = createModule<OperationSent>({
  key: 'live',
  handlers: {
    [ClientType.OperationSent]: OperationSync,
  },
});

/*
  # CHANNELS
  1. Connected client asks to SUBSCRIBE to CHANNEL
  2. CHANNEL MANAGER for given CHANNEL TYPE validates this request for given CHANNEL KEY
  3. Client is connected to CHANNEL until UNSUBSCRIBE or DISCONNECTION

  # INGRESS
  1. INPUT METHOD via webhook or message
  2. VALIDATE via io-ts?
  3. HANDLE via message type handler.
  4. PUBLISH to Redis for...

  # EGRESS/FAN OUT
  1. Is secure. No Validation is performed at this end.
  2. Receive Redis Publish
  4. Filter audience to SELECTOR
  3. Deliver

  # MODULE
  - Defines a CHANNEL TYPE with a CHANNEL MANAGER
  - Authorises subscriptions to a CHANNEL
  - Provides MESSAGE TYPES for INGRESS AND EGRESS
  - Handles INGRESS MESSAGE TYPES, returning SELECTOR AND EGRESS MESSAGE


  TYPES
  - Ingress Types
  - Channels (Channel Type (controlled by a channel manager) and a Channel Key)
  - Message
  - Module
  - Handler

  Q: Do Modules === Channel Type/Manager?
  Q: Handling WebHooks API
  Q: Auth
 */
