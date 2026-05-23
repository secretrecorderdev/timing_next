"use client";

import { useMemo, useState } from "react";
import { TradeList } from "@/shared/ui/components/trade/TradeList";
import { TradeDetailModal } from "@/shared/ui/components/trade/TradeDetailModal";
import type { TradeItem } from "@/shared/ui/components/trade/trade.types";
import { DateRangeFilter } from "@/shared/ui/components/date-range/DateRangeFilter";
import { PeriodSummaryCard } from "@/shared/ui/components/summary/PeriodSummaryCard";
import CommonModal from "@/shared/ui/components/common/CommonModal";
import CommonDetailGrid from "@/shared/ui/components/common/CommonDetailGrid";
import { formatDateInputValue, getRangeSummaryLabel, MIN_TIMING_DATE, toRangeByPreset } from "@/shared/lib/dateRange";
import { useTimingTradeItems } from "@/domain/timing/hooks/useTimingTradeItems";
import { useLatestRisk } from "@/domain/risk/hooks/useLatestRisk";
import { usePeriodRisk } from "@/domain/risk/hooks/usePeriodRisk";
import { formatRiskDate, getRiskLevelBadgeClass, getRiskLevelLabel, RiskLevelKrMap } from "@/domain/risk/types/risk";

export default function TimingPageClient({ today }: { today: string }) {
  const [range, setRange] = useState(() => toRangeByPreset("3m", today));
  const { startDate, endDate } = range;
  const { items, rawItems, summary } = useTimingTradeItems({ startDate, endDate, limit: 500, offset: 0 });
  const latestRiskQuery = useLatestRisk();
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isRiskHistoryModalOpen, setIsRiskHistoryModalOpen] = useState(false);
  const periodRiskQuery = usePeriodRisk(startDate, endDate, isRiskHistoryModalOpen);
  const [selectedTradeItem, setSelectedTradeItem] = useState<TradeItem | null>(null);

  const summaryTargetItems = useMemo(
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
  const totalProfit = useMemo(
    () => summaryTargetItems.reduce((sum, item) => sum + item.profit, 0),
    [summaryTargetItems],
  );
  const totalHoldingDays = useMemo(
    () => summaryTargetItems.reduce((sum, item) => sum + item.holdingDays, 0),
    [summaryTargetItems],
  );
  const annualizedProfit = useMemo(() => {
    if (totalHoldingDays <= 0) {
      return null;
    }

    return totalProfit / (totalHoldingDays / 365);
  }, [totalHoldingDays, totalProfit]);
  const rangeSummaryLabel = useMemo(
    () => getRangeSummaryLabel(startDate, endDate, today),
    [endDate, startDate, today]
  );
  const periodLabel = useMemo(
    () => `${rangeSummaryLabel} :`,
    [rangeSummaryLabel]
  );
  const currentRiskLabel = useMemo(
    () => getRiskLevelLabel(latestRiskQuery.data),
    [latestRiskQuery.data],
  );
  const currentRiskBadgeClass = useMemo(
    () => getRiskLevelBadgeClass(latestRiskQuery.data?.riskLevel),
    [latestRiskQuery.data?.riskLevel],
  );
  const riskHistoryItems = useMemo(() => {
    // 여기서 리스크를 전날로 계산함, 2026-05-23, jangkh
    const historyItems = (periodRiskQuery.data ?? []).map((risk) => ({
      id: String(risk.id),
      targetDateTime: formatRiskDate(risk.targetDateTime),
      riskLabel:
        risk.prevRiskLevel != null
          ? (RiskLevelKrMap[risk.prevRiskLevel] ?? risk.prevRiskLevelKr ?? "-")
          : (risk.prevRiskLevelKr ?? "-"),
      riskLevel: risk.prevRiskLevel ?? null,
    }));

    if (!currentRiskLabel) {
      return historyItems;
    }

    return [
      {
        id: "current",
        targetDateTime: "현재",
        riskLabel: currentRiskLabel,
        riskLevel: latestRiskQuery.data?.riskLevel ?? null,
      },
      ...historyItems,
    ];
  }, [currentRiskLabel, latestRiskQuery.data?.riskLevel, periodRiskQuery.data]);
  const riskTradeSummaryItems = useMemo(() => {
    const summaryMap = new Map<string, { count: number; totalProfit: number; totalHoldingDays: number }>();
    const riskLabelOrder = new Map<string, number>([
      ["양호", 0],
      ["주의", 1],
      ["위험", 2],
      ["위기", 3],
      ["관망", 4],
      ["미분류", 5],
    ]);

    items
      .filter((item) => item.buyState === 1 || item.buyState === 2)
      .forEach((item) => {
        const label = item.buyRiskLevelKr ?? "미분류";
        const current = summaryMap.get(label) ?? { count: 0, totalProfit: 0, totalHoldingDays: 0 };

        summaryMap.set(label, {
          count: current.count + 1,
          totalProfit: current.totalProfit + item.profit,
          totalHoldingDays: current.totalHoldingDays + item.holdingDays,
        });
      });

    return Array.from(summaryMap.entries())
      .map(([label, value]) => ({
        label,
        ...value,
        annualizedProfit:
          value.totalHoldingDays > 0
            ? value.totalProfit / (value.totalHoldingDays / 365)
            : null,
      }))
      .sort((a, b) => (riskLabelOrder.get(a.label) ?? 999) - (riskLabelOrder.get(b.label) ?? 999));
  }, [items]);
  const summaryDetailItems = useMemo(
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
        label: "매수/매도 신호",
        value: `매수 신호 ${buySignalCount.toLocaleString()}건, 매도 신호 ${sellSignalCount.toLocaleString()}건`,
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
    [annualizedProfit, buySignalCount, rangeSummaryLabel, sellSignalCount, summary, totalHoldingDays, totalProfit],
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
        <CommonDetailGrid items={summaryDetailItems} />
      </CommonModal>
      <CommonModal
        open={isRiskHistoryModalOpen}
        title={`${rangeSummaryLabel} 위험도`}
        hideCancelButton
        onConfirm={() => setIsRiskHistoryModalOpen(false)}
        onCancel={() => setIsRiskHistoryModalOpen(false)}
        panelClassName="max-w-2xl min-w-[50vw]"
        contentClassName="max-h-[60dvh] overflow-y-auto px-4 py-4 sm:px-6"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="px-1 text-sm font-semibold text-gray-800">각 위험도 별 매수 통계</div>
            {riskTradeSummaryItems.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 px-4 py-4 text-sm text-gray-500">
                표시할 위험도별 매수가 없습니다.
              </div>
            ) : (
              riskTradeSummaryItems.map((item) => (
                <div
                  key={item.label}
                  className={`rounded-xl border px-4 py-3 ${getRiskLevelBadgeClass(
                    Object.entries(RiskLevelKrMap).find(([, label]) => label === item.label)?.[0]
                      ? Number(Object.entries(RiskLevelKrMap).find(([, label]) => label === item.label)?.[0])
                      : null,
                  )}`}
                >
                  <div className="text-sm font-semibold text-gray-900">{item.label}</div>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600 sm:text-sm">
                    <span>매수 {item.count.toLocaleString()}건</span>
                    <span>· 수익률 합 {item.totalProfit > 0 ? "+" : ""}{item.totalProfit.toFixed(2)}%</span>
                    <span>· 보유 기간 {item.totalHoldingDays.toLocaleString()}일</span>
                    <span>· 환산 연수익률 {item.annualizedProfit == null ? "-" : `${item.annualizedProfit > 0 ? "+" : ""}${item.annualizedProfit.toFixed(2)}%`}</span>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="space-y-2 border-t border-gray-100 pt-4">
            {periodRiskQuery.isLoading ? (
              <div className="py-6 text-center text-sm text-gray-500">불러오는 중...</div>
            ) : riskHistoryItems.length === 0 ? (
              <div className="py-6 text-center text-sm text-gray-500">표시할 위험도 이력이 없습니다.</div>
            ) : (
              riskHistoryItems.map((risk) => (
                risk.riskLevel == 0 ? <></>
                :
                <div
                  key={risk.id}
                  className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
                >
                  <span className="text-sm font-medium text-gray-700">{risk.targetDateTime}</span>
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getRiskLevelBadgeClass(risk.riskLevel)}`}
                  >
                    {risk.riskLabel}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </CommonModal>
      <div className="mb-3 ml-1 flex flex-wrap items-center gap-2 text-sm font-semibold text-gray-700 sm:ml-2">
        <span>총 {items.length.toLocaleString()}개</span>
        {currentRiskLabel ? (
          <button
            type="button"
            onClick={() => setIsRiskHistoryModalOpen(true)}
            className={`inline-flex cursor-pointer items-center rounded-full border px-3 py-1 text-xs font-semibold transition hover:opacity-85 ${currentRiskBadgeClass}`}
          >
            위험도 : {currentRiskLabel}
          </button>
        ) : null}
      </div>
      <TradeList items={items} onItemClick={setSelectedTradeItem} />
      <TradeDetailModal
        open={selectedTradeItem != null}
        item={selectedTradeItem}
        onClose={() => setSelectedTradeItem(null)}
      />
    </div>
  );
}
