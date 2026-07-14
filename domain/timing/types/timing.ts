export interface TimingListInput {
  buyState?: number;
  codes?: string[];
  endDate?: string;
  limit?: number;
  offset?: number;
  startDate?: string;
  polling?: boolean;
}

export interface TimingPeriodSummary {
  startDate?: string | null;
  endDate?: string | null;
  sumBenefit?: number | string | null;
  sumPeriod?: number | null;
  annualizedBenefit?: number | string | null;
  kospiStartDate?: string | null;
  kospiEndDate?: string | null;
  startDateKospiValue?: number | string | null;
  endDateKospiValue?: number | string | null;
  kospiBenefit?: number | string | null;
}

export interface TimingListItem {
  id: number;
  code?: string | null;
  name?: string | null;
  sector?: string | null;
  primaryIndustry?: string | null;
  regDate?: string | null;
  buyPrice?: number | null;
  currentPrice?: number | null;
  benefit?: string | null;
  timingDate?: string | null;
  buyDate?: string | null;
  sellDate?: string | null;
  priceDate?: string | null;
  buyState?: number | null;
  sellPrice?: number | null;
  pairId?: number | null;
  period?: number | null;
  buyType?: string | null;
  sellType?: string | null;
  buyRiskLevel?: number | null;
  buyRiskLevelKr?: string | null;
}

export interface TimingSignalItem extends TimingListItem {
  read: boolean;
}
