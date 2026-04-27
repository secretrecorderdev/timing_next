"use client";

import dayjs from "dayjs";
import { create } from "zustand";
import { formatDateTimeTo12Digits } from "@/shared/lib/dateRange";
import type { TimingListItem, TimingSignalItem } from "@/domain/timing/types/timing";

interface TimingSignalState {
  sessionStartDate: string | null;
  lastTimingDate: string | null;
  items: TimingSignalItem[];
  initializeSession: () => string;
  appendSignals: (items: TimingListItem[]) => TimingSignalItem[];
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  clear: () => void;
}

function toSessionStartDate() {
  return formatDateTimeTo12Digits(dayjs());
}

function compareTimingDate(a?: string | null, b?: string | null) {
  return (a ?? "").localeCompare(b ?? "");
}

function createSignalKey(item: Pick<TimingListItem, "id" | "timingDate" | "buyState">) {
  return `${item.id}-${item.timingDate ?? ""}-${item.buyState ?? ""}`;
}

export const useTimingSignalStore = create<TimingSignalState>((set, get) => ({
  sessionStartDate: null,
  lastTimingDate: null,
  items: [],
  initializeSession: () => {
    const existing = get().sessionStartDate;
    if (existing) {
      return existing;
    }

    const sessionStartDate = toSessionStartDate();
    set({ sessionStartDate, lastTimingDate: sessionStartDate, items: [] });
    return sessionStartDate;
  },
  appendSignals: (incomingItems) => {
    if (incomingItems.length === 0) {
      return [];
    }

    const existingItems = get().items;
    const existingKeys = new Set(existingItems.map((item) => createSignalKey(item)));
    const appendedItems = incomingItems
      .filter((item) => !existingKeys.has(createSignalKey(item)))
      .map<TimingSignalItem>((item) => ({
        ...item,
        read: false,
      }));

    if (appendedItems.length === 0) {
      const latestTimingDate = incomingItems.reduce<string | null>((latest, item) => {
        if (!item.timingDate) {
          return latest;
        }
        if (!latest || compareTimingDate(item.timingDate, latest) > 0) {
          return item.timingDate;
        }
        return latest;
      }, get().lastTimingDate);

      if (latestTimingDate && latestTimingDate !== get().lastTimingDate) {
        set({ lastTimingDate: latestTimingDate });
      }
      return [];
    }

    const mergedItems = [...appendedItems, ...existingItems].sort((left, right) => compareTimingDate(right.timingDate, left.timingDate));
    const latestTimingDate = mergedItems.reduce<string | null>((latest, item) => {
      if (!item.timingDate) {
        return latest;
      }
      if (!latest || compareTimingDate(item.timingDate, latest) > 0) {
        return item.timingDate;
      }
      return latest;
    }, get().lastTimingDate);

    set({
      items: mergedItems,
      lastTimingDate: latestTimingDate,
    });

    return appendedItems;
  },
  markAsRead: (id) => {
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, read: true } : item)),
    }));
  },
  markAllAsRead: () => {
    set((state) => ({
      items: state.items.map((item) => ({ ...item, read: true })),
    }));
  },
  clear: () => {
    set({ sessionStartDate: null, lastTimingDate: null, items: [] });
  },
}));
