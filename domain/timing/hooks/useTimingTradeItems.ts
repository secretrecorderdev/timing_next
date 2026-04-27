import { useEffect } from "react";
import type { TimingListInput } from "@/domain/timing/types/timing";
import { useTimingTradeItemsQuery } from "@/shared/hooks/useTimingTradeItemsQuery";
import { useLoadingStore } from "@/shared/store/useLoadingStore";

export function useTimingTradeItems(input: TimingListInput) {
  const { setGlobalLoading } = useLoadingStore();
  const query = useTimingTradeItemsQuery(input);

  useEffect(() => {
    setGlobalLoading(query.isLoading);
  }, [query.isLoading, setGlobalLoading]);

  return {
    items: query.data?.items ?? [],
    rawItems: query.data?.rawItems ?? [],
    summary: query.data?.summary ?? null,
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
    lastFetchedAt: query.dataUpdatedAt || null,
    refetch: query.refetch,
  };
}
