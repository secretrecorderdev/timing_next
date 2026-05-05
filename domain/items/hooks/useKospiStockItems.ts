"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { fetchKospiStockList } from "@/domain/items/api/itemsApi";
import type { KospiStockItem } from "@/domain/items/types/item";

export function useKospiStockItems() {
  const [items, setItems] = useState<KospiStockItem[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchKospiStockList();
        if (!cancelled) {
          setItems(result);
        }
      } catch {
        if (!cancelled) {
          setError("개별 주식 목록을 불러오지 못했습니다");
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
  }, []);

  const filteredItems = useMemo(() => {
    const keyword = deferredSearch.trim().toLowerCase();
    if (!keyword) {
      return items;
    }

    return items.filter((item) => {
      const baseName = item.baseName?.toLowerCase() ?? "";
      const code = item.code?.toLowerCase() ?? "";
      return baseName.includes(keyword) || code.includes(keyword);
    });
  }, [deferredSearch, items]);

  return {
    items: filteredItems,
    totalCount: items.length,
    search,
    setSearch,
    isLoading,
    error,
  };
}
