"use client";

import { useMemo, useState } from "react";
import { useDetailTimingTradeItems } from "@/domain/detail/hooks/useDetailTimingTradeItems";
import { useDailyCloseChart } from "@/domain/detail/hooks/useDailyCloseChart";
import type { ChartSignalMarker } from "@/domain/detail/types/chart";
import type { KospiStockItem } from "@/domain/items/types/item";
import { useTradeViewStore } from "@/shared/store/useTradeViewStore";
import { filterTradeItems } from "@/shared/lib/tradeTypeFilter";
import { getFilteredTradeSummary } from "@/domain/timing/tradeSummary";
import { TradeDetailModal } from "@/shared/ui/components/trade/TradeDetailModal";
import { TradeList } from "@/shared/ui/components/trade/TradeList";
import type { TradeItem } from "@/shared/ui/components/trade/trade.types";
import { StockDailyCloseChartCard } from "@/shared/ui/components/chart/StockDailyCloseChartCard";
import CommonDetailGrid from "@/shared/ui/components/common/CommonDetailGrid";
import CommonModal from "@/shared/ui/components/common/CommonModal";
import { DateRangeFilter } from "@/shared/ui/components/date-range/DateRangeFilter";
import { PeriodSummaryCard } from "@/shared/ui/components/summary/PeriodSummaryCard";
import { formatDateInputValue, getRangeSummaryLabel, MIN_TIMING_DATE, toRangeByPreset } from "@/shared/lib/dateRange";

function toMarkerDate(value?: string | null) {
  if (!value) {
    return null;
  }

  const raw = String(value).replace(/[^0-9]/g, "").slice(0, 8);
  if (raw.length !== 8) {
    return null;
  }

  return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
}

