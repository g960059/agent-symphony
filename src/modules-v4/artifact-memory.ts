import type { RunId, TaskId } from "./types";

export type ArtifactRecord = {
  artifact_id: string;
  run_id: RunId;
  task_id?: TaskId;
  kind: string;
  uri: string;
  checksum?: string;
  created_at: string;
};

export interface ArtifactMemoryPort {
  put(record: ArtifactRecord): Promise<string>;
  get(artifactId: string): Promise<ArtifactRecord | null>;
  listByTask(runId: RunId, taskId: TaskId): Promise<ArtifactRecord[]>;
  recordOutcomePattern(input: { run_id: RunId; tags: string[]; summary: string; success_rate: number }): Promise<void>;
}
