"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useItemTimingTradeItems } from "@/domain/item/hooks/useItemTimingTradeItems";
import { TradeActionButtons } from "@/shared/ui/components/trade/TradeActionButtons";
import { TradeDetailModal } from "@/shared/ui/components/trade/TradeDetailModal";
import { TradeList } from "@/shared/ui/components/trade/TradeList";
import { Card } from "@/shared/ui/primitives/card/Card";
import { useKospiStockItems } from "@/domain/item/hooks/useKospiStockItems";
import { useDailyCloseChart } from "@/domain/item/hooks/useDailyCloseChart";
import type { ChartSignalMarker } from "@/domain/item/types/chart";
import type { KospiStockItem } from "@/domain/item/types/item";
import type { TradeItem } from "@/shared/ui/components/trade/trade.types";
import { StockDailyCloseChartCard } from "@/shared/ui/components/chart/StockDailyCloseChartCard";
import CommonDetailGrid from "@/shared/ui/components/common/CommonDetailGrid";
import CommonModal from "@/shared/ui/components/common/CommonModal";
import { DateRangeFilter } from "@/shared/ui/components/date-range/DateRangeFilter";
import { PeriodSummaryCard } from "@/shared/ui/components/summary/PeriodSummaryCard";
import { formatDateInputValue, getRangeSummaryLabel, MIN_TIMING_DATE, toRangeByPreset } from "@/shared/lib/dateRange";

