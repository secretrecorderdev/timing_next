"use client";

import { useMemo, useState } from "react";
import { useHoldingTradeItems } from "@/domain/hold/hooks/useHoldingTradeItems";
import { TradeDetailModal } from "@/shared/ui/components/trade/TradeDetailModal";
import { TradeList } from "@/shared/ui/components/trade/TradeList";
import type { TradeItem } from "@/shared/ui/components/trade/trade.types";
import { useTradeViewStore } from "@/shared/store/useTradeViewStore";
import { filterTradeItems } from "@/shared/lib/tradeTypeFilter";

export default function HoldingPageClient() {
  const { items } = useHoldingTradeItems({ buyState: 1, limit: 500, offset: 0 });
  const tradeTypeFilter = useTradeViewStore((state) => state.tradeTypeFilter);
  const filteredItems = useMemo(
    () => filterTradeItems(items, tradeTypeFilter),
    [items, tradeTypeFilter],
  );
  const [selectedTradeItem, setSelectedTradeItem] = useState<TradeItem | null>(null);
  const totalProfit = useMemo(
    () => filteredItems.reduce((sum, item) => sum + item.profit, 0),
    [filteredItems]
  );
  const totalHoldingDays = useMemo(
    () => filteredItems.reduce((sum, item) => sum + item.holdingDays, 0),
    [filteredItems]
  );

  return (
    <div className="pb-10 sm:pb-12">
      <div className="mb-3 ml-1 text-sm font-semibold text-gray-700 sm:ml-2">
        총 {filteredItems.length.toLocaleString()}개 · 수익률 합 {totalProfit > 0 ? "+" : ""}{totalProfit.toFixed(2)}% · 총 보유기간 {totalHoldingDays.toLocaleString()}일
      </div>
      <TradeList items={filteredItems} onItemClick={setSelectedTradeItem} />
      <TradeDetailModal
        open={selectedTradeItem != null}
        item={selectedTradeItem}
        onClose={() => setSelectedTradeItem(null)}
      />
    </div>
  );
}
