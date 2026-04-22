import { apiRequest } from "@/common/api/request";
import type { TimingListInput, TimingListItem } from "@/domain/timing/types/timing";

export interface TimingListResponse {
  items: TimingListItem[];
  nextOffset: number;
  hasMore: boolean;
}

const DEFAULT_LIMIT = 500;

function normalizeItems(payload: unknown): TimingListItem[] {
  if (Array.isArray(payload)) return payload as TimingListItem[];

  if (payload && typeof payload === "object") {
    const maybeData = (payload as { data?: unknown }).data;
    if (Array.isArray(maybeData)) return maybeData as TimingListItem[];

    const maybeResult = (payload as { result?: { data?: unknown } }).result;
    if (maybeResult && Array.isArray(maybeResult.data)) {
      return maybeResult.data as TimingListItem[];
    }
  }

  return [];
}

export async function fetchTimingList(input: TimingListInput): Promise<TimingListResponse> {
  const payload = await apiRequest<unknown, Record<string, unknown>>("/api/timing", {
    method: "POST",
    body: {
      startDate: input.startDate?.slice(0, 8),
      endDate: input.endDate?.slice(0, 8),
      buyState: input.buyState,
      limit: input.limit ?? DEFAULT_LIMIT,
      offset: input.offset ?? 0,
    },
  });

  const items = normalizeItems(payload);
  const offset = input.offset ?? 0;

  return {
    items,
    nextOffset: offset + items.length,
    hasMore: items.length >= (input.limit ?? DEFAULT_LIMIT),
  };
}

export async function fetchHoldingList(input: Pick<TimingListInput, "buyState" | "limit" | "offset"> = {}): Promise<TimingListResponse> {
  const payload = await apiRequest<unknown, Record<string, unknown>>("/api/hold", {
    method: "POST",
    body: {
      buyState: input.buyState ?? 1,
      limit: input.limit ?? DEFAULT_LIMIT,
      offset: input.offset ?? 0,
    },
  });

  const items = normalizeItems(payload);
  const offset = input.offset ?? 0;

  return {
    items,
    nextOffset: offset + items.length,
    hasMore: items.length >= (input.limit ?? DEFAULT_LIMIT),
  };
}