export default function StockDetailPageClient({ stock, today }: { stock: KospiStockItem; today: string }) {
  const codes = useMemo(() => [stock.code], [stock.code]);
  const defaultRange = useMemo(() => toRangeByPreset("1y", today), [today]);
  const [chartRange, setChartRange] = useState(defaultRange);
  const { items, rawItems, summary } = useDetailTimingTradeItems({
    codes,
    startDate: chartRange.startDate,
    endDate: chartRange.endDate,
    limit: 500,
    offset: 0,
  });
  const { items: chartItems, isLoading: isChartLoading, error: chartError } = useDailyCloseChart(
    stock.code,
    chartRange.startDate,
    chartRange.endDate,
  );
  const [selectedTradeItem, setSelectedTradeItem] = useState<TradeItem | null>(null);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const tradeTypeFilter = useTradeViewStore((state) => state.tradeTypeFilter);
  const filteredItems = useMemo(() => filterTradeItems(items, tradeTypeFilter), [items, tradeTypeFilter]);
  const filteredRawItems = useMemo(
    () => filterTradeItems(rawItems.map((item) => ({ ...item, buyState: Number(item.buyState ?? 0) })), tradeTypeFilter),
    [rawItems, tradeTypeFilter],
  );

  const chartPriceByDate = useMemo(() => new Map(chartItems.map((item) => [toMarkerDate(String(item.date)) ?? "", item.price])), [chartItems]);

  const chartMarkers = useMemo<ChartSignalMarker[]>(() => {
    const markers: ChartSignalMarker[] = [];

    filteredRawItems.forEach((item) => {
      const buyState = Number(item.buyState ?? 0);
      const buyDate = toMarkerDate(item.buyDate ?? item.timingDate ?? item.regDate);
      const sellDate = toMarkerDate(item.sellDate ?? item.priceDate);
      const buyPriceOnChart = buyDate ? chartPriceByDate.get(buyDate) : undefined;
      const sellPriceOnChart = sellDate ? chartPriceByDate.get(sellDate) : undefined;

      if ((buyState === 1 || buyState === 2) && buyDate && buyPriceOnChart != null) {
        markers.push({ id: `buy-${item.id}-${buyDate}`, time: buyDate, position: "belowBar", shape: "arrowUp", color: "#ef4444", text: "매수" });
      }

      if ((buyState === 2 || buyState === 3) && sellDate && sellPriceOnChart != null) {
        markers.push({ id: `sell-${item.id}-${sellDate}`, time: sellDate, position: "aboveBar", shape: "arrowDown", color: "#2563eb", text: "매도" });
      }

      if ((buyState === 11 || buyState === 12) && buyDate && buyPriceOnChart != null) {
        markers.push({ id: `short-${item.id}-${buyDate}`, time: buyDate, position: "aboveBar", shape: "arrowDown", color: "#a855f7", text: "대주매도" });
      }

      const coverDate = toMarkerDate(item.timingDate);
      if (buyState === 13 && coverDate && chartPriceByDate.has(coverDate)) {
        markers.push({ id: `cover-${item.id}-${coverDate}`, time: coverDate, position: "belowBar", shape: "arrowUp", color: "#22c55e", text: "청산" });
      }
    });

    return markers.sort((a, b) => a.time.localeCompare(b.time));
  }, [chartPriceByDate, filteredRawItems]);

  const buySummaryTargetItems = useMemo(
    () => items.filter((item) => item.buyState === 1 || item.buyState === 3),
    [items],
  );
  const buySignalCount = useMemo(
    () => items.filter((item) => item.buyState === 1 || item.buyState === 2).length,
    [items],
  );
  const sellSignalCount = useMemo(
    () => items.filter((item) => item.buyState === 3).length,
    [items],
  );
  const shortSummaryTargetItems = useMemo(
    () => items.filter((item) => item.buyState === 11 || item.buyState === 13),
    [items],
  );
  const shortSignalCount = items.filter((item) => item.buyState === 11 || item.buyState === 12).length;
  const coverSignalCount = items.filter((item) => item.buyState === 13).length;
  const buyTotals = useMemo(
    () => ({
      totalProfit: buySummaryTargetItems.reduce((sum, item) => sum + item.profit, 0),
      totalHoldingDays: buySummaryTargetItems.reduce((sum, item) => sum + item.holdingDays, 0),
    }),
    [buySummaryTargetItems],
  );
  const shortTotals = useMemo(
    () => ({
      totalProfit: shortSummaryTargetItems.reduce((sum, item) => sum + item.profit, 0),
      totalHoldingDays: shortSummaryTargetItems.reduce((sum, item) => sum + item.holdingDays, 0),
    }),
    [shortSummaryTargetItems],
  );
  const { totalProfit, totalHoldingDays, annualizedProfit } = getFilteredTradeSummary(tradeTypeFilter, buyTotals, shortTotals);
  const tradeSummaryLabel = tradeTypeFilter === "buy" ? "매수/매도" : tradeTypeFilter === "short" ? "대주매도/청산" : "전체";
  const rangeSummaryLabel = getRangeSummaryLabel(chartRange.startDate, chartRange.endDate, today);
  const periodLabel = `${rangeSummaryLabel} (${tradeSummaryLabel}) :`;
  const summaryDetailItems = [
    { label: "기간", value: rangeSummaryLabel },
    { label: "시작일", value: formatDateInputValue(chartRange.startDate) },
    { label: "종료일", value: formatDateInputValue(chartRange.endDate) },
    { label: "수익률 합", value: `${totalProfit > 0 ? "+" : ""}${totalProfit.toFixed(2)}%` },
    { label: "환산 연수익률", value: annualizedProfit == null ? "-" : `${annualizedProfit > 0 ? "+" : ""}${annualizedProfit.toFixed(2)}%` },
    ...(tradeTypeFilter !== "short" ? [
      { label: "매수/매도 수익률 합", value: `${buyTotals.totalProfit > 0 ? "+" : ""}${buyTotals.totalProfit.toFixed(2)}%` },
      { label: "매수/매도 신호", value: `매수 신호 ${buySignalCount.toLocaleString()}건, 매도 신호 ${sellSignalCount.toLocaleString()}건` },
    ] : []),
    ...(tradeTypeFilter !== "buy" ? [
      { label: "대주매도/청산 수익률 합", value: `${shortTotals.totalProfit > 0 ? "+" : ""}${shortTotals.totalProfit.toFixed(2)}%` },
      { label: "대주매도/청산 신호", value: `대주매도 신호 ${shortSignalCount.toLocaleString()}건, 청산 신호 ${coverSignalCount.toLocaleString()}건` },
    ] : []),
    { label: "총 보유기간", value: `${totalHoldingDays.toLocaleString()}일` },
    {
      label: "코스피 변동률",
      value: summary?.kospiBenefit == null
        ? "-"
        : `${Number(summary.kospiBenefit) > 0 ? "+" : ""}${Number(summary.kospiBenefit).toFixed(2)}% (${summary.startDateKospiValue ?? "-"} → ${summary.endDateKospiValue ?? "-"})`,
    },
  ];

  return (
    <div className="mt-6">
      <DateRangeFilter
        startDate={chartRange.startDate}
        endDate={chartRange.endDate}
        minDate={MIN_TIMING_DATE}
        maxDate={today}
        onChangeRange={(startDate, endDate) => setChartRange({ startDate, endDate })}
      />
      <StockDailyCloseChartCard title={stock.baseName} code={stock.code} data={chartItems} markers={chartMarkers} isLoading={isChartLoading} error={chartError} />
      <div className="mt-4">
        <PeriodSummaryCard
          periodLabel={periodLabel}
          totalProfit={totalProfit}
          totalHoldingDays={totalHoldingDays}
          annualizedProfit={annualizedProfit ?? undefined}
          onClick={() => setIsSummaryModalOpen(true)}
        />
      </div>
      <CommonModal
        open={isSummaryModalOpen}
        title="기간 요약"
        hideCancelButton
        onConfirm={() => setIsSummaryModalOpen(false)}
        onCancel={() => setIsSummaryModalOpen(false)}
      >
        <CommonDetailGrid items={summaryDetailItems} />
      </CommonModal>

      <div className="mb-3 mt-6 ml-1 text-sm font-semibold text-gray-700 sm:ml-2">
        {stock.baseName} [{stock.code}] · 총 {filteredItems.length.toLocaleString()}개
      </div>
      <TradeList items={filteredItems} onItemClick={setSelectedTradeItem} />
      <TradeDetailModal open={selectedTradeItem != null} item={selectedTradeItem} onClose={() => setSelectedTradeItem(null)} />
    </div>
  );
}
