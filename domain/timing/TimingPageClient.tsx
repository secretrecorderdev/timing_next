"use client";

import { useMemo, useState } from "react";
import { TradeList } from "@/shared/ui/components/trade/TradeList";
import { DateRangeFilter } from "@/shared/ui/components/date-range/DateRangeFilter";
import { PeriodSummaryCard } from "@/shared/ui/components/summary/PeriodSummaryCard";
import CommonModal from "@/shared/ui/components/common/CommonModal";
import CommonDetailGrid from "@/shared/ui/components/common/CommonDetailGrid";
import { formatDateInputValue, getRangeSummaryLabel, MIN_TIMING_DATE } from "@/shared/lib/dateRange";
import { useTimingTradeItems } from "@/domain/timing/hooks/useTimingTradeItems";
import { useTimingDateRangeStore } from "@/domain/timing/store/useTimingDateRangeStore";

export default function TimingPageClient() {
  const { startDate, endDate, setRange } = useTimingDateRangeStore();
  const { items, rawItems } = useTimingTradeItems({ startDate, endDate, limit: 500, offset: 0 });
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

  const totalProfit = useMemo(
    () => items.reduce((sum, item) => sum + item.profit, 0),
    [items]
  );
  const totalHoldingDays = useMemo(
    () => rawItems.reduce((sum, item) => sum + (item.period ?? 0), 0),
    [rawItems]
  );
  const annualizedProfit = useMemo(() => {
    if (totalHoldingDays <= 0) {
      return null;
    }

    return totalProfit / (totalHoldingDays / 365);
  }, [totalHoldingDays, totalProfit]);
  const periodLabel = useMemo(() => `${getRangeSummaryLabel(startDate, endDate)} :`, [endDate, startDate]);
  const summaryDetailItems = useMemo(
    () => [
      {
        label: "기간",
        value: getRangeSummaryLabel(startDate, endDate),
      },
      {
        label: "시작일",
        value: formatDateInputValue(startDate),
      },
      {
        label: "종료일",
        value: formatDateInputValue(endDate),
      },
      {
        label: "수익률 합",
        value: `${totalProfit > 0 ? "+" : ""}${totalProfit.toFixed(2)}%`,
      },
      {
        label: "환산 연수익률",
        value:
          annualizedProfit == null
            ? "-"
            : `${annualizedProfit > 0 ? "+" : ""}${annualizedProfit.toFixed(2)}% (${totalProfit > 0 ? "+" : ""}${totalProfit.toFixed(2)} ÷ ${totalHoldingDays.toLocaleString()} × 365)`,
      },
      {
        label: "총 보유기간",
        value: `${totalHoldingDays.toLocaleString()}일`,
      },
    ],
    [annualizedProfit, endDate, startDate, totalHoldingDays, totalProfit],
  );

  return (
    <div className="pb-4">
      <DateRangeFilter
        startDate={startDate}
        endDate={endDate}
        minDate={MIN_TIMING_DATE}
        onChangeRange={setRange}
      />
      <PeriodSummaryCard
        periodLabel={periodLabel}
        totalProfit={totalProfit}
        totalHoldingDays={totalHoldingDays}
        annualizedProfit={annualizedProfit ?? undefined}
        onClick={() => setIsSummaryModalOpen(true)}
      />
      <CommonModal
        open={isSummaryModalOpen}
        title="기간 요약"
        hideCancelButton
        onConfirm={() => setIsSummaryModalOpen(false)}
        onCancel={() => setIsSummaryModalOpen(false)}
      >
        <CommonDetailGrid items={summaryDetailItems} />
      </CommonModal>
      <div className="mb-3 ml-2 text-sm font-semibold text-gray-700">
        총 {items.length.toLocaleString()}개
      </div>
      <TradeList items={items} />
    </div>
  );
}
