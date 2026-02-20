import type { RunId } from "./types";

export interface ObservabilityPort {
  trace(runId: RunId, name: string, attrs?: Record<string, string | number | boolean>): Promise<void>;
  metric(name: string, value: number, labels?: Record<string, string>): Promise<void>;
  log(level: "debug" | "info" | "warn" | "error", message: string, attrs?: Record<string, unknown>): Promise<void>;
}
