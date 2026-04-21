import { memo } from "react";
import { TradeCard } from "./TradeCard";
import { formatDateTime, getHoldingDaysFrom } from "@/lib/utils/CommonUtils";
import type { TimingListItem } from "@/lib/types/timing";
import { TradeItem } from "@/types/trade";

interface TradeListProps {
  items: TradeItem[];
}

export const mapToTradeItem = (item: TimingListItem) => {
  const buyDate = item.buyDate ?? "";
  const holdingDays = getHoldingDaysFrom(buyDate);

  return {
    code: item.code ?? "-",
    name: item.name ?? "-",
    buyPrice: item.buyPrice ?? 0,
    currentPrice: item.currentPrice ?? 0,
    buyState: item.buyState ?? 0, // Assuming buyState is optional
    holdingDays,
    buyDateTime: formatDateTime(buyDate),
    profit: parseFloat(item.benefit ?? "0"),
  };
};

export const TradeList = memo(({ items }: TradeListProps) => {
  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <TradeCard key={`${item.code}-${item.buyDateTime}-${item.buyState}`} item={item} />
      ))}
    </div>
  );
});