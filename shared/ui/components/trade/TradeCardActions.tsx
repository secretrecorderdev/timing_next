"use client";

import { TradeActionButtons } from "./TradeActionButtons";

interface TradeCardActionsProps {
  code: string;
  className?: string;
}

export function TradeCardActions({ code, className }: TradeCardActionsProps) {
  return <TradeActionButtons code={code} className={className} />;
}
