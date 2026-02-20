import type { RunId, WorkGraph, WorkflowSpec } from "./types";

export type CompileResult = {
  graph: WorkGraph;
  compile_hash: string;
  warnings: string[];
};

export interface WorkflowCompilerPort {
  validate(spec: WorkflowSpec): Promise<{ ok: boolean; errors: string[] }>;
  compile(runId: RunId, spec: WorkflowSpec): Promise<CompileResult>;
}
