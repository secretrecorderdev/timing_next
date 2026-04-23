"use client";

import { TradeList } from "@/shared/ui/components/trade/TradeList";
import { useHoldingTradeItems } from "@/domain/hold/hooks/useHoldingTradeItems";

export default function HoldingPageClient() {
  const { items } = useHoldingTradeItems({ buyState: 1, limit: 500, offset: 0 });

  return (
    <div>
      <div className="mb-3 ml-2 text-sm font-semibold text-gray-700">
        총 {items.length.toLocaleString()}개
      </div>
      <TradeList items={items} />
    </div>
  );
}
