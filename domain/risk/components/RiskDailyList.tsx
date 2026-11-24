import { formatRiskDailyDate, getRiskDailySignal, type RiskDailyItem } from "@/domain/risk/types/riskDaily";
// import { getRiskDailySummary } from "@/domain/risk/types/riskDailySummary";

interface RiskDailyListProps {
  items: RiskDailyItem[];
  isLoading?: boolean;
  isError?: boolean;
}

// function formatBenefit(value: number | null) {
//   return value == null ? "-" : `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
// }

export function RiskDailyList({ items, isLoading, isError }: RiskDailyListProps) {
  if (isLoading) {
    return <div role="status" className="py-6 text-center text-sm text-gray-500">불러오는 중...</div>;
  }
  if (isError) {
    return <div role="alert" className="py-6 text-center text-sm text-gray-500">위험도 내역을 불러오지 못했습니다. 다시 시도해 주세요.</div>;
  }
  if (items.length === 0) {
    return <div className="py-6 text-center text-sm text-gray-500">표시할 위험도 내역이 없습니다.</div>;
  }

  return (
    <div className="space-y-4">
      {/* <section aria-label="신호별 수익 요약" className="space-y-2">
        {getRiskDailySummary(items).map((group) => (
          <article key={group.signal} className={`rounded-xl border px-4 py-3 ${getRiskDailySignal(group.signal).className}`}>
            <h3 className="mb-2 text-sm font-semibold">
              {group.signal === 10 ? "매수 추천" : group.signal === 20 ? "매수/매도 혼합" : "매도 추천"}
            </h3>
            {([["매수", group.buy], ["대주매도", group.short]] as const).map(([label, side]) => (
              <div key={label} className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs text-gray-700 sm:text-sm">
                <span className="w-14 shrink-0 font-semibold">{label}</span>
                <span>{`이익 합 ${formatBenefit(side.totalBenefit)}`}</span>
                <span>{`${side.count.toLocaleString("ko-KR")}건`}</span>
                <span>{`건당 수익률 ${formatBenefit(side.averageBenefit)}`}</span>
              </div>
            ))}
          </article>
        ))}
        <p className="px-1 text-xs text-gray-500">조회된 전체 날짜 기준 · 이익 미집계 일자의 건수는 해당 방향 집계에서 제외합니다.</p>
      </section> */}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-xs text-gray-500">
            <th scope="col" className="px-2 py-3 text-left font-medium">날짜</th>
            <th scope="col" className="px-2 py-3 text-right font-medium">코스피</th>
            <th scope="col" className="px-2 py-3 text-right font-medium">라벨</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const signal = getRiskDailySignal(item.risk10Signal);
            return (
              <tr key={item.timingDate} className="border-b border-gray-100 last:border-0">
                <td className="whitespace-nowrap px-2 py-3 text-gray-700">{formatRiskDailyDate(item.timingDate)}</td>
                <td className="px-2 py-3 text-right tabular-nums text-gray-700">
                  {item.kospiCloseValue == null ? "-" : item.kospiCloseValue.toLocaleString("ko-KR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="px-2 py-3 text-right">
                  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${signal.className}`}>
                    {signal.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
