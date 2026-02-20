# Workflow/Task 抽象化 再設計案 v4

最終更新: 2026-02-20
対象: `agent-symphony`

## 0. 設計ゴール

1. `codex/claude` など CLI agent の実行特性に合わせ、`persistent agent session` をデフォルトにする。
2. `mailbox` と `agent lifecycle` を完全分離する。
3. 応答は `event-driven trigger` を基本にし、polling はフォールバックに限定する。
4. モジュール間依存を最小化し、拡張時に kernel が肥大化しない構造にする。

## 1. 設計原則

1. **Kernel is decider**: AIは提案者、Kernelが遷移を確定。
2. **Port/Adapter first**: provider差分、transport差分は adapter に閉じる。
3. **Event-sourced state**: すべての重要状態は event-ledger を唯一ソースにする。
4. **Session over Prompt**: 文脈は毎回要約よりセッション継続を優先。
5. **Trigger-first execution**: `task_ready` 等のイベントで起動し、常時pollしない。

## 2. レイヤー構造

### 2.1 Domain Kernel Layer

1. `run-registry`
2. `workflow-compiler`
3. `task-graph`
4. `policy-engine`
5. `scheduler`

### 2.2 Orchestration Layer

1. `execution-dispatcher`
2. `agent-session-manager`
3. `trigger-router`

### 2.3 Infrastructure Layer

1. `event-ledger`
2. `mailbox-transport`
3. `agent-adapter-registry`
4. `artifact-memory`
5. `observability`

### 2.4 Entry Layer

1. `control-api`

## 3. モジュール責務

1. `run-registry`: run/session/agent profile の登録・参照。
2. `workflow-compiler`: `WorkflowSpec -> WorkGraph seed` を生成。
3. `task-graph`: 依存解決、claim、attempt反映、GraphDelta適用。
4. `policy-engine`: authorize、dispatch mode決定、guardrail判定。
5. `scheduler`: ready集合から候補を選抜。
6. `execution-dispatcher`: `task_ready` 受信後の実行割当・起動。
7. `agent-session-manager`: session lifecycle と heartbeat 管理。
8. `trigger-router`: watcher/tmux/system timer の信号を正規化。
9. `event-ledger`: append-only event + projection + subscription。
10. `mailbox-transport`: message publish/consume/ack/nack のみ。
11. `agent-adapter-registry`: codex/claude/local adapter ルーティング。
12. `artifact-memory`: artifact + outcome pattern 保存。
13. `observability`: trace/metric/log 契約。
14. `control-api`: 外部 command 入口。

## 4. 明示的な依存ルール（疎結合）

1. `task-graph` は `mailbox-transport` を知らない。
2. `agent-session-manager` は `mailbox-transport` を知らない。
3. `scheduler` は `agent-adapter` を知らない。
4. `execution-dispatcher` が `scheduler + policy + session + adapter` を束ねる。
5. 永続化I/Oは `event-ledger` と `artifact-memory` に限定。
6. `control-api` は domain ports を呼ぶだけで、実装詳細を持たない。

## 5. mailbox と lifecycle の分離

### 5.1 mailbox の責務

1. envelope輸送
2. ack/nack/deadletter
3. at-least-once 配送

### 5.2 lifecycle の責務

1. agent session 作成/再利用/停止
2. heartbeat と timeout 監視
3. stale session の隔離
4. graceful shutdown handshake

## 6. Agent Lifecycle モデル

状態:

1. `registered`
2. `idle`
3. `reserved`
4. `assigned`
5. `running`
6. `draining`
7. `stopped`
8. `crashed`

デフォルト戦略:

1. roleが継続作業型なら `persistent`。
2. 単発/隔離が必要なケースだけ `oneshot`。
3. `max_tasks_per_session` または `max_session_ttl` 到達で rotate。

## 7. 応答モデル（trigger-first）

### 7.1 主要トリガ

1. `task_ready`
2. `attempt_timeout`
3. `message_arrived`
4. `session_heartbeat_timeout`
5. `manual_control_command`

### 7.2 trigger router の入力源

1. fs watcher（ledger/outbox/mailbox更新）
2. tmux event hook
3. process exit event
4. timer（fallback polling）

### 7.3 fallback polling

1. watcher異常時のみ有効化
2. adaptive backoff
3. trigger復旧後に自動停止

## 8. command/event 最小契約

### 8.1 Command

1. `CreateRun`
2. `RegisterAgentProfile`
3. `StartSession`
4. `CompileWorkflow`
5. `ApplyGraphDelta`
6. `ClaimTask`
7. `ExecuteAttempt`
8. `CompleteAttempt`
9. `FailAttempt`
10. `RequestShutdown`
11. `ApproveShutdown`

### 8.2 Event

1. `run_created`
2. `agent_profile_registered`
3. `session_started`
4. `session_heartbeat`
5. `task_ready`
6. `task_claimed`
7. `attempt_started`
8. `attempt_completed`
9. `attempt_failed`
10. `shutdown_requested`
11. `shutdown_approved`

## 9. Kernel不変条件

1. 状態遷移は必ず ledger event を伴う。
2. `WorkflowSpec` は epoch単位で immutable。
3. lease + fencing token なしの completion は拒否。
4. taskへの同時有効leaseは1つ。
5. dispatch mode は policy-engine が最終決定。

## 10. 拡張点

1. provider追加: `agent-adapter-registry` に adapterを追加するだけ。
2. transport追加: `mailbox-transport` adapter差し替えのみ。
3. scheduler戦略追加: `SchedulerPort` 実装差し替えのみ。
4. memory追加: `artifact-memory` backend差し替えのみ。

## 11. 実装フェーズ（推奨）

1. `event-ledger` + `run-registry` の最小実装。
2. `agent-session-manager` + `agent-adapter-registry` で persistent session 稼働。
3. `task-graph` + `scheduler` + `execution-dispatcher` 接続。
4. `trigger-router` を watcher中心で導入し polling fallback を追加。
5. `mailbox-transport` を非同期協調チャネルとして接続。

## 12. この設計の意味

1. mailboxとlifecycleの責務衝突を解消する。
2. 文脈維持をセッション寿命で担保し、都度要約コストを下げる。
3. event-driven中心で、無駄な常時pollingコストを抑える。
4. module単位で独立進化できるため、長期拡張に耐える。
