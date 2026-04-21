"use client";

import { useEffect, useState } from "react";
import { fetchHoldingList } from "@/domain/timing/api/timing";
import { useLoadingStore } from "@/common/store/useLoadingStore";
import { mapToTradeItem, TradeList } from "@/domain/timing/components/TradeList";

export default function HoldingPageClient() {
  const { setLoading } = useLoadingStore();
  const [items, setItems] = useState<ReturnType<typeof mapToTradeItem>[]>([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const result = await fetchHoldingList({ buyState: 1, limit: 500, offset: 0 });
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
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [setLoading]);

  return <TradeList items={items} />;
}
