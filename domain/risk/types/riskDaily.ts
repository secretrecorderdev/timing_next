export interface RiskDailyItem {
  timingDate: number;
  risk10Score: number | null;
  risk10Signal: number | null;
  kospiCloseValue: number | null;
  buyBenefit: number | null;
  shortBenefit: number | null;
  buyCount: number;
  shortCount: number;
}

function isNullableNumber(value: unknown): value is number | null {
  return value === null || (typeof value === "number" && Number.isFinite(value));
}

function isRiskDailyItem(value: unknown): value is RiskDailyItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.timingDate === "number"
    && Number.isSafeInteger(item.timingDate)
    && /^\d{12}$/.test(String(item.timingDate))
    && isNullableNumber(item.risk10Score)
    && isNullableNumber(item.risk10Signal)
    && isNullableNumber(item.kospiCloseValue)
    && isNullableNumber(item.buyBenefit)
    && isNullableNumber(item.shortBenefit)
    && typeof item.buyCount === "number" && Number.isSafeInteger(item.buyCount) && item.buyCount >= 0
    && typeof item.shortCount === "number" && Number.isSafeInteger(item.shortCount) && item.shortCount >= 0;
}

export function normalizeRiskDailyResponse(payload: unknown): RiskDailyItem[] {
  const data = payload && typeof payload === "object"
    ? (payload as { data?: unknown }).data
    : null;
  if (!Array.isArray(data) || !data.every(isRiskDailyItem)) {
    throw new Error("일별 위험도 응답 형식이 올바르지 않습니다.");
  }
  return [...data].sort((a, b) => b.timingDate - a.timingDate);
}

export function formatRiskDailyDate(timingDate: number): string {
  const date = String(timingDate).slice(0, 8);
  return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
}

export function getRiskDailySignal(signal: number | null) {
  switch (signal) {
    case 10:
      return { label: "매수", className: "border-red-200 bg-red-50 text-red-700" };
    case 20:
      return { label: "혼합", className: "border-amber-200 bg-amber-50 text-amber-700" };
    case 30:
      return { label: "매도", className: "border-blue-200 bg-blue-50 text-blue-700" };
    default:
      return { label: "-", className: "border-slate-200 bg-slate-50 text-slate-700" };
  }
}
