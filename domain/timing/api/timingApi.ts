import { apiRequest } from "@/shared/api/axiosRequest";
import type { TimingListInput, TimingListItem, TimingPeriodSummary } from "@/domain/timing/types/timing";

export interface TimingListResponse {
  items: TimingListItem[];
  summary: TimingPeriodSummary | null;
  nextOffset: number;
  hasMore: boolean;
}

const DEFAULT_LIMIT = 500;

function normalizeTimingListResponse(payload: unknown): { items: TimingListItem[]; summary: TimingPeriodSummary | null } {
  if (Array.isArray(payload)) {
    return { items: payload as TimingListItem[], summary: null };
  }

  if (payload && typeof payload === "object") {
    const maybeData = (payload as { data?: unknown }).data;

    if (Array.isArray(maybeData)) {
      return { items: maybeData as TimingListItem[], summary: null };
    }

    if (maybeData && typeof maybeData === "object") {
      const dataObject = maybeData as { items?: unknown; summary?: unknown };
      if (Array.isArray(dataObject.items)) {
        return {
          items: dataObject.items as TimingListItem[],
          summary: (dataObject.summary as TimingPeriodSummary | undefined) ?? null,
        };
      }
    }

    const maybeResult = (payload as { result?: { data?: unknown } }).result;
    if (maybeResult && Array.isArray(maybeResult.data)) {
      return { items: maybeResult.data as TimingListItem[], summary: null };
    }
  }

  return { items: [], summary: null };
}

export async function fetchTimingList(input: TimingListInput): Promise<TimingListResponse> {
  const requestBody = {
    startDate: input.startDate,
    endDate: input.endDate,
    buyState: input.buyState,
    codes: input.codes,
    limit: input.limit ?? DEFAULT_LIMIT,
    offset: input.offset ?? 0,
  };

  if (input.polling) {
    console.log("[fetchTimingList:polling]", requestBody);
  }

  const payload = await apiRequest<unknown, Record<string, unknown>>("/timing/timing-list", {
    method: "POST",
    body: requestBody,
  });

  const { items, summary } = normalizeTimingListResponse(payload);

  if (input.polling) {
    console.log("폴링 결과", items, summary);
  }

  const offset = input.offset ?? 0;

  return {
    items,
    summary,
    nextOffset: offset + items.length,
    hasMore: items.length >= (input.limit ?? DEFAULT_LIMIT),
  };
}
