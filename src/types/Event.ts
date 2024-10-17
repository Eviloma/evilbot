export interface Event {
  readonly name: string;
  readonly once?: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: Unified interface for all event types
  readonly execute: (...args: any[]) => Promise<void>;
}
