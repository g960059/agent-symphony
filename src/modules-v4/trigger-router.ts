import type { RunId, TriggerSignal } from "./types";

export interface TriggerRouterPort {
  start(runId: RunId): Promise<void>;
  stop(runId: RunId): Promise<void>;
  emit(signal: TriggerSignal): Promise<void>;
  onSignal(runId: RunId, handler: (signal: TriggerSignal) => Promise<void>): Promise<() => Promise<void>>;
}
