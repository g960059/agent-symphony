# agent-symphony

Local-first multi-agent orchestration kernel focused on long-lived agent sessions.

## Design Stance

- Persistent agent session is default
- Event-driven trigger is default
- Polling is fallback only
- Mailbox transport and agent lifecycle are separated

## Architecture (v4)

See `docs/workflow-task-abstraction.ja.md`.

### Modules

- `src/modules-v4/types.ts`
- `src/modules-v4/run-registry.ts`
- `src/modules-v4/workflow-compiler.ts`
- `src/modules-v4/task-graph.ts`
- `src/modules-v4/policy-engine.ts`
- `src/modules-v4/scheduler.ts`
- `src/modules-v4/event-ledger.ts`
- `src/modules-v4/mailbox-transport.ts`
- `src/modules-v4/agent-adapter.ts`
- `src/modules-v4/agent-session-manager.ts`
- `src/modules-v4/trigger-router.ts`
- `src/modules-v4/execution-dispatcher.ts`
- `src/modules-v4/artifact-memory.ts`
- `src/modules-v4/observability.ts`
- `src/modules-v4/control-api.ts`

## Build

```bash
npm run build
```
