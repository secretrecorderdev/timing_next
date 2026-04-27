import { memo } from "react";
import { TradeCardTitle } from "./TradeCardTitle";
import { TradeCardInfo } from "./TradeCardInfo";
import { TradeCardActions } from "./TradeCardActions";
import { Card } from "@/shared/ui/primitives/card/Card";
import type { TradeItem } from "./trade.types";
import { cn } from "@/shared/lib/CommonUtils";

interface TradeCardProps {
  item: TradeItem;
  onClick?: (item: TradeItem) => void;
}

function TradeCardComponent({ item, onClick }: TradeCardProps) {
  const isProfit = item.profit >= 0;
  const isZero = item.profit === 0;
  const profitClassName = cn(
    "text-medium font-medium",
    isZero ? "text-gray-500" : isProfit ? "text-red-500" : "text-blue-500"
  );

  return (
    <div
      role="button"
      tabIndex={0}
      className="block w-full text-left"
      onClick={() => onClick?.(item)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick?.(item);
        }
      }}
    >
      <Card className="cursor-pointer border-gray-300 text-black transition-shadow duration-200 hover:bg-gray-200">
      <div className="flex flex-col gap-2 sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-3">
        <div className="min-w-0">
          <div className="mb-2">
            <TradeCardTitle
              stockCode={item.code}
              stockName={item.name}
              buyState={item.buyState}
              buyPrice={item.buyPrice}
              sellPrice={item.sellPrice}
            />
          </div>

          <TradeCardInfo
            currentPrice={item.currentPrice}
            buyPrice={item.buyPrice}
            sellPrice={item.sellPrice}
            buyState={item.buyState}
            holdingDays={item.holdingDays}
            buyDateTime={item.buyDateTime}
            timingDateTime={item.timingDateTime}
            profit={item.profit}
            profitClassName={profitClassName}
            currentPriceClassName={profitClassName}
          />
        </div>
        <TradeCardActions code={item.code} className="mt-1 flex flex-wrap justify-center gap-2 sm:mt-0 sm:self-center sm:gap-2.5" />
      </div>
      </Card>
    </div>
  );
}

export const TradeCard = memo(TradeCardComponent);
