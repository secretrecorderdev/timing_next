import { useEffect, useState } from "react";
import { useLoadingStore } from "@/shared/store/useLoadingStore";
import { fetchTimingList } from "@/domain/timing/api/timingApi";
import { mapToTradeItem } from "@/domain/timing/mappers/tradeMapper";
import type { TimingListInput } from "@/domain/timing/types/timing";

type TradeItem = ReturnType<typeof mapToTradeItem>;

export function useTimingTradeItems(input: TimingListInput) {
  const { setGlobalLoading } = useLoadingStore();
  const [items, setItems] = useState<TradeItem[]>([]);
  const [rawItems, setRawItems] = useState<Awaited<ReturnType<typeof fetchTimingList>>["items"]>([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setGlobalLoading(true);

      try {
        const result = await fetchTimingList({
          startDate: input.startDate,
          endDate: input.endDate,
          buyState: input.buyState,
          limit: input.limit ?? 500,
          offset: input.offset ?? 0,
        });

        if (!cancelled) {
          setRawItems(result.items);
          setItems(result.items.map(mapToTradeItem));
        }
      } catch (error) {
        console.error("Failed to load timing list", error);
        if (!cancelled) {
          setRawItems([]);
          setItems([]);
        }
      } finally {
        if (!cancelled) {
          setGlobalLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [input.buyState, input.endDate, input.limit, input.offset, input.startDate, setGlobalLoading]);

  return { items, rawItems };
}
