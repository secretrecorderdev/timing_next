"use client";

import { useEffect, useState } from "react";
import { fetchDailyCloseChart } from "@/domain/item/api/chartApi";
import type { DailyCloseChartItem } from "@/domain/item/types/chart";
export function useDailyCloseChart(code: string | null, startDate: string, endDate: string) {
  const [items, setItems] = useState<DailyCloseChartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchDailyCloseChart({
          code,
          startDate: Number(startDate),
          endDate: Number(endDate),
        });

        if (!cancelled) {
          setItems(result);
        }
      } catch (loadError) {
        console.error("Failed to load daily close chart", loadError);
        if (!cancelled) {
          setItems([]);
          setError("종가 차트를 불러오지 못했습니다.");
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
  }, [code, endDate, startDate]);

  return { items, isLoading, error };
}
