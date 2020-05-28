export interface UpbeatTransportInterTabConfig {
  name: 'intertab';
}

export interface UpbeatTransportWebSocketConfig {
  name: 'ws';
  uri: string;
}

export type UpbeatTransportConfig =
  | UpbeatTransportInterTabConfig
  | UpbeatTransportWebSocketConfig;

export interface UpbeatClientConfig {
  transport?: UpbeatTransportConfig[];
}
