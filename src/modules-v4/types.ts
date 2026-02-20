export type ISO8601 = string;
export type RunId = string;
export type WorkflowId = string;
export type TaskId = string;
export type AttemptId = string;
export type SessionId = string;
export type AgentId = string;
export type MessageId = string;
export type EventId = string;
export type PolicySnapshotId = string;

export type AgentProvider = "codex" | "claude" | "local";

export type AgentRole =
  | "orchestrator"
  | "aggregator"
  | "reviewer"
  | "architect"
  | "coder"
  | "frontend_coder"
  | "backend_coder"
  | "qa_tester"
  | "documenter"
  | "researcher";

export type AgentDispatchMode = "persistent" | "oneshot";

export type AgentProfile = {
  agent_id: AgentId;
  role: AgentRole;
  provider: AgentProvider;
  model?: string;
  instruction?: string;
  capabilities: string[];
  preferred_dispatch_mode: AgentDispatchMode;
  max_concurrency?: number;
  metadata?: Record<string, string>;
};

export type SessionState =
  | "registered"
  | "idle"
  | "reserved"
  | "assigned"
  | "running"
  | "draining"
  | "stopped"
  | "crashed";

export type AgentSession = {
  session_id: SessionId;
  run_id: RunId;
  agent_id: AgentId;
  dispatch_mode: AgentDispatchMode;
  backend: "tmux" | "process" | "in_memory";
  state: SessionState;
  started_at: ISO8601;
  last_heartbeat_at: ISO8601;
  lease_epoch: number;
};

export type SwarmRunStatus = "created" | "running" | "paused" | "completed" | "failed" | "canceled";

export type SwarmRun = {
  run_id: RunId;
  workflow_id: WorkflowId;
  workflow_version: number;
  policy_snapshot_id: PolicySnapshotId;
  status: SwarmRunStatus;
  created_at: ISO8601;
  updated_at: ISO8601;
  metadata?: Record<string, string>;
};

export type WorkflowSpec = {
  workflow_id: WorkflowId;
  version: number;
  phases: Array<{
    phase_id: string;
    mode: "sequential" | "parallel";
    task_kinds: string[];
    gates: string[];
    max_epochs?: number;
  }>;
  decomposition_policy: {
    max_workflow_depth: number;
    max_nodes_per_subworkflow: number;
    max_decomposition_per_task: number;
  };
};

export type TaskState = "pending" | "queued" | "leased" | "running" | "completed" | "failed" | "deadletter";

export type WorkNode = {
  task_id: TaskId;
  workflow_path: string;
  epoch: number;
  kind: string;
  state: TaskState;
  priority: number;
  required_capabilities: string[];
  reservations: string[];
  summary: string;
};

export type WorkEdge = {
  from_task_id: TaskId;
  to_task_id: TaskId;
  kind: "hard" | "soft";
};

export type WorkGraph = {
  run_id: RunId;
  revision: number;
  nodes: WorkNode[];
  edges: WorkEdge[];
};

export type GraphDelta = {
  add_nodes: WorkNode[];
  add_edges: WorkEdge[];
  update_nodes: Array<{ task_id: TaskId; patch: Partial<Pick<WorkNode, "summary" | "priority">> }>;
  close_nodes: Array<{ task_id: TaskId; reason_code: string }>;
};

export type TaskAttempt = {
  attempt_id: AttemptId;
  run_id: RunId;
  task_id: TaskId;
  session_id: SessionId;
  agent_id: AgentId;
  attempt_no: number;
  lease_until: ISO8601;
  lease_epoch: number;
  idempotency_key: string;
  started_at: ISO8601;
};

export type FailureClass =
  | "auth_error"
  | "network_error"
  | "execution_error"
  | "validation_error"
  | "policy_violation"
  | "lease_conflict"
  | "state_conflict"
  | "timeout"
  | "canceled";

export type EnvelopeType =
  | "task_assignment"
  | "review_result"
  | "aggregation_result"
  | "control"
  | "error"
  | "agent_message"
  | "shutdown_request"
  | "shutdown_approved";

export type Envelope<TPayload = Record<string, unknown>> = {
  schema_version: 1;
  msg_id: MessageId;
  run_id: RunId;
  task_id?: TaskId;
  from: AgentId;
  to: AgentId;
  type: EnvelopeType;
  issued_at: ISO8601;
  payload: TPayload;
};

export type DecisionAction = "admit" | "defer" | "reject" | "retry" | "cancel" | "escalate";

export type PolicyDecision = {
  action: DecisionAction;
  reason_code: string;
  detail?: string;
  snapshot_id: PolicySnapshotId;
};

export type ExecutionPolicySnapshot = {
  snapshot_id: PolicySnapshotId;
  contract_version: number;
  created_at: ISO8601;
  policy_hash: string;
  starvation_slo_sec: number;
  max_tasks_per_session: number;
  max_session_ttl_sec: number;
};

export type TriggerType =
  | "task_ready"
  | "message_arrived"
  | "attempt_timeout"
  | "session_heartbeat_timeout"
  | "manual_control_command"
  | "process_exited";

export type TriggerSignal = {
  trigger_type: TriggerType;
  run_id: RunId;
  task_id?: TaskId;
  session_id?: SessionId;
  issued_at: ISO8601;
  payload?: Record<string, unknown>;
};

export type DomainEventName =
  | "run_created"
  | "agent_profile_registered"
  | "session_started"
  | "session_heartbeat"
  | "task_ready"
  | "task_claimed"
  | "attempt_started"
  | "attempt_completed"
  | "attempt_failed"
  | "shutdown_requested"
  | "shutdown_approved";

export type DomainEvent = {
  event_name: DomainEventName;
  run_id: RunId;
  task_id?: TaskId;
  agent_id?: AgentId;
  occurred_at: ISO8601;
  payload: Record<string, unknown>;
};

export type EventRecord = DomainEvent & {
  event_id: EventId;
  offset: number;
};
