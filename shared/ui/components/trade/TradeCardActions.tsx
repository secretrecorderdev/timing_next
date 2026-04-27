"use client";

import { TradeActionButtons } from "./TradeActionButtons";

interface TradeCardActionsProps {
  code: string;
}

export function TradeCardActions({ code }: TradeCardActionsProps) {
  return <TradeActionButtons code={code} />;
}
