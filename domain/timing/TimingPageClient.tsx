"use client";

import { useEffect, useMemo, useState } from "react";
import { TradeList } from "@/shared/ui/components/trade/TradeList";
import { TradeDetailModal } from "@/shared/ui/components/trade/TradeDetailModal";
import type { TradeItem } from "@/shared/ui/components/trade/trade.types";
import { DateRangeFilter } from "@/shared/ui/components/date-range/DateRangeFilter";
import { PeriodSummaryCard } from "@/shared/ui/components/summary/PeriodSummaryCard";
import CommonModal from "@/shared/ui/components/common/CommonModal";
import CommonDetailGrid from "@/shared/ui/components/common/CommonDetailGrid";
import { formatDateInputValue, getRangeSummaryLabel, MIN_TIMING_DATE, toRangeByPreset } from "@/shared/lib/dateRange";
import { useTimingTradeItems } from "@/domain/timing/hooks/useTimingTradeItems";
import { useRiskDaily } from "@/domain/risk/hooks/useRiskDaily";
import { RiskDailyList } from "@/domain/risk/components/RiskDailyList";
import { getRiskDailySignal } from "@/domain/risk/types/riskDaily";
import { usePageRefreshStore } from "@/shared/store/usePageRefreshStore";
import { useTradeViewStore } from "@/shared/store/useTradeViewStore";
import { getFilteredTradeSummary } from "./tradeSummary";
import { filterTradeItems } from "@/shared/lib/tradeTypeFilter";

