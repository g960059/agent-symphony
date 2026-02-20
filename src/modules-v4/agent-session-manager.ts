import type { AgentId, AgentSession, RunId, SessionId } from "./types";

export interface AgentSessionManagerPort {
  ensurePersistentSession(runId: RunId, agentId: AgentId): Promise<AgentSession>;
  reserveSession(runId: RunId, sessionId: SessionId): Promise<boolean>;
  markAssigned(runId: RunId, sessionId: SessionId): Promise<void>;
  markRunning(runId: RunId, sessionId: SessionId): Promise<void>;
  markIdle(runId: RunId, sessionId: SessionId): Promise<void>;
  heartbeat(runId: RunId, sessionId: SessionId, at: string): Promise<void>;
  listExpiredSessions(runId: RunId, now: string): Promise<AgentSession[]>;
  requestDrain(runId: RunId, sessionId: SessionId, reason: string): Promise<void>;
  stopSession(runId: RunId, sessionId: SessionId, reason: string): Promise<void>;
}
