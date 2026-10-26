import type { TradeTypeFilter } from "@/shared/store/useTradeViewStore";

export function filterTradeItems<T extends { buyState: number }>(items: T[], filter: TradeTypeFilter): T[] {
  if (filter === "buy") {
    return items.filter((item) => item.buyState === 1 || item.buyState === 2 || item.buyState === 3);
  }
  if (filter === "short") {
    return items.filter((item) => item.buyState === 11 || item.buyState === 12 || item.buyState === 13);
  }
  return items;
}
