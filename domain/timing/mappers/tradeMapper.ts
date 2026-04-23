import type { TimingListItem } from "@/domain/timing/types/timing";
import type { TradeItem } from "@/shared/ui/components/trade/trade.types";
import { formatDateTime, getHoldingDaysFrom } from "@/shared/lib/CommonUtils";

export function mapToTradeItem(item: TimingListItem): TradeItem {
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
}
