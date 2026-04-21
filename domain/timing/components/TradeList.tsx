import { memo } from "react";
import { TradeCard } from "./TradeCard";
import { formatDateTime, getHoldingDaysFrom } from "@/common/lib/CommonUtils";
import type { TimingListItem } from "@/domain/timing/types/timing";
import { TradeItem } from "@/common/types/trade";

interface TradeListProps {
  items: TradeItem[];
}

export const mapToTradeItem = (item: TimingListItem) => {
  const rawBuyDate = item.buyDate ?? item.timingDate ?? item.regDate ?? "";
  const buyDate = String(rawBuyDate).replace(/[^0-9]/g, "").slice(0, 12);
  const holdingDays = buyDate ? getHoldingDaysFrom(buyDate) : 0;
  const currentPrice = item.currentPrice && item.currentPrice > 0
    ? item.currentPrice
    : item.sellPrice ?? item.buyPrice ?? 0;

  return {
    code: item.code ?? "-",
    name: item.name ?? "-",
    buyPrice: item.buyPrice ?? item.sellPrice ?? 0,
    currentPrice,
    buyState: item.buyState ?? 0,
    holdingDays,
    buyDateTime: buyDate ? formatDateTime(buyDate) : "-",
    profit: Number.parseFloat(String(item.benefit ?? 0)) || 0,
  };
};

export const TradeList = memo(({ items }: TradeListProps) => {
  return (
    <div className="flex flex-col gap-4">
      {items.map((item, index) => (
        <TradeCard key={`${item.code}-${item.buyDateTime}-${item.buyState}-${item.buyPrice}-${index}`} item={item} />
      ))}
    </div>
  );
});