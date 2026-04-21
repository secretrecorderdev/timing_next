export interface TimingListInput {
  buyState?: number;
  endDate?: string;
  limit?: number;
  offset?: number;
  startDate?: string;
}

export interface TimingListItem {
  id: number;
  code?: string | null;
  name?: string | null;
  regDate?: string | null;
  buyPrice?: number | null;
  currentPrice?: number | null;
  benefit?: string | null;
  timingDate?: string | null;
  buyDate?: string | null;
  priceDate?: string | null;
  buyState?: number | null;
  sellPrice?: number | null;
  pairId?: number | null;
  period?: number | null;
  buyType?: string | null;
  sellType?: string | null;
}
