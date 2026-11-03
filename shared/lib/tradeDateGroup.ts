import type { TradeItem } from "@/shared/ui/components/trade/trade.types";

export interface TradeDateGroup {
  dateKey: string;
  label: string;
  total: number;
  counts: { buy: number; sell: number; short: number; cover: number };
  items: TradeItem[];
}

function getSignalDate(value: string | null | undefined): string | null {
  if (!value || !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(value)) {
    return null;
  }
  const date = new Date(`${value.replace(" ", "T")}:00Z`);
  // UTC is used only for calendar validation; never shift the server's date.
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 16).replace("T", " ") === value
    ? value.slice(0, 10)
    : null;
}

export function groupTradesByDate(items: TradeItem[]): TradeDateGroup[] {
  const groups = new Map<string, TradeDateGroup>();

  for (const item of items) {
    const dateKey = getSignalDate(item.timingDateTime) ?? "unknown";
    let group = groups.get(dateKey);
    if (!group) {
      const date = new Date(`${dateKey}T00:00:00Z`);
      const weekday = ["일", "월", "화", "수", "목", "금", "토"][date.getUTCDay()];
      group = {
        dateKey,
        label: dateKey === "unknown" ? "날짜 미상" : `${dateKey.replaceAll("-", ".")} (${weekday})`,
        total: 0,
        counts: { buy: 0, sell: 0, short: 0, cover: 0 },
        items: [],
      };
      groups.set(dateKey, group);
    }
    group.items.push(item);
    group.total += 1;
    switch (item.buyState) {
      case 1:
      case 2:
        group.counts.buy += 1;
        break;
      case 3:
        group.counts.sell += 1;
        break;
      case 11:
      case 12:
        group.counts.short += 1;
        break;
      case 13:
        group.counts.cover += 1;
        break;
    }
  }
  const result = Array.from(groups.values()).sort((a, b) => {
    if (a.dateKey === "unknown") return 1;
    if (b.dateKey === "unknown") return -1;
    return b.dateKey.localeCompare(a.dateKey);
  });
  for (const group of result) {
    if (group.dateKey !== "unknown") {
      group.items.sort((a, b) => (b.timingDateTime ?? "").localeCompare(a.timingDateTime ?? ""));
    }
  }
  return result;
}

export type TradeListRow =
  | { type: "header"; key: string; group: TradeDateGroup }
  | { type: "trade"; key: string; item: TradeItem };

export function createTradeListRows(items: TradeItem[], groupByDate = false): TradeListRow[] {
  const tradeRow = (item: TradeItem, index: number, prefix = ""): TradeListRow => ({
    type: "trade",
    key: `${prefix}trade:${item.code}:${item.buyDateTime}:${item.timingDateTime}:${item.buyState}:${index}`,
    item,
  });
  if (!groupByDate) {
    return items.map((item, index) => tradeRow(item, index));
  }
  return groupTradesByDate(items).flatMap((group): TradeListRow[] => [
    { type: "header", key: `date:${group.dateKey}`, group },
    ...group.items.map((item, index) => tradeRow(item, index, `${group.dateKey}:`)),
  ]);
}
