"use client";

import type { ChartSignalMarker, DailyCloseChartItem } from "@/domain/item/types/chart";
import { LightweightLineChart } from "@/shared/ui/components/chart/LightweightLineChart";

interface StockDailyCloseChartCardProps {
  title: string;
  code: string;
  data: DailyCloseChartItem[];
  markers?: ChartSignalMarker[];
  isLoading?: boolean;
  error?: string | null;
}

export function StockDailyCloseChartCard({
  title,
  code,
  data,
  markers = [],
  isLoading = false,
  error = null,
}: StockDailyCloseChartCardProps) {
  return (
    <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-0 shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4">
        <div className="text-base font-semibold text-gray-900">종가 차트</div>
        <div className="mt-1 text-sm text-gray-500">
          {title} [{code}] 종가 기준
        </div>
      </div>

      <div className="px-2 py-4 sm:px-5">
        {isLoading ? (
          <div className="flex h-80 items-center justify-center text-sm text-gray-500">
            차트를 불러오는 중입니다.
          </div>
        ) : error ? (
          <div className="flex h-80 items-center justify-center text-sm text-red-500">
            {error}
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-80 items-center justify-center text-sm text-gray-500">
            표시할 차트 데이터가 없습니다.
          </div>
        ) : (
          <LightweightLineChart data={data} markers={markers} />
        )}
      </div>
    </div>
  );
}
