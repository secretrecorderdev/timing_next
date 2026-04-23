"use client";

import { useMemo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { TradeCard } from "./TradeCard";
import type { TradeItem } from "./trade.types";

interface TradeListProps {
  items: TradeItem[];
  height?: number;
  estimateSize?: number;
  overscan?: number;
}

export function TradeList({
  items,
  height = 720,
  estimateSize = 124,
  overscan = 8,
}: TradeListProps) {
  const parentRef = useRef<HTMLDivElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
    gap: 16,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  const renderedItems = useMemo(
    () =>
      virtualItems.map((virtualRow) => ({
        key: `${items[virtualRow.index]?.code}-${items[virtualRow.index]?.buyDateTime}-${virtualRow.index}`,
        item: items[virtualRow.index],
        start: virtualRow.start,
        size: virtualRow.size,
        index: virtualRow.index,
      })),
    [items, virtualItems]
  );

  if (items.length === 0) {
    return <div className="py-8 text-center text-gray-500">표시할 데이터가 없습니다.</div>;
  }

  return (
    <div
      ref={parentRef}
      className="w-full overflow-y-auto rounded-2xl"
      style={{ height }}
    >
      <div
        className="relative w-full"
        style={{ height: totalSize }}
      >
        {renderedItems.map(({ key, item, start, size }) => (
          <div
            key={key}
            className="absolute left-0 top-0 w-full"
            style={{
              height: size,
              transform: `translateY(${start}px)`,
            }}
          >
            <TradeCard
              item={item}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
