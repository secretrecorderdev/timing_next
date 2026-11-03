import type { TradeDateGroup } from "@/shared/lib/tradeDateGroup";
import type { TradeTypeFilter } from "@/shared/store/useTradeViewStore";

interface TradeDateHeaderProps {
  group: TradeDateGroup;
  tradeTypeFilter?: TradeTypeFilter;
}

export function TradeDateHeader({ group, tradeTypeFilter = "all" }: TradeDateHeaderProps) {
  return (
    <div className="mt-4 mb-2 border-t border-gray-200 px-2 pt-4 pb-1">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 className="text-sm font-semibold text-gray-800 sm:text-base">{group.label}</h2>
        <span className="text-xs text-gray-500 sm:text-sm">총 {group.total.toLocaleString()}건</span>
      </div>
      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium sm:text-sm">
        {tradeTypeFilter !== "short" && <>
          <span className="text-red-500">매수 {group.counts.buy.toLocaleString()}</span>
          <span className="text-blue-500">매도 {group.counts.sell.toLocaleString()}</span>
        </>}
        {tradeTypeFilter !== "buy" && <>
          <span className="text-purple-500">대주매도 {group.counts.short.toLocaleString()}</span>
          <span className="text-green-500">청산 {group.counts.cover.toLocaleString()}</span>
        </>}
      </div>
    </div>
  );
}
