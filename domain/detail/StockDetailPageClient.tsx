"use client";

import { useMemo, useState } from "react";
import { useDetailTimingTradeItems } from "@/domain/detail/hooks/useDetailTimingTradeItems";
import { useDailyCloseChart } from "@/domain/detail/hooks/useDailyCloseChart";
import type { ChartSignalMarker } from "@/domain/detail/types/chart";
import type { KospiStockItem } from "@/domain/items/types/item";
import { TradeActionButtons } from "@/shared/ui/components/trade/TradeActionButtons";
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

  const chartPriceByDate = useMemo(() => new Map(chartItems.map((item) => [toMarkerDate(String(item.date)) ?? "", item.price])), [chartItems]);

  const chartMarkers = useMemo<ChartSignalMarker[]>(() => {
    const markers: ChartSignalMarker[] = [];

    rawItems.forEach((item) => {
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
    });

    return markers;
  }, [chartPriceByDate, rawItems]);

  const totalProfit = summary?.sumBenefit != null ? Number(summary.sumBenefit) : items.reduce((sum, item) => sum + item.profit, 0);
  const totalHoldingDays = summary?.sumPeriod != null ? Number(summary.sumPeriod) : rawItems.reduce((sum, item) => sum + (item.period ?? 0), 0);
  const annualizedProfit = summary?.annualizedBenefit != null
    ? Number(summary.annualizedBenefit)
    : totalHoldingDays > 0
      ? totalProfit / (totalHoldingDays / 365)
      : undefined;
  const rangeSummaryLabel = getRangeSummaryLabel(chartRange.startDate, chartRange.endDate, today);
  const periodLabel = `${rangeSummaryLabel} :`;
  const summaryDetailItems = [
    { label: "기간", value: rangeSummaryLabel },
    { label: "시작일", value: formatDateInputValue(chartRange.startDate) },
    { label: "종료일", value: formatDateInputValue(chartRange.endDate) },
    { label: "수익률 합", value: `${totalProfit > 0 ? "+" : ""}${totalProfit.toFixed(2)}%` },
    { label: "환산 연수익률", value: annualizedProfit == null ? "-" : `${annualizedProfit > 0 ? "+" : ""}${annualizedProfit.toFixed(2)}%` },
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
          annualizedProfit={annualizedProfit}
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
        {stock.baseName} [{stock.code}] · 총 {items.length.toLocaleString()}개
      </div>
      <TradeList items={items} onItemClick={setSelectedTradeItem} />
      <TradeDetailModal open={selectedTradeItem != null} item={selectedTradeItem} onClose={() => setSelectedTradeItem(null)} />
      <div className="mt-4">
        <TradeActionButtons code={stock.code} className="grid grid-cols-2 justify-items-center gap-2 sm:flex sm:justify-end sm:gap-3" />
      </div>
    </div>
  );
}
