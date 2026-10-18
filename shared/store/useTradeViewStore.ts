"use client";

import { create } from "zustand";

type TradeViewMode = "compact" | "detailed";
export type TradeTypeFilter = "all" | "buy" | "short";

interface TradeViewState {
  tradeTypeFilter: TradeTypeFilter;
  viewMode: TradeViewMode;
  cycleTradeTypeFilter: () => void;
  toggleViewMode: () => void;
}

export const useTradeViewStore = create<TradeViewState>((set) => ({
  tradeTypeFilter: "all",
  viewMode: "detailed",
  cycleTradeTypeFilter: () =>
    set((state) => ({
      tradeTypeFilter:
        state.tradeTypeFilter === "all"
          ? "buy"
          : state.tradeTypeFilter === "buy"
            ? "short"
            : "all",
    })),
  toggleViewMode: () =>
    set((state) => ({
      viewMode: state.viewMode === "detailed" ? "compact" : "detailed",
    })),
}));
