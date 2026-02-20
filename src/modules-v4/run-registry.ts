import type { AgentProfile, AgentSession, RunId, SessionId, SwarmRun, SwarmRunStatus, WorkflowSpec } from "./types";

export interface RunRegistryPort {
  createRun(workflow: WorkflowSpec, policySnapshotId: string, metadata?: Record<string, string>): Promise<SwarmRun>;
  getRun(runId: RunId): Promise<SwarmRun | null>;
  updateRunStatus(runId: RunId, status: SwarmRunStatus): Promise<void>;
  registerAgentProfile(runId: RunId, profile: AgentProfile): Promise<void>;
  listAgentProfiles(runId: RunId): Promise<AgentProfile[]>;
  saveSession(session: AgentSession): Promise<void>;
  getSession(runId: RunId, sessionId: SessionId): Promise<AgentSession | null>;
  listSessions(runId: RunId): Promise<AgentSession[]>;
}
