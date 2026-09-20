"use client";

import { create } from "zustand";
import type { PageRefreshTarget } from "@/shared/lib/pageRefresh";

interface PageRefreshState {
  timingRevision: number;
  holdRevision: number;
  requestRefresh: (target: PageRefreshTarget) => void;
}

export const usePageRefreshStore = create<PageRefreshState>((set) => ({
  timingRevision: 0,
  holdRevision: 0,
  requestRefresh: (target) =>
    set((state) =>
      target === "timing"
        ? { timingRevision: state.timingRevision + 1 }
        : { holdRevision: state.holdRevision + 1 },
    ),
}));
