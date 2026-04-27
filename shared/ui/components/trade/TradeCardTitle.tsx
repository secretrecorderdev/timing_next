interface TradeCardTitleProps {
  stockCode: string;
  stockName: string;
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

export function TradeCardTitle({ stockCode, stockName, buyPrice, sellPrice, buyState }: TradeCardTitleProps) {
  return (
    <div className="break-words text-sm font-medium sm:text-base">
      [{stockCode}] {stockName}{" "}
      <span className={getBuyStateColor(buyState)}>
        {getBuyStateText(buyState, buyPrice, sellPrice)}
      </span>
    </div>
  );
}
