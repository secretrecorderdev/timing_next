"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useKospiStockItems } from "@/domain/items/hooks/useKospiStockItems";
import type { KospiStockItem } from "@/domain/items/types/item";
import { TradeActionButtons } from "@/shared/ui/components/trade/TradeActionButtons";
import { Card } from "@/shared/ui/primitives/card/Card";

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

export default function ItemsPageClient() {
  const router = useRouter();
  const pathname = usePathname() ?? "/ko/item";
  const { items, totalCount, search, setSearch, isLoading, error } = useKospiStockItems();
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [resolvedHeight, setResolvedHeight] = useState<number>(520);

  const responsiveEstimateSize = isMobile ? 96 : 84;
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

  const handleSelectStock = (item: KospiStockItem) => {
    router.push(`${pathname}/${item.code}`);
  };

  const renderedItems = useMemo(
    () =>
      virtualItems.map((virtualRow) => ({
        key: `${items[virtualRow.index]?.code}-${items[virtualRow.index]?.id}`,
        item: items[virtualRow.index],
        start: virtualRow.start + listTopPadding,
        index: virtualRow.index,
      })),
    [items, listTopPadding, virtualItems],
  );

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
                className="absolute left-0 top-0 w-full"
                style={{ transform: `translateY(${start}px)` }}
              >
                <StockListCard item={item} selected={false} onSelect={handleSelectStock} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
