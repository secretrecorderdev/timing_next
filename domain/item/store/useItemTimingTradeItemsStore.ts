import { create } from "zustand";
import { fetchTimingList } from "@/domain/timing/api/timingApi";
import { mapToTradeItem } from "@/domain/timing/mappers/tradeMapper";
import type { TimingListInput, TimingListItem, TimingPeriodSummary } from "@/domain/timing/types/timing";

type TradeItem = ReturnType<typeof mapToTradeItem>;

interface ItemTimingTradeEntry {
  items: TradeItem[];
  rawItems: TimingListItem[];
  summary: TimingPeriodSummary | null;
  isLoading: boolean;
  error: string | null;
  lastFetchedAt: number | null;
}

interface ItemTimingTradeItemsStore {
  entries: Record<string, ItemTimingTradeEntry>;
  ensureEntry: (key: string) => void;
  fetchEntry: (key: string, input: TimingListInput, options?: { silent?: boolean }) => Promise<void>;
}

const EMPTY_ENTRY: ItemTimingTradeEntry = {
  items: [],
  rawItems: [],
  summary: null,
  isLoading: false,
  error: null,
  lastFetchedAt: null,
};

export function createItemTimingTradeItemsKey(input: TimingListInput) {
  return JSON.stringify({
    startDate: input.startDate ?? "",
    endDate: input.endDate ?? "",
    buyState: input.buyState ?? "",
    codes: input.codes ?? [],
    limit: input.limit ?? 500,
    offset: input.offset ?? 0,
  });
}

export const useItemTimingTradeItemsStore = create<ItemTimingTradeItemsStore>((set, get) => ({
  entries: {},
  ensureEntry: (key) => {
    if (get().entries[key]) {
      return;
    }

    set((state) => ({
      entries: {
        ...state.entries,
        [key]: EMPTY_ENTRY,
      },
    }));
  },
  fetchEntry: async (key, input, options) => {
    const silent = options?.silent ?? false;

    if (!get().entries[key]) {
      get().ensureEntry(key);
    }

    set((state) => ({
      entries: {
        ...state.entries,
        [key]: {
          ...(state.entries[key] ?? EMPTY_ENTRY),
          isLoading: silent ? (state.entries[key]?.isLoading ?? false) : true,
          error: null,
        },
      },
    }));

    try {
      const result = await fetchTimingList({
        startDate: input.startDate,
        endDate: input.endDate,
        buyState: input.buyState,
        codes: input.codes,
        limit: input.limit ?? 500,
        offset: input.offset ?? 0,
      });

      set((state) => ({
        entries: {
          ...state.entries,
          [key]: {
            items: result.items.map(mapToTradeItem),
            rawItems: result.items,
            summary: result.summary,
            isLoading: false,
            error: null,
            lastFetchedAt: Date.now(),
          },
        },
      }));
    } catch (error) {
      console.error("Failed to load item timing list", error);

      set((state) => ({
        entries: {
          ...state.entries,
          [key]: {
            ...(state.entries[key] ?? EMPTY_ENTRY),
            items: [],
            rawItems: [],
            summary: null,
            isLoading: false,
            error: "Failed to load timing list",
          },
        },
      }));
    }
  },
}));
