import { formatStockIndustryLabel } from "@/shared/lib/stockIndustry";

interface TradeCardTitleProps {
  stockCode: string;
  stockName: string;
  sector?: string | null;
  primaryIndustry?: string | null;
  buyPrice: number;
  sellPrice?: number | null;
  buyState: number;
}

function getBuyStateColor(buyState: number) {
  switch (buyState) {
    case 1:
      return "text-red-500";
    case 2:
      return "text-gray-500";
    case 3:
      return "text-blue-500";
    case 0:
    default:
      return "text-purple-500";
  }
}

function getBuyStateText(buyState: number, buyPrice: number, sellPrice?: number | null) {
  switch (buyState) {
    case 1:
      return `매수(${buyPrice.toLocaleString()}원)`;
    case 2:
      return `매수(${buyPrice.toLocaleString()}원, 매도됨)`;
    case 3:
      return `매도(${(sellPrice ?? buyPrice).toLocaleString()}원)`;
    case 0:
    default:
      return "매수(미확정)";
  }
}

export function TradeCardTitle({
  stockCode,
  stockName,
  sector,
  primaryIndustry,
  buyPrice,
  sellPrice,
  buyState,
}: TradeCardTitleProps) {
  const industryText = formatStockIndustryLabel(sector, primaryIndustry);

  return (
    <div className="text-sm font-medium sm:text-base">
      <div className="flex flex-wrap items-baseline gap-x-1">
        <span className="break-words me-2">
          [{stockCode}] {stockName}
          {industryText && (
            <span className="text-xs font-normal text-slate-500 sm:text-sm">
              {" "}· {industryText}
            </span>
          )}
        </span>

        <span
          className={`whitespace-nowrap ${getBuyStateColor(buyState)}`}
        >
          {getBuyStateText(buyState, buyPrice, sellPrice)}
        </span>
      </div>
    </div>
  );
}