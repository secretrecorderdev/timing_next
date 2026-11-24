import type { RiskDailyItem } from "./riskDaily";

export interface RiskDailySideSummary {
  totalBenefit: number | null;
  count: number;
  averageBenefit: number | null;
}

function addBenefit(summary: RiskDailySideSummary, benefit: number | null, count: number) {
  if (benefit === null) return;
  summary.totalBenefit = (summary.totalBenefit ?? 0) + benefit;
  summary.count += count;
  summary.averageBenefit = summary.count > 0 ? summary.totalBenefit / summary.count : null;
}

export function getRiskDailySummary(items: RiskDailyItem[]) {
  const groups = [10, 20, 30].map((signal) => ({
    signal,
    buy: { totalBenefit: null, count: 0, averageBenefit: null } as RiskDailySideSummary,
    short: { totalBenefit: null, count: 0, averageBenefit: null } as RiskDailySideSummary,
  }));

  for (const item of items) {
    const group = groups.find((candidate) => candidate.signal === item.risk10Signal);
    if (!group) continue;
    addBenefit(group.buy, item.buyBenefit, item.buyCount);
    addBenefit(group.short, item.shortBenefit, item.shortCount);
  }
  return groups;
}