export default function TimingPageClient({ today }: { today: string }) {
  const [range, setRange] = useState(() => toRangeByPreset("3m", today));
  const { startDate, endDate } = range;
  const { items, summary, refetch: refetchTimingItems } = useTimingTradeItems({ startDate, endDate, limit: 500, offset: 0 });

  const refreshRevision = usePageRefreshStore((state) => state.timingRevision);
  const tradeTypeFilter = useTradeViewStore((state) => state.tradeTypeFilter);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isRiskHistoryModalOpen, setIsRiskHistoryModalOpen] = useState(false);
  const dailyRiskQuery = useRiskDaily();
  const refetchDailyRisk = dailyRiskQuery.refetch;
  const latestRiskSignal = dailyRiskQuery.data?.[0]?.risk10Signal ?? null;
  const riskButtonStyle = getRiskDailySignal(latestRiskSignal);
  const riskButtonLabel = latestRiskSignal === 10 ? "매수 추천"
    : latestRiskSignal === 20 ? "매수/매도 혼합"
    : latestRiskSignal === 30 ? "매도 추천"
    : "매매 신호";
  const [selectedTradeItem, setSelectedTradeItem] = useState<TradeItem | null>(null);

  useEffect(() => {
    if (refreshRevision === 0) {
      return;
    }
    void Promise.all([refetchTimingItems(), refetchDailyRisk()]);
  }, [refetchDailyRisk, refetchTimingItems, refreshRevision]);

  // console.log("아이템스", items)

  const buySummaryTargetItems = useMemo(
    () => items.filter((item) => item.buyState === 1 || item.buyState === 3),
    [items],
  );
  const shortSummaryTargetItems = useMemo(
    () => items.filter((item) => item.buyState === 11 || item.buyState === 13),
    [items],
  );
  const filteredItems = useMemo(
    () => filterTradeItems(items, tradeTypeFilter),
    [items, tradeTypeFilter],
  );
  const buySignalCount = useMemo(
    () => items.filter((item) => item.buyState === 1 || item.buyState === 2).length,
    [items],
  );
  const sellSignalCount = useMemo(
    () => items.filter((item) => item.buyState === 3).length,
    [items],
  );
  const shortSignalCount = useMemo(
    () => items.filter((item) => item.buyState === 11 || item.buyState === 12).length,
    [items],
  );
  const coverSignalCount = useMemo(
    () => items.filter((item) => item.buyState === 13).length,
    [items],
  );
  const buyTradeResultCounts = useMemo(
    () =>
      items.reduce(
        (counts, item) => {
          if (item.buyState !== 2) {
            return counts;
          }

          counts.completed += 1;
          if (item.profit > 0) {
            counts.success += 1;
          } else if (item.profit < 0) {
            counts.failure += 1;
          } else {
            counts.flat += 1;
          }
          return counts;
        },
        { completed: 0, success: 0, failure: 0, flat: 0 },
      ),
    [items],
  );
  const shortTradeResultCounts = useMemo(
    () =>
      items.reduce(
        (counts, item) => {
          if (item.buyState !== 12) {
            return counts;
          }

          counts.completed += 1;
          if (item.profit > 0) {
            counts.success += 1;
          } else if (item.profit < 0) {
            counts.failure += 1;
          } else {
            counts.flat += 1;
          }
          return counts;
        },
        { completed: 0, success: 0, failure: 0, flat: 0 },
      ),
    [items],
  );
  const totalBuyProfit = useMemo(
    () => buySummaryTargetItems.reduce((sum, item) => sum + item.profit, 0),
    [buySummaryTargetItems],
  );
  const totalShortProfit = useMemo(
    () => shortSummaryTargetItems.reduce((sum, item) => sum + item.profit, 0),
    [shortSummaryTargetItems],
  );
  const totalBuyHoldingDays = useMemo(
    () => buySummaryTargetItems.reduce((sum, item) => sum + item.holdingDays, 0),
    [buySummaryTargetItems],
  );
  const totalShortHoldingDays = useMemo(
    () => shortSummaryTargetItems.reduce((sum, item) => sum + item.holdingDays, 0),
    [shortSummaryTargetItems],
  );
  const { totalProfit, totalHoldingDays, annualizedProfit } = getFilteredTradeSummary(
    tradeTypeFilter,
    { totalProfit: totalBuyProfit, totalHoldingDays: totalBuyHoldingDays },
    { totalProfit: totalShortProfit, totalHoldingDays: totalShortHoldingDays },
  );
  const tradeSummaryLabel = tradeTypeFilter === "buy" ? "매수/매도" : tradeTypeFilter === "short" ? "대주매도/청산" : "전체";
  const annualizedBuyProfit = useMemo(() => {
    if (totalBuyHoldingDays <= 0) {
      return null;
    }

    return totalBuyProfit / (totalBuyHoldingDays / 365);
  }, [totalBuyHoldingDays, totalBuyProfit]);
  const annualizedShortProfit = useMemo(() => {
    if (totalShortHoldingDays <= 0) {
      return null;
    }

    return totalShortProfit / (totalShortHoldingDays / 365);
  }, [totalShortHoldingDays, totalShortProfit]);
  const rangeSummaryLabel = useMemo(
    () => getRangeSummaryLabel(startDate, endDate, today),
    [endDate, startDate, today]
  );
  const periodLabel = useMemo(
    () => `${rangeSummaryLabel} (${tradeSummaryLabel}) :`,
    [rangeSummaryLabel, tradeSummaryLabel]
  );

  const totalSummaryDetailItems = useMemo(
    () => [
      {
        label: "기간",
        value: rangeSummaryLabel,
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
        label: "총 수익률 합",
        value: `${totalProfit > 0 ? "+" : ""}${totalProfit.toFixed(2)}%`,
      },
      {
        label: "총 환산 연수익률",
        value:
          annualizedProfit == null
            ? "-"
            : `${annualizedProfit > 0 ? "+" : ""}${annualizedProfit.toFixed(2)}% (${totalProfit > 0 ? "+" : ""}${totalProfit.toFixed(2)} ÷ ${totalHoldingDays.toLocaleString()} × 365)`,
      },
      {
        label: "총 보유기간",
        value: `${totalHoldingDays.toLocaleString()}일`,
      },
      {
        label: "코스피 변동률",
        value:
          summary?.kospiBenefit == null
            ? "-"
            : `${Number(summary.kospiBenefit) > 0 ? "+" : ""}${Number(summary.kospiBenefit).toFixed(2)}% (${summary.startDateKospiValue ?? "-"} → ${summary.endDateKospiValue ?? "-"})`,
      },
    ],
    [annualizedProfit, endDate, rangeSummaryLabel, startDate, summary, totalHoldingDays, totalProfit],
  );
  const buySummaryDetailItems = useMemo(
    () => [
      {
        label: "매수 수익률 합",
        value: `${totalBuyProfit > 0 ? "+" : ""}${totalBuyProfit.toFixed(2)}%`,
      },
      {
        label: "매수 환산 연수익률",
        value:
          annualizedBuyProfit == null
            ? "-"
            : `${annualizedBuyProfit > 0 ? "+" : ""}${annualizedBuyProfit.toFixed(2)}% (${totalBuyProfit > 0 ? "+" : ""}${totalBuyProfit.toFixed(2)} ÷ ${totalBuyHoldingDays.toLocaleString()} × 365)`,
      },
      {
        label: "매수/매도 신호",
        value: `매수 신호 ${buySignalCount.toLocaleString()}건, 매도 신호 ${sellSignalCount.toLocaleString()}건`,
      },
      {
        label: "매수 완료 거래 결과",
        value: `완료 ${buyTradeResultCounts.completed.toLocaleString()}건, 성공 ${buyTradeResultCounts.success.toLocaleString()}건, 실패 ${buyTradeResultCounts.failure.toLocaleString()}건, 보합 ${buyTradeResultCounts.flat.toLocaleString()}건`,
      },
      {
        label: "총 매수 보유기간",
        value: `${totalBuyHoldingDays.toLocaleString()}일`,
      },
    ],
    [annualizedBuyProfit, buySignalCount, buyTradeResultCounts, sellSignalCount, totalBuyHoldingDays, totalBuyProfit],
  );
  const shortSummaryDetailItems = useMemo(
    () => [
      {
        label: "대주매도 수익률 합",
        value: `${totalShortProfit > 0 ? "+" : ""}${totalShortProfit.toFixed(2)}%`,
      },
      {
        label: "대주매도 환산 연수익률",
        value:
          annualizedShortProfit == null
            ? "-"
            : `${annualizedShortProfit > 0 ? "+" : ""}${annualizedShortProfit.toFixed(2)}% (${totalShortProfit > 0 ? "+" : ""}${totalShortProfit.toFixed(2)} ÷ ${totalShortHoldingDays.toLocaleString()} × 365)`,
      },
      {
        label: "대주매도/청산 신호",
        value: `대주매도 신호 ${shortSignalCount.toLocaleString()}건, 청산 신호 ${coverSignalCount.toLocaleString()}건`,
      },
      {
        label: "대주매도 완료 거래 결과",
        value: `완료 ${shortTradeResultCounts.completed.toLocaleString()}건, 성공 ${shortTradeResultCounts.success.toLocaleString()}건, 실패 ${shortTradeResultCounts.failure.toLocaleString()}건, 보합 ${shortTradeResultCounts.flat.toLocaleString()}건`,
      },
      {
        label: "총 대주매도 보유기간",
        value: `${totalShortHoldingDays.toLocaleString()}일`,
      },
    ],
    [annualizedShortProfit, coverSignalCount, shortSignalCount, shortTradeResultCounts, totalShortHoldingDays, totalShortProfit],
  );

  return (
    <div className="pb-10 sm:pb-12">
      <DateRangeFilter
        startDate={startDate}
        endDate={endDate}
        minDate={MIN_TIMING_DATE}
        maxDate={today}
        onChangeRange={(nextStartDate, nextEndDate) =>
          setRange({ startDate: nextStartDate, endDate: nextEndDate })
        }
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
        <div className="space-y-4">
          <div>
            <div className="mb-3 px-1 text-sm font-semibold text-gray-800">{tradeSummaryLabel} 요약</div>
            <CommonDetailGrid items={totalSummaryDetailItems} />
          </div>
          {tradeTypeFilter !== "short" && <div className="border-t border-gray-100 pt-4">
            <div className="mb-3 px-1 text-sm font-semibold text-gray-800">매수 요약</div>
            <CommonDetailGrid items={buySummaryDetailItems} />
          </div>}
          {tradeTypeFilter !== "buy" && <div className="border-t border-gray-100 pt-4">
            <div className="mb-3 px-1 text-sm font-semibold text-gray-800">대주매도 요약</div>
            <CommonDetailGrid items={shortSummaryDetailItems} />
          </div>}
        </div>
      </CommonModal>
      <CommonModal
        open={isRiskHistoryModalOpen}
        title="위험도"
        hideCancelButton
        onConfirm={() => setIsRiskHistoryModalOpen(false)}
        onCancel={() => setIsRiskHistoryModalOpen(false)}
        panelClassName="max-w-2xl min-w-[50vw]"
        contentClassName="max-h-[60dvh] overflow-y-auto px-4 py-4 sm:px-6"
      >
        <RiskDailyList
          items={dailyRiskQuery.data ?? []}
          isLoading={dailyRiskQuery.isLoading}
          isError={dailyRiskQuery.isError}
        />
      </CommonModal>
      <div className="mb-3 ml-1 flex flex-wrap items-center gap-2 text-sm font-semibold text-gray-700 sm:ml-2">
        <span>총 {filteredItems.length.toLocaleString()}개</span>
        <button
          type="button"
          onClick={() => setIsRiskHistoryModalOpen(true)}
          className={`inline-flex cursor-pointer items-center rounded-full border px-3 py-1 text-xs font-semibold transition hover:opacity-85 ${riskButtonStyle.className}`}
        >
          {riskButtonLabel}
        </button>
      </div>
      <TradeList
        key={`${startDate}-${endDate}-${tradeTypeFilter}`}
        items={filteredItems}
        groupByDate
        tradeTypeFilter={tradeTypeFilter}
        onItemClick={setSelectedTradeItem}
      />
      <TradeDetailModal
        open={selectedTradeItem != null}
        item={selectedTradeItem}
        onClose={() => setSelectedTradeItem(null)}
      />
    </div>
  );
}
