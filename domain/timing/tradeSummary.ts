import type { TradeTypeFilter } from "@/shared/store/useTradeViewStore";

interface TradeSummaryTotals {
  totalProfit: number;
  totalHoldingDays: number;
}

export function getFilteredTradeSummary(
  filter: TradeTypeFilter,
  buy: TradeSummaryTotals,
  short: TradeSummaryTotals,
) {
  const totalProfit = (filter !== "short" ? buy.totalProfit : 0)
    + (filter !== "buy" ? short.totalProfit : 0);
  const totalHoldingDays = (filter !== "short" ? buy.totalHoldingDays : 0)
    + (filter !== "buy" ? short.totalHoldingDays : 0);

  return {
    totalProfit,
    totalHoldingDays,
    annualizedProfit: totalHoldingDays > 0 ? totalProfit / (totalHoldingDays / 365) : null,
  };
}
