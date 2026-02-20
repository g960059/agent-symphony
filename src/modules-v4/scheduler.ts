import type { ExecutionPolicySnapshot, RunId, TaskId } from "./types";

export type SchedulerCandidate = {
  task_id: TaskId;
  tree_id: string;
  score: number;
};

export interface SchedulerPort {
  rank(runId: RunId, readyTaskIds: TaskId[], policy: ExecutionPolicySnapshot): Promise<SchedulerCandidate[]>;
  pick(runId: RunId, readyTaskIds: TaskId[], policy: ExecutionPolicySnapshot): Promise<{ selected_task_id: TaskId | null; reason: string }>;
}
