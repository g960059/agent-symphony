import type { AgentProfile, AgentSession, RunId, SessionId, TaskAttempt } from "./types";

export type ExecuteResult =
  | { status: "completed"; artifact_refs: string[]; summary?: string }
  | { status: "failed"; failure_class: string; reason_code: string; detail?: string; retryable: boolean };

export interface AgentAdapter {
  provider: string;
  supportsPersistentSession: boolean;
  startSession(runId: RunId, profile: AgentProfile): Promise<AgentSession>;
  stopSession(runId: RunId, sessionId: SessionId, reason: string): Promise<void>;
  sendTaskToSession(runId: RunId, sessionId: SessionId, attempt: TaskAttempt): Promise<void>;
  runOneShot(runId: RunId, profile: AgentProfile, attempt: TaskAttempt): Promise<ExecuteResult>;
}

export interface AgentAdapterRegistryPort {
  resolve(provider: string): Promise<AgentAdapter>;
}
