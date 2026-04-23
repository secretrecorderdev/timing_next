import { apiRequest } from "@/shared/api/axiosRequest";
import type { TimingListItem } from "@/domain/timing/types/timing";

export interface HoldingListResponse {
  items: TimingListItem[];
  nextOffset: number;
  hasMore: boolean;
}

interface HoldingListInput {
  buyState?: number;
  limit?: number;
  offset?: number;
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

export async function fetchHoldingList(input: HoldingListInput = {}): Promise<HoldingListResponse> {
  const payload = await apiRequest<unknown, Record<string, unknown>>("/timing/timing-hold-list", {
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
