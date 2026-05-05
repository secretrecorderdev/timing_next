"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import StockDetailPageClient from "@/domain/detail/StockDetailPageClient";
import { fetchKospiStockList } from "@/domain/items/api/itemsApi";
import type { KospiStockItem } from "@/domain/items/types/item";
import { Card } from "@/shared/ui/primitives/card/Card";

export default function DetailPageClient({ code, today }: { code: string; today: string }) {
  const router = useRouter();
  const pathname = usePathname() ?? `/ko/item/${code}`;
  const listPath = useMemo(() => pathname.replace(/\/[^/]+$/, ""), [pathname]);
  const [stock, setStock] = useState<KospiStockItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const items = await fetchKospiStockList();
        if (cancelled) {
          return;
        }

        const matched = items.find((item) => item.code === code) ?? null;
        if (!matched) {
          setStock(null);
          setError("해당 종목을 찾을 수 없습니다.");
          return;
        }

        setStock(matched);
      } catch (loadError) {
        console.error("Failed to load stock detail page", loadError);
        if (!cancelled) {
          setStock(null);
          setError("종목 정보를 불러오지 못했습니다.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [code]);

  if (isLoading) {
    return <Card className="mt-4 text-center text-gray-500">종목 정보를 불러오는 중입니다.</Card>;
  }

  if (error || !stock) {
    return <Card className="mt-4 text-center text-red-500">{error ?? "해당 종목을 찾을 수 없습니다."}</Card>;
  }

  return (
    <div className="pb-4">
      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="text-lg font-semibold text-gray-900">{stock.baseName}</div>
          <div className="mt-1 text-sm font-medium text-gray-500">[{stock.code}]</div>
        </div>
        <button
          type="button"
          onClick={() => router.push(listPath)}
          className="cursor-pointer rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-primary hover:text-primary"
        >
          다른 종목 검색
        </button>
      </div>
      <StockDetailPageClient stock={stock} today={today} />
    </div>
  );
}
