import { memo } from "react";
import { TradeCardTitle } from "./TradeCardTitle";
import { TradeCardInfo } from "./TradeCardInfo";
import { TradeCardActions } from "./TradeCardActions";
import { Card } from "@/common/ui/primitives/card/Card";
import { TradeItem } from "@/common/types/trade";
import { cn } from "@/common/lib/CommonUtils";

interface TradeCardProps {
  item: TradeItem;
}

export const TradeCard = memo(function TradeCard({ item }: TradeCardProps) {
  const isProfit = item.profit >= 0;
  const isZero = item.profit === 0;

  return (
    <Card className="text-black border-gray-300 cursor-pointer hover:bg-gray-200 transition-shadow duration-200">
      {/* 상단: 종목명 + 수익률 */}
      <div className="flex items-center justify-between mb-2">
        <TradeCardTitle
          stockCode={item.code}
          stockName={item.name}
          buyState={item.buyState}
          buyPrice={item.buyPrice}
        />
        <div
          className={cn(
            "text-medium font-medium",
            isZero ? "text-gray-500" :
            isProfit ? "text-red-500" : "text-blue-500"
          )}
        >
          {item.profit.toFixed(2)}%
        </div>
      </div>

      {/* 중단: 현재가/보유일/매수일 + 액션 아이콘들 */}
      <div className="flex items-start justify-between">
        <TradeCardInfo
          
          currentPrice={item.currentPrice}
          holdingDays={item.holdingDays}
          buyDateTime={item.buyDateTime}
        />
        <TradeCardActions />
      </div>
    </Card>
  );
});