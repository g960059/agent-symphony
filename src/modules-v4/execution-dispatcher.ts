import type { RunId, TriggerSignal } from "./types";

export interface ExecutionDispatcherPort {
  start(runId: RunId): Promise<void>;
  stop(runId: RunId): Promise<void>;
  dispatchOnTrigger(runId: RunId, signal: TriggerSignal): Promise<void>;
}
