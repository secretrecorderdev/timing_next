export type SignalInboxTone = "default" | "success" | "warning" | "danger" | "info";

export interface SignalInboxItem {
  id: string;
  source?: string;
  title: string;
  body?: string;
  tone: SignalInboxTone;
  createdAt: number;
  read: boolean;
  confirmedAt?: number | null;
  sound?: boolean;
  code?: string;
  name?: string;
  timingDate?: string | null;
  metadata?: Record<string, unknown>;
}

export interface SignalInboxCreateInput {
  source?: string;
  title: string;
  body?: string;
  tone?: SignalInboxTone;
  sound?: boolean;
  code?: string;
  name?: string;
  timingDate?: string | null;
  metadata?: Record<string, unknown>;
}

export interface SignalInboxCursor {
  currentIndex: number;
  totalCount: number;
}
