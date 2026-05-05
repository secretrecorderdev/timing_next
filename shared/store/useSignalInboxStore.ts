"use client";

import { create } from "zustand";
import type { SignalInboxCreateInput, SignalInboxItem } from "@/shared/types/signalInbox";

interface SignalInboxState {
  items: SignalInboxItem[];
  open: boolean;
  currentIndex: number;
  enqueueItems: (inputs: SignalInboxCreateInput[]) => string[];
  closeInbox: () => void;
  prevItem: () => void;
  nextItem: () => void;
  confirmCurrent: () => void;
  clear: () => void;
}

function createItem(input: SignalInboxCreateInput): SignalInboxItem {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    source: input.source,
    title: input.title,
    body: input.body,
    tone: input.tone ?? "default",
    createdAt: Date.now(),
    read: false,
    confirmedAt: null,
    sound: input.sound,
    code: input.code,
    name: input.name,
    timingDate: input.timingDate ?? null,
    metadata: input.metadata,
  };
}

export const useSignalInboxStore = create<SignalInboxState>((set, get) => ({
  items: [],
  open: false,
  currentIndex: 0,
  enqueueItems: (inputs) => {
    if (inputs.length === 0) {
      return [];
    }

    const createdItems = inputs.map(createItem);

    set((state) => ({
      items: [...createdItems, ...state.items],
      open: true,
      currentIndex: 0,
    }));

    return createdItems.map((item) => item.id);
  },
  closeInbox: () => {
    set({ open: false });
  },
  prevItem: () => {
    const { currentIndex } = get();
    if (currentIndex <= 0) {
      return;
    }

    set({ currentIndex: currentIndex - 1 });
  },
  nextItem: () => {
    const { currentIndex, items } = get();
    if (currentIndex >= items.length - 1) {
      return;
    }

    set({ currentIndex: currentIndex + 1 });
  },
  confirmCurrent: () => {
    const { currentIndex, items } = get();
    if (items.length === 0) {
      set({ open: false, currentIndex: 0 });
      return;
    }

    const nextItems = items.filter((_, index) => index !== currentIndex);
    const nextIndex = nextItems.length === 0 ? 0 : Math.min(currentIndex, nextItems.length - 1);

    set({
      items: nextItems,
      currentIndex: nextIndex,
      open: nextItems.length > 0,
    });
  },
  clear: () => {
    set({ items: [], open: false, currentIndex: 0 });
  },
}));
