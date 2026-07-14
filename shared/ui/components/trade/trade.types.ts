// types/trade.ts
export interface TradeItem {
  code: string;
  name: string;
  sector?: string | null;
  primaryIndustry?: string | null;
  buyState: number; // Optional, if not used in TradeCardHeader
  buyPrice: number;
  currentPrice: number;
  sellPrice?: number | null;
  holdingDays: number;
  buyDateTime: string;
  timingDateTime?: string | null;
  priceDateTime?: string | null;
  sellDateTime?: string | null;
  buyRiskLevel?: number | null;
  buyRiskLevelKr?: string | null;
  profit: number;
}
