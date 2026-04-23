interface TradeCardTitleProps {
  stockCode: string;
  stockName: string;
  buyPrice: number;
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

function getBuyStateText(buyState: number, buyPrice: number) {
  switch (buyState) {
    case 1:
      return `매수(${buyPrice.toLocaleString()}원)`;
    case 2:
      return "매수(매도됨)";
    case 3:
      return `매도(${buyPrice.toLocaleString()}원)`;
    case 0:
    default:
      return "매수(미확정)";
  }
}

export function TradeCardTitle({ stockCode, stockName, buyPrice, buyState }: TradeCardTitleProps) {
  return (
    <div className="text-lg font-medium">
      [{stockCode}] {stockName}{" "}
      <span className={getBuyStateColor(buyState)}>
        {getBuyStateText(buyState, buyPrice)}
      </span>
    </div>
  );
}