function StockListCard({
  item,
  selected,
  onSelect,
}: {
  item: KospiStockItem;
  selected: boolean;
  onSelect: (item: KospiStockItem) => void;
}) {
  return (
    <Card
      className={`cursor-pointer rounded-3xl border px-5 py-4 shadow-sm transition duration-200 ${
        selected
          ? "border-primary bg-primary/5"
          : "border-gray-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:shadow-md"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => onSelect(item)}
          className="min-w-0 flex-1 cursor-pointer text-left"
        >
          <div className="text-lg font-semibold text-gray-900">{item.baseName}</div>
          <div className="mt-1 text-sm font-medium text-gray-500">[{item.code}]</div>
        </button>
        <TradeActionButtons code={item.code} className="grid shrink-0 grid-cols-2 justify-items-center gap-2 sm:flex sm:justify-end sm:gap-3" />
      </div>
    </Card>
  );
}

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

function SelectedStockTradeList({ stock, today }: { stock: KospiStockItem; today: string }) {
  const codes = useMemo(() => [stock.code], [stock.code]);
  const defaultRange = useMemo(() => toRangeByPreset("1y", today), [today]);
  const [chartRange, setChartRange] = useState(defaultRange);
  const { items, rawItems, summary } = useItemTimingTradeItems({
    codes,
    startDate: chartRange.startDate,
    endDate: chartRange.endDate,
    limit: 500,
    offset: 0,
  });
  const { items: chartItems, isLoading: isChartLoading, error: chartError } = useDailyCloseChart(
    stock.code,
    chartRange.startDate,
    chartRange.endDate
  );
  const [selectedTradeItem, setSelectedTradeItem] = useState<TradeItem | null>(null);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

  const chartPriceByDate = useMemo(() => {
    return new Map(chartItems.map((item) => [toMarkerDate(String(item.date)) ?? "", item.price]));
  }, [chartItems]);

  const chartMarkers = useMemo<ChartSignalMarker[]>(() => {
    const markers: ChartSignalMarker[] = [];

    rawItems.forEach((item) => {
      const buyState = Number(item.buyState ?? 0);
      const buyDate = toMarkerDate(item.buyDate ?? item.timingDate ?? item.regDate);
      const sellDate = toMarkerDate(item.sellDate ?? item.priceDate);
      const buyPriceOnChart = buyDate ? chartPriceByDate.get(buyDate) : undefined;
      const sellPriceOnChart = sellDate ? chartPriceByDate.get(sellDate) : undefined;

      if ((buyState === 1 || buyState === 2) && buyDate && buyPriceOnChart != null) {
        markers.push({
          id: `buy-${item.id}-${buyDate}`,
          time: buyDate,
          position: "belowBar",
          shape: "arrowUp",
          color: "#ef4444",
          text: "매수",
        });
      }

      if ((buyState === 2 || buyState === 3) && sellDate && sellPriceOnChart != null) {
        markers.push({
          id: `sell-${item.id}-${sellDate}`,
          time: sellDate,
          position: "aboveBar",
          shape: "arrowDown",
          color: "#2563eb",
          text: "매도",
        });
      }
    });

    return markers;
  }, [chartPriceByDate, rawItems]);

  const totalProfit =
    summary?.sumBenefit != null
      ? Number(summary.sumBenefit)
      : items.reduce((sum, item) => sum + item.profit, 0);
  const totalHoldingDays =
    summary?.sumPeriod != null
      ? Number(summary.sumPeriod)
      : rawItems.reduce((sum, item) => sum + (item.period ?? 0), 0);
  const annualizedProfit =
    summary?.annualizedBenefit != null
      ? Number(summary.annualizedBenefit)
      : totalHoldingDays > 0
        ? totalProfit / (totalHoldingDays / 365)
        : undefined;
  const periodLabel = `${getRangeSummaryLabel(chartRange.startDate, chartRange.endDate, today)} :`;
  const summaryDetailItems = [
    {
      label: "기간",
      value: getRangeSummaryLabel(chartRange.startDate, chartRange.endDate, today),
    },
    {
      label: "시작일",
      value: formatDateInputValue(chartRange.startDate),
    },
    {
      label: "종료일",
      value: formatDateInputValue(chartRange.endDate),
    },
    {
      label: "수익률 합",
      value: `${totalProfit > 0 ? "+" : ""}${totalProfit.toFixed(2)}%`,
    },
    {
      label: "환산 연수익률",
      value: annualizedProfit == null ? "-" : `${annualizedProfit > 0 ? "+" : ""}${annualizedProfit.toFixed(2)}%`,
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
      <StockDailyCloseChartCard
        title={stock.baseName}
        code={stock.code}
        data={chartItems}
        markers={chartMarkers}
        isLoading={isChartLoading}
        error={chartError}
      />
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
      <TradeDetailModal
        open={selectedTradeItem != null}
        item={selectedTradeItem}
        onClose={() => setSelectedTradeItem(null)}
      />
    </div>
  );
}

export default function ItemPageClient({ today }: { today: string }) {
  const router = useRouter();
  const pathname = usePathname() ?? "/ko/item";
  const searchParams = useSearchParams();
  const { items, totalCount, search, setSearch, isLoading, error } = useKospiStockItems();
  const [selectedStock, setSelectedStock] = useState<KospiStockItem | null>(null);
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [resolvedHeight, setResolvedHeight] = useState<number>(520);
  const selectedCode = searchParams.get("code")?.trim() ?? "";

  const responsiveEstimateSize = isMobile ? 104 : 92;
  const responsiveGap = isMobile ? 8 : 4;

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => responsiveEstimateSize,
    overscan: 8,
    gap: responsiveGap,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const bottomSpacing = isMobile ? 40 : 32;
  const totalSize = rowVirtualizer.getTotalSize() + bottomSpacing;
  const listTopPadding = 4;

  useEffect(() => {
    const updateIsMobile = () => {
      const nextIsMobile = window.innerWidth < 640;
      setIsMobile(nextIsMobile);

      requestAnimationFrame(() => {
        rowVirtualizer.measure();
      });
    };

    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);

    return () => window.removeEventListener("resize", updateIsMobile);
  }, [rowVirtualizer]);

  useEffect(() => {
    rowVirtualizer.measure();
  }, [isMobile, items.length, rowVirtualizer]);

  useEffect(() => {
    const updateHeight = () => {
      const element = parentRef.current;

      if (!element) {
        return;
      }

      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const bottomSafeArea = isMobile ? 8 : 10;
      const minHeight = isMobile ? 420 : 520;
      const nextHeight = Math.max(minHeight, Math.floor(viewportHeight - rect.top - bottomSafeArea));

      setResolvedHeight(nextHeight);

      requestAnimationFrame(() => {
        rowVirtualizer.measure();
      });
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, [isMobile, rowVirtualizer]);

  useEffect(() => {
    if (!selectedCode || items.length === 0) {
      return;
    }

    const matchedStock = items.find((item) => item.code === selectedCode);

    if (matchedStock && matchedStock.code !== selectedStock?.code) {
      setSelectedStock(matchedStock);
    }
  }, [items, selectedCode, selectedStock?.code]);

  const handleSelectStock = (item: KospiStockItem) => {
    setSelectedStock(item);
    router.replace(`${pathname}?code=${item.code}`, { scroll: false });
  };

  const handleBackToList = () => {
    setSelectedStock(null);
    router.replace(pathname, { scroll: false });
  };

  const renderedItems = useMemo(
    () =>
      virtualItems.map((virtualRow) => ({
        key: `${items[virtualRow.index]?.code}-${items[virtualRow.index]?.id}`,
        item: items[virtualRow.index],
        start: virtualRow.start + listTopPadding,
        index: virtualRow.index,
      })),
    [items, listTopPadding, virtualItems]
  );

  if (selectedStock) {
    return (
      <div className="pb-4">
        <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="text-lg font-semibold text-gray-900">{selectedStock.baseName}</div>
            <div className="mt-1 text-sm font-medium text-gray-500">[{selectedStock.code}]</div>
          </div>
          <button
            type="button"
            onClick={handleBackToList}
            className="cursor-pointer rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-primary hover:text-primary"
          >
            다른 종목 검색
          </button>
        </div>
        <SelectedStockTradeList stock={selectedStock} today={today} />
      </div>
    );
  }

  return (
    <div className="pb-4">
      <div className="mb-4 pt-4">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="종목명 또는 코드 검색"
          className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-base outline-none transition focus:border-primary"
        />
      </div>

      <div className="mb-3 ml-1 text-sm font-semibold text-gray-700 sm:ml-2">
        총 {totalCount.toLocaleString()}개 / 검색 {items.length.toLocaleString()}개
      </div>

      {isLoading ? (
        <Card className="text-center text-gray-500">개별 주식 목록을 불러오는 중입니다.</Card>
      ) : error ? (
        <Card className="text-center text-red-500">{error}</Card>
      ) : items.length === 0 ? (
        <Card className="text-center text-gray-500">검색 결과가 없습니다.</Card>
      ) : (
        <div
          ref={parentRef}
          className="mt-4 w-full overflow-y-auto rounded-2xl pb-1"
          style={{ height: resolvedHeight }}
        >
          <div className="relative w-full" style={{ height: totalSize + listTopPadding }}>
            {renderedItems.map(({ key, item, start, index }) => (
              <div
                key={key}
                data-index={index}
                ref={rowVirtualizer.measureElement}
                className="absolute left-0 top-0 w-full"
                style={{
                  transform: `translateY(${start}px)`,
                }}
              >
                <StockListCard
                  item={item}
                  selected={false}
                  onSelect={handleSelectStock}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
