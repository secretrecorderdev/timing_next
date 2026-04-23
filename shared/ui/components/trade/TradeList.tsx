import { TradeCard } from "./TradeCard";
import type { TradeItem } from "./trade.types";

interface TradeListProps {
  items: TradeItem[];
}

export function TradeList({ items }: TradeListProps) {
  return (
    <div className="flex flex-col gap-4">
      {items.map((item, index) => (
        <TradeCard key={`${item.code}-${item.buyDateTime}-${item.buyState}-${item.buyPrice}-${index}`} item={item} />
      ))}
    </div>
  );
}
