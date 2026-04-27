"use client";

import { useTimingSignalPolling } from "@/shared/hooks/useTimingSignalPolling";

export function TimingTradeItemsBootstrap() {
  useTimingSignalPolling();

  return null;
}
