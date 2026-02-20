import type { AgentProfile, ExecutionPolicySnapshot, GraphDelta, PolicyDecision, RunId, TaskAttempt, WorkGraph } from "./types";

export interface PolicyEnginePort {
  resolveSnapshot(runId: RunId, workflowVersion: number, overrides?: Partial<ExecutionPolicySnapshot>): Promise<ExecutionPolicySnapshot>;
  authorize(runId: RunId, profile: AgentProfile, commandName: string): Promise<PolicyDecision>;
  validateDelta(runId: RunId, profile: AgentProfile, graph: WorkGraph, delta: GraphDelta): Promise<PolicyDecision>;
  decideDispatchMode(runId: RunId, profile: AgentProfile, attempt?: TaskAttempt): Promise<{ mode: "persistent" | "oneshot"; reason: string }>;
}
