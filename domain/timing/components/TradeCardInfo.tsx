import { memo } from "react";

interface TradeCardInfoProps {
  currentPrice: number;
  holdingDays: number;
  buyDateTime: string;
}

export const TradeCardInfo = memo(
  ({ currentPrice, holdingDays, buyDateTime }: TradeCardInfoProps) => (
    <div className="flex flex-col justify-start items-start gap-[2px] leading-snug text-[15px]">
      <div>
        현재가({currentPrice.toLocaleString()}) | 보유일: {holdingDays}일
      </div>
      <div className="text-gray-500">{buyDateTime}</div>
    </div>
  )
);
