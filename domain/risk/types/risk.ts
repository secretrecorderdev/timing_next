export const RiskLevel = Object.freeze({
  NONE: 0,
  GOOD: 1,
  WARN: 2,
  BAD: 3,
  CRISIS: 4,
});

export type RiskLevelValue = (typeof RiskLevel)[keyof typeof RiskLevel];

export const RiskLevelKrMap: Record<number, string> = {
  [RiskLevel.NONE]: "관망",
  [RiskLevel.GOOD]: "양호",
  [RiskLevel.WARN]: "주의",
  [RiskLevel.BAD]: "위험",
  [RiskLevel.CRISIS]: "위기",
};

export interface TimingWindowRiskItem {
  id: number;
  targetDateTime?: number | null;
  riskLevel?: number | null;
  riskLevelKr?: string | null;
  prevRiskLevel?: number | null;
  prevRiskLevelKr?: string | null;
}

export function getRiskLevelLabel(risk?: Pick<TimingWindowRiskItem, "riskLevel" | "riskLevelKr"> | null) {
  if (!risk) {
    return null;
  }

  if (risk.riskLevel != null && RiskLevelKrMap[risk.riskLevel]) {
    return RiskLevelKrMap[risk.riskLevel];
  }

  return risk.riskLevelKr ?? null;
}

export function getPrevRiskLevelLabel(risk?: Pick<TimingWindowRiskItem, "prevRiskLevel" | "prevRiskLevelKr"> | null) {
  if (!risk) {
    return null;
  }

  if (risk.prevRiskLevel != null && RiskLevelKrMap[risk.prevRiskLevel]) {
    return RiskLevelKrMap[risk.prevRiskLevel];
  }

  return risk.prevRiskLevelKr ?? null;
}

export function formatRiskDate(value?: number | string | null) {
  const digits = String(value ?? "").replace(/\D/g, "").slice(0, 8);

  if (digits.length !== 8) {
    return "-";
  }

  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
}

export function getRiskLevelBadgeClass(level?: number | null) {
  switch (level) {
    case RiskLevel.GOOD:
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case RiskLevel.WARN:
      return "border-amber-200 bg-amber-50 text-amber-700";
    case RiskLevel.BAD:
      return "border-orange-200 bg-orange-50 text-orange-700";
    case RiskLevel.CRISIS:
      return "border-red-200 bg-red-50 text-red-700";
    case RiskLevel.NONE:
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}
