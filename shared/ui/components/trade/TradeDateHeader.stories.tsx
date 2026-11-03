import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TradeDateHeader } from "./TradeDateHeader";

const group = {
  dateKey: "2026-11-03",
  label: "2026.11.03 (화)",
  total: 6,
  counts: { buy: 2, sell: 1, short: 2, cover: 1 },
  items: [],
};

const meta = {
  title: "shared/ui/components/trade/TradeDateHeader",
  component: TradeDateHeader,
  parameters: { layout: "padded" },
  args: { group, tradeTypeFilter: "all" },
} satisfies Meta<typeof TradeDateHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const All: Story = {};
export const Buy: Story = { args: { tradeTypeFilter: "buy" } };
export const Short: Story = { args: { tradeTypeFilter: "short" } };
export const Zero: Story = {
  args: { group: { ...group, total: 0, counts: { buy: 0, sell: 0, short: 0, cover: 0 } } },
};
export const LargeCounts: Story = {
  args: { group: { ...group, total: 123456, counts: { buy: 30000, sell: 30000, short: 30000, cover: 33456 } } },
};
export const UnknownDate: Story = {
  args: { group: { ...group, dateKey: "unknown", label: "날짜 미상" } },
};
