import type { DomainEvent, EventRecord, RunId, TriggerSignal } from "./types";

export type LedgerTx = { tx_id: string };

export interface EventLedgerPort {
  begin(): Promise<LedgerTx>;
  append(tx: LedgerTx, events: DomainEvent[]): Promise<void>;
  commit(tx: LedgerTx): Promise<void>;
  rollback(tx: LedgerTx): Promise<void>;
  read(runId: RunId, fromOffset?: number, limit?: number): Promise<EventRecord[]>;
  emitTrigger(signal: TriggerSignal): Promise<void>;
  subscribeTriggers(runId: RunId, handler: (signal: TriggerSignal) => Promise<void>): Promise<() => Promise<void>>;
}
