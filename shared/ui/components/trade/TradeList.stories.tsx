import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TradeList } from "./TradeList";
import { TradeDetailModal } from "./TradeDetailModal";
import type { TradeItem } from "./trade.types";
import { filterTradeItems } from "@/shared/lib/tradeTypeFilter";
import type { TradeTypeFilter } from "@/shared/store/useTradeViewStore";

const sampleItems: TradeItem[] = Array.from({ length: 600 }, (_, index) => ({
  code: String(index).padStart(6, "0"),
  name: `샘플 종목 ${index + 1}`,
  buyState: [1, 2, 3, 11, 12, 13][index % 6],
  buyPrice: 10000,
  currentPrice: 11000,
  sellPrice: 10500,
  holdingDays: 5,
  buyDateTime: "2026-04-01 09:00",
  timingDateTime: index === 599 ? null : `2026-04-${String(28 - Math.floor(index / 24)).padStart(2, "0")} ${String(9 + index % 7).padStart(2, "0")}:30`,
  profit: index % 2 ? -5 : 10,
}));

function DateGroupedList({ initialFilter = "all", groupByDate = true, empty = false }: {
  initialFilter?: TradeTypeFilter;
  groupByDate?: boolean;
  empty?: boolean;
}) {
  const [filter, setFilter] = useState(initialFilter);
  const [selectedItem, setSelectedItem] = useState<TradeItem | null>(null);
  const items = filterTradeItems(empty ? [] : sampleItems, filter);
  return (
    <div className="mx-auto w-full max-w-4xl p-3">
      <div className="mb-2 flex flex-wrap items-center gap-3 text-sm">
        {(["all", "buy", "short"] as const).map((value) => (
          <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)} className="rounded border px-2 py-1">
            {value === "all" ? "전체" : value === "buy" ? "매수/매도" : "대주매도/청산"}
          </button>
        ))}
        <span>총 {items.length}개</span>
      </div>
      <TradeList key={filter} items={items} height={560} groupByDate={groupByDate} tradeTypeFilter={filter} onItemClick={setSelectedItem} />
      <TradeDetailModal open={selectedItem != null} item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}

const meta = {
  title: "shared/ui/components/trade/TradeList",
  component: DateGroupedList,
  parameters: { layout: "fullscreen", nextjs: { appDirectory: true } },
} satisfies Meta<typeof DateGroupedList>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DailySignals: Story = {};
export const Buy: Story = { args: { initialFilter: "buy" } };
export const Short: Story = { args: { initialFilter: "short" } };
export const Ungrouped: Story = { args: { groupByDate: false } };
export const Empty: Story = { args: { empty: true } };
