"use client";

import { TradeList } from "@/shared/ui/components/trade/TradeList";
import { useHoldingTradeItems } from "@/domain/hold/hooks/useHoldingTradeItems";

export default function HoldingPageClient() {
  const { items } = useHoldingTradeItems({ buyState: 1, limit: 500, offset: 0 });

  return <TradeList items={items} />;
}
