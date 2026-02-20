import type { Envelope, MessageId } from "./types";

export interface MailboxTransportPort {
  publish(envelope: Envelope): Promise<void>;
  consume(consumerId: string, limit: number): Promise<Envelope[]>;
  ack(consumerId: string, messageId: MessageId): Promise<void>;
  nack(consumerId: string, messageId: MessageId, reason: string): Promise<void>;
  deadletter(consumerId: string, messageId: MessageId, reason: string): Promise<void>;
}
