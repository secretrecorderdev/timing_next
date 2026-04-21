import type { TimingListInput, TimingListItem } from "@/lib/types/timing";

export interface TimingListResponse {
  items: TimingListItem[];
  nextOffset: number;
  hasMore: boolean;
}

const DEFAULT_LIMIT = 500;

async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

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
  const payload = await fetchJson<unknown>("/api/timing", {
    method: "POST",
    body: JSON.stringify({
      startDate: input.startDate?.slice(0, 8),
      endDate: input.endDate?.slice(0, 8),
      buyState: input.buyState,
      limit: input.limit ?? DEFAULT_LIMIT,
      offset: input.offset ?? 0,
    }),
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
  const payload = await fetchJson<unknown>("/api/hold", {
    method: "POST",
    body: JSON.stringify({
      buyState: input.buyState ?? 1,
      limit: input.limit ?? DEFAULT_LIMIT,
      offset: input.offset ?? 0,
    }),
  });

  const items = normalizeItems(payload);
  const offset = input.offset ?? 0;

  return {
    items,
    nextOffset: offset + items.length,
    hasMore: items.length >= (input.limit ?? DEFAULT_LIMIT),
  };
}
