"use client";

import { useEffect, useState } from "react";
import { fetchTimingList } from "@/domain/timing/api/timing";
import { useTimingDateRangeStore } from "@/domain/timing/store/useTimingDateRangeStore";
import { useLoadingStore } from "@/store/useLoadingStore";
import { mapToTradeItem, TradeList } from "@/domain/timing/components/TradeList";

export default function TimingPageClient() {
  const { startDate, endDate } = useTimingDateRangeStore();
  const { setLoading } = useLoadingStore();
  const [items, setItems] = useState<ReturnType<typeof mapToTradeItem>[]>([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const result = await fetchTimingList({ startDate, endDate, limit: 500, offset: 0 });
        if (!cancelled) {
          setItems(result.items.map(mapToTradeItem));
        }
      } catch (error) {
        console.error("Failed to load timing list", error);
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
  }, [endDate, setLoading, startDate]);

  return <TradeList items={items} />;
}
