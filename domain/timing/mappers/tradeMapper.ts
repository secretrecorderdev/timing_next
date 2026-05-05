import type { TimingListItem } from "@/domain/timing/types/timing";
import type { TradeItem } from "@/shared/ui/components/trade/trade.types";
import { formatDateTime } from "@/shared/lib/CommonUtils";

export function mapToTradeItem(item: TimingListItem): TradeItem {
  const rawBuyDate = item.buyDate ?? item.regDate ?? "";
  const buyDate = String(rawBuyDate).replace(/[^0-9]/g, "").slice(0, 12);
  const rawTimingDate = item.timingDate ?? "";
  const timingDate = String(rawTimingDate).replace(/[^0-9]/g, "").slice(0, 12);
  const rawPriceDate = item.priceDate ?? "";
  const priceDate = String(rawPriceDate).replace(/[^0-9]/g, "").slice(0, 12);
  const holdingDays = item.period ?? 0;
  const currentPrice = item.currentPrice && item.currentPrice > 0
    ? item.currentPrice
    : item.sellPrice ?? item.buyPrice ?? 0;

  const rawSellDate = item.sellDate ?? item.priceDate ?? "";
  const sellDate = String(rawSellDate).replace(/[^0-9]/g, "").slice(0, 12);

  return {
    code: item.code ?? "-",
    name: item.name ?? "-",
    buyPrice: item.buyPrice ?? 0,
    currentPrice,
    sellPrice: item.sellPrice ?? null,
    buyState: item.buyState ?? 0,
    holdingDays,
    buyDateTime: buyDate ? formatDateTime(buyDate) : "-",
    timingDateTime: timingDate ? formatDateTime(timingDate) : null,
    priceDateTime: priceDate ? formatDateTime(priceDate) : null,
    sellDateTime: sellDate ? formatDateTime(sellDate) : null,
    buyRiskLevel: item.buyRiskLevel ?? null,
    buyRiskLevelKr: item.buyRiskLevelKr ?? null,
    profit: Number.parseFloat(String(item.benefit ?? 0)) || 0,
  };
}
