"use client";

import { Card } from "@/shared/ui/primitives/card/Card";

interface PeriodSummaryCardProps {
  periodLabel: string;
  totalProfit: number;
  totalHoldingDays: number;
  annualizedProfit?: number;
  onClick?: () => void;
}

function formatSignedPercent(value: number) {
  const fixed = value.toFixed(2);
  return `${value > 0 ? "+" : ""}${fixed}%`;
}

export function PeriodSummaryCard({
  periodLabel,
  totalProfit,
  totalHoldingDays,
  annualizedProfit,
  onClick,
}: PeriodSummaryCardProps) {
  const profitColor = totalProfit > 0 ? "text-red-500" : totalProfit < 0 ? "text-blue-500" : "text-gray-900";

  return (
    <button
      type="button"
      className="mb-4 block w-full cursor-pointer text-left rounded-2xl focus:outline-none"
      onClick={onClick}
    >
      <Card className="border-gray-200 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md active:translate-y-0 active:shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch sm:justify-between">
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-500">{periodLabel}</div>
          <div className={`mt-1 text-xl font-bold sm:text-2xl ${profitColor}`}>
            수익률 합 {formatSignedPercent(totalProfit)}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid grid-cols-2 rounded-xl bg-gray-50 sm:contents">
            <div className="px-4 py-3 text-left sm:rounded-xl sm:bg-gray-50 sm:text-right">
              <div className="text-sm font-medium text-gray-500">환산 연수익률</div>
              <div className="mt-1 text-lg font-semibold text-gray-900 sm:text-xl">
                {annualizedProfit == null ? "-" : formatSignedPercent(annualizedProfit)}
              </div>
            </div>

            <div className="border-l border-gray-200 px-4 py-3 text-left sm:rounded-xl sm:border-l-0 sm:bg-gray-50 sm:text-right">
              <div className="text-sm font-medium text-gray-500">총 보유기간</div>
              <div className="mt-1 text-lg font-semibold text-gray-900 sm:text-xl">
                {totalHoldingDays.toLocaleString()}일
              </div>
            </div>
          </div>
        </div>
      </div>
      </Card>
    </button>
  );
}
