"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { TradeCard } from "./TradeCard";
import { TradeDateHeader } from "./TradeDateHeader";
import { createTradeListRows } from "@/shared/lib/tradeDateGroup";
import type { TradeTypeFilter } from "@/shared/store/useTradeViewStore";
import type { TradeItem } from "./trade.types";

interface TradeListProps {
  items: TradeItem[];
  height?: number | string;
  estimateSize?: number;
  overscan?: number;
  onItemClick?: (item: TradeItem) => void;
  groupByDate?: boolean;
  tradeTypeFilter?: TradeTypeFilter;
}

export function TradeList({
  items,
  height,
  estimateSize = 124,
  overscan = 8,
  onItemClick,
  groupByDate = false,
  tradeTypeFilter = "all",
}: TradeListProps) {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [resolvedHeight, setResolvedHeight] = useState<number>(520);

  const responsiveEstimateSize = isMobile ? 152 : estimateSize;
  const responsiveGap = isMobile ? 8 : 4;
  const rows = useMemo(() => createTradeListRows(items, groupByDate), [items, groupByDate]);
  const getItemKey = useCallback((index: number) => rows[index].key, [rows]);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getItemKey,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => rows[index].type === "header" ? (isMobile ? 100 : 92) : responsiveEstimateSize,
    overscan,
    gap: responsiveGap,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const bottomSpacing = isMobile ? 40 : 32;
  const totalSize = rowVirtualizer.getTotalSize() + bottomSpacing;

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
  }, [isMobile, rows.length, tradeTypeFilter, rowVirtualizer]);

  useEffect(() => {
    if (height != null) {
      return;
    }

    const updateHeight = () => {
      const element = parentRef.current;

      if (!element) {
        return;
      }

      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const bottomSafeArea = isMobile ? 8 : 10;
      const minHeight = isMobile ? 420 : 640;
      const nextHeight = Math.max(minHeight, Math.floor(viewportHeight - rect.top - bottomSafeArea)) + 120;

      setResolvedHeight(nextHeight);

      requestAnimationFrame(() => {
        rowVirtualizer.measure();
      });
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, [height, isMobile, rowVirtualizer]);

  const renderedItems = useMemo(
    () =>
      virtualItems.map((virtualRow) => ({
        key: virtualRow.key,
        row: rows[virtualRow.index],
        start: virtualRow.start,
        size: virtualRow.size,
        index: virtualRow.index,
      })),
    [rows, virtualItems]
  );

  if (items.length === 0) {
    return <div className="py-8 text-center text-gray-500">표시할 데이터가 없습니다.</div>;
  }

  return (
    <div
      ref={parentRef}
      className="w-full overflow-y-auto rounded-2xl pb-1"
      style={{ height: height ?? resolvedHeight }}
    >
      <div
        className="relative w-full"
        style={{ height: totalSize }}
      >
        {renderedItems.map(({ key, row, start, index }) => (
          <div
            key={key}
            data-index={index}
            ref={rowVirtualizer.measureElement}
            className="absolute left-0 top-0 w-full"
            style={{
              transform: `translateY(${start}px)`,
            }}
          >
            {row.type === "header" ? (
              <TradeDateHeader group={row.group} tradeTypeFilter={tradeTypeFilter} />
            ) : (
              <TradeCard item={row.item} onClick={onItemClick} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
