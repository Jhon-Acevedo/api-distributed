export interface IConnection {
    client: unknown;
    connect(): Promise<unknown>;
    disconnect(): Promise<string | void>;
    isConnected(): boolean;
  }