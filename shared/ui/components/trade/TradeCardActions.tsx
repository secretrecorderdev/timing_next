"use client";

import { TradeActionButtons } from "./TradeActionButtons";
import { useTradeViewStore } from "@/shared/store/useTradeViewStore";

interface TradeCardActionsProps {
  code: string;
  className?: string;
}

export function TradeCardActions({ code, className }: TradeCardActionsProps) {
  const viewMode = useTradeViewStore((state) => state.viewMode);

  if (viewMode === "compact") {
    return null;
  }

  return <TradeActionButtons code={code} className={className} />;
}
