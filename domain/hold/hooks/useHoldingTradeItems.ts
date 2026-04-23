import { useEffect, useState } from "react";
import { useLoadingStore } from "@/shared/store/useLoadingStore";
import { fetchHoldingList } from "@/domain/hold/api/holdApi";
import { mapToTradeItem } from "@/domain/timing/mappers/tradeMapper";

type TradeItem = ReturnType<typeof mapToTradeItem>;

interface UseHoldingTradeItemsParams {
  buyState?: number;
  limit?: number;
  offset?: number;
}

export function useHoldingTradeItems(input: UseHoldingTradeItemsParams = {}) {
  const { setGlobalLoading } = useLoadingStore();
  const [items, setItems] = useState<TradeItem[]>([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setGlobalLoading(true);

      try {
        const result = await fetchHoldingList({
          buyState: input.buyState ?? 1,
          limit: input.limit ?? 500,
          offset: input.offset ?? 0,
        });

        if (!cancelled) {
          setItems(result.items.map(mapToTradeItem));
        }
      } catch (error) {
        console.error("Failed to load holding list", error);
        if (!cancelled) {
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
  }, [input.buyState, input.limit, input.offset, setGlobalLoading]);

  return { items };
}
