/**
 * @packageDocumentation
 * @module @upbeat/client/types
 */

/**
 * Upbeat Transport via Intertab communication configuration
 * */
export interface UpbeatTransportInterTabConfig {
  name: 'intertab';
}

/**
 * Upbeat Transport via Websocket configuration
 * */
export interface UpbeatTransportWebSocketConfig {
  name: 'ws';
  uri: string;
}

/**
 * All configs for Upbeat Transports
 * */
export type UpbeatTransportConfig =
  | UpbeatTransportInterTabConfig
  | UpbeatTransportWebSocketConfig;

/**
 * Root configuration object for Upbeat Client.
 * */
export interface UpbeatClientConfig {
  devtool?: boolean;
  transport?: UpbeatTransportConfig[];
}
