interface TradeCardInfoProps {
  currentPrice: number;
  buyPrice: number;
  sellPrice?: number | null;
  buyState: number;
  holdingDays: number;
  buyDateTime: string;
  timingDateTime?: string | null;
  profit: number;
  profitClassName?: string;
  currentPriceClassName?: string;
}

export function TradeCardInfo({
  currentPrice,
  buyPrice,
  sellPrice,
  buyState,
  holdingDays,
  buyDateTime,
  timingDateTime,
  profit,
  profitClassName,
  currentPriceClassName,
}: TradeCardInfoProps) {
  const priceLabel = buyState === 2 ? "매도가" : buyState === 3 ? "매수가" : "현재가";
  const priceValue = buyState === 2
    ? (sellPrice ?? currentPrice)
    : buyState === 3
      ? buyPrice
      : currentPrice;

  const secondaryDateTime = (buyState === 2 || buyState === 3)
    ? (timingDateTime ?? buyDateTime)
    : buyDateTime;

  const secondaryInfo = secondaryDateTime;

  return (
    <div className="flex flex-col items-start justify-start gap-[2px] text-sm leading-snug sm:text-[15px]">
      <div className="break-words">
        <span className={currentPriceClassName}>{priceLabel}({priceValue.toLocaleString()})</span>
        <span className="text-gray-400"> | </span>
        <span className={profitClassName}>{profit.toFixed(2)}%</span>
        <span className="text-gray-400"> | </span>
        보유일: {holdingDays}일
      </div>
      <div className="break-all text-gray-500">{secondaryInfo}</div>
    </div>
  );
}
