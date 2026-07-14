export interface KospiStockItem {
  id: number;
  code: string;
  baseName: string;
  sector?: string | null;
  primaryIndustry?: string | null;
}
