import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { fetchTimingList, type TimingListResponse } from "@/domain/timing/api/timingApi";
import { mapToTradeItem } from "@/domain/timing/mappers/tradeMapper";
import type { TimingListInput } from "@/domain/timing/types/timing";

export interface TimingTradeItemsQueryData {
  items: ReturnType<typeof mapToTradeItem>[];
  rawItems: TimingListResponse["items"];
  summary: TimingListResponse["summary"];
}

export function normalizeTimingTradeItemsInput(input: TimingListInput): Required<TimingListInput> {
  return {
    startDate: input.startDate ?? "",
    endDate: input.endDate ?? "",
    buyState: input.buyState ?? 0,
    codes: input.codes ?? [],
    limit: input.limit ?? 500,
    offset: input.offset ?? 0,
  };
}

export function createTimingTradeItemsQueryKey(input: TimingListInput) {
  const normalized = normalizeTimingTradeItemsInput(input);

  return [
    "timingTradeItems",
    normalized.startDate,
    normalized.endDate,
    normalized.buyState,
    normalized.codes.join(","),
    normalized.limit,
    normalized.offset,
  ] as const;
}

export function useTimingTradeItemsQuery(
  input: TimingListInput,
  options?: Omit<UseQueryOptions<TimingListResponse, Error, TimingTradeItemsQueryData>, "queryKey" | "queryFn">,
) {
  const normalizedInput = normalizeTimingTradeItemsInput(input);

  return useQuery<TimingListResponse, Error, TimingTradeItemsQueryData>({
    queryKey: createTimingTradeItemsQueryKey(normalizedInput),
    queryFn: () => fetchTimingList(normalizedInput),
    select: (data) => ({
      items: data.items.map(mapToTradeItem),
      rawItems: data.items,
      summary: data.summary,
    }),
    ...options,
  });
}
