import { useEffect, useMemo } from "react";
import { useLoadingStore } from "@/shared/store/useLoadingStore";
import { createDetailTimingTradeItemsKey, useDetailTimingTradeItemsStore } from "@/domain/detail/store/useDetailTimingTradeItemsStore";
import type { TimingListInput } from "@/domain/timing/types/timing";

const POLLING_INTERVAL_MS = 10_000;

export function useDetailTimingTradeItems(input: TimingListInput) {
  const { setGlobalLoading } = useLoadingStore();
  const requestInput = useMemo(
    () => ({
      startDate: input.startDate,
      endDate: input.endDate,
      buyState: input.buyState,
      codes: input.codes,
      limit: input.limit ?? 500,
      offset: input.offset ?? 0,
    }),
    [input.buyState, input.codes, input.endDate, input.limit, input.offset, input.startDate],
  );
  const key = useMemo(() => createDetailTimingTradeItemsKey(requestInput), [requestInput]);
  const entry = useDetailTimingTradeItemsStore((state) => state.entries[key]);
  const ensureEntry = useDetailTimingTradeItemsStore((state) => state.ensureEntry);
  const fetchEntry = useDetailTimingTradeItemsStore((state) => state.fetchEntry);

  useEffect(() => {
    ensureEntry(key);
  }, [ensureEntry, key]);

  useEffect(() => {
    let cancelled = false;

    const load = async (silent: boolean) => {
      if (!silent) {
        setGlobalLoading(true);
      }

      try {
        await fetchEntry(key, requestInput, { silent });
      } finally {
        if (!silent && !cancelled) {
          setGlobalLoading(false);
        }
      }
    };

    const hasCachedData = useDetailTimingTradeItemsStore.getState().entries[key]?.lastFetchedAt != null;
    void load(hasCachedData);

    const intervalId = window.setInterval(() => {
      void load(true);
    }, POLLING_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [fetchEntry, key, requestInput, setGlobalLoading]);

  return {
    items: entry?.items ?? [],
    rawItems: entry?.rawItems ?? [],
    summary: entry?.summary ?? null,
    isLoading: entry?.isLoading ?? false,
    error: entry?.error ?? null,
    lastFetchedAt: entry?.lastFetchedAt ?? null,
  };
}
