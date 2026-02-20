import type { AgentProfile, Envelope, GraphDelta, RunId, SwarmRun, WorkflowSpec } from "./types";

export interface ControlApiPort {
  createRun(workflow: WorkflowSpec, agents: AgentProfile[], metadata?: Record<string, string>): Promise<SwarmRun>;
  applyGraphDelta(runId: RunId, proposerAgentId: string, expectedRevision: number, deltaId: string, delta: GraphDelta): Promise<{ accepted: boolean; reason?: string }>;
  sendEnvelope(envelope: Envelope): Promise<void>;
  requestShutdown(runId: RunId, requesterAgentId: string, targetAgentId: string, reason: string): Promise<void>;
  approveShutdown(runId: RunId, approverAgentId: string, requestId: string): Promise<void>;
}
