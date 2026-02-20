import type { GraphDelta, RunId, TaskAttempt, TaskId, WorkGraph } from "./types";

export interface TaskGraphPort {
  getGraph(runId: RunId): Promise<WorkGraph | null>;
  applyDelta(runId: RunId, expectedRevision: number, deltaId: string, delta: GraphDelta): Promise<{ applied: boolean; revision: number; reason?: string }>;
  listReadyTasks(runId: RunId): Promise<TaskId[]>;
  claimTask(runId: RunId, taskId: TaskId, sessionId: string, idempotencyKey: string, leaseEpoch: number): Promise<TaskAttempt | null>;
  completeAttempt(attempt: TaskAttempt, artifactRefs: string[]): Promise<void>;
  failAttempt(attempt: TaskAttempt, failureClass: string, reasonCode: string, retryable: boolean): Promise<void>;
}
