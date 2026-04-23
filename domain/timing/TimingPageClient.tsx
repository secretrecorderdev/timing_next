"use client";

import { TradeList } from "@/shared/ui/components/trade/TradeList";
import { TimingDateRangeFilter } from "@/domain/timing/components/TimingDateRangeFilter";
import { useTimingTradeItems } from "@/domain/timing/hooks/useTimingTradeItems";
import { useTimingDateRangeStore } from "@/domain/timing/store/useTimingDateRangeStore";

export default function TimingPageClient() {
  const { startDate, endDate } = useTimingDateRangeStore();
  const { items } = useTimingTradeItems({ startDate, endDate, limit: 500, offset: 0 });

  return (
    <div className="pb-4">
      <TimingDateRangeFilter />
      <TradeList items={items} />
    </div>
  );
}
