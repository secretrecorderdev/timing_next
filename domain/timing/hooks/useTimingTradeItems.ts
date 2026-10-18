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

    useEffect(() => {
    console.log("[useTimingTradeItems] input:", input);
  }, [input]);

  useEffect(() => {
    console.log("[useTimingTradeItems] 상태:", {
      isLoading: timingTradeItemsResult.isLoading,
      isFetching: timingTradeItemsResult.isFetching,
      isError: timingTradeItemsResult.isError,
      error: timingTradeItemsResult.error,
    });

    setGlobalLoading(timingTradeItemsResult.isLoading);
  }, [
    timingTradeItemsResult.isLoading,
    timingTradeItemsResult.isFetching,
    timingTradeItemsResult.isError,
    timingTradeItemsResult.error,
    setGlobalLoading,
  ]);

   useEffect(() => {
    console.log(
      "[useTimingTradeItems] API 응답:",
      timingTradeItemsResult.data
    );

    console.log("[useTimingTradeItems] 가공 데이터:", {
      items: timingTradeItemsResult.data?.items ?? [],
      rawItems: timingTradeItemsResult.data?.rawItems ?? [],
      summary: timingTradeItemsResult.data?.summary ?? null,
      lastFetchedAt: timingTradeItemsResult.dataUpdatedAt
        ? new Date(timingTradeItemsResult.dataUpdatedAt).toLocaleString()
        : null,
    });
  }, [
    timingTradeItemsResult.data,
    timingTradeItemsResult.dataUpdatedAt,
  ]);
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
