// types/trade.ts
export interface TradeItem {
  code: string;
  name: string;
  buyState: number; // Optional, if not used in TradeCardHeader
  buyPrice: number;
  currentPrice: number;
  holdingDays: number;
  buyDateTime: string;
  profit: number;
}
