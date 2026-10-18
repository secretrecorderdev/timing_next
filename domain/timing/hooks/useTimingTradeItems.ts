import { useEffect } from "react";
import type { TimingListInput } from "@/domain/timing/types/timing";
import { useTimingTradeItemsQuery } from "@/shared/hooks/useTimingTradeItemsQuery";
import { useLoadingStore } from "@/shared/store/useLoadingStore";

export function useTimingTradeItems(input: TimingListInput) {
  const { setGlobalLoading } = useLoadingStore();
  const timingTradeItemsResult = useTimingTradeItemsQuery(input);

  useEffect(() => {
    setGlobalLoading(timingTradeItemsResult.isLoading);
  }, [timingTradeItemsResult.isLoading, setGlobalLoading]);

  return {
    items: timingTradeItemsResult.data?.items ?? [],
    rawItems: timingTradeItemsResult.data?.rawItems ?? [],
    summary: timingTradeItemsResult.data?.summary ?? null,
    isLoading: timingTradeItemsResult.isLoading,
    error: timingTradeItemsResult.error?.message ?? null,
    lastFetchedAt: timingTradeItemsResult.dataUpdatedAt || null,
    refetch: timingTradeItemsResult.refetch,
  };
}
