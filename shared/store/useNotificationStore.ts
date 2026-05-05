"use client";

import { create } from "zustand";
import type { SignalInboxTone } from "@/shared/types/signalInbox";

export type NotificationTone = SignalInboxTone;

export interface NotificationItem {
  id: string;
  title: string;
  description?: string;
  duration: number;
  tone: NotificationTone;
  createdAt: number;
  sound?: boolean;
}

interface ShowNotificationInput {
  title: string;
  description?: string;
  duration?: number;
  tone?: NotificationTone;
  sound?: boolean;
}

interface NotificationState {
  items: NotificationItem[];
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  toggleSoundEnabled: () => void;
  showNotification: (input: ShowNotificationInput) => string;
  hideNotification: (id: string) => void;
  clearNotifications: () => void;
}

const DEFAULT_DURATION = 4_000;
const MAX_NOTIFICATIONS = 4;
const hideTimers = new Map<string, ReturnType<typeof setTimeout>>();

function clearHideTimer(id: string) {
  const timer = hideTimers.get(id);
  if (!timer) {
    return;
  }

  clearTimeout(timer);
  hideTimers.delete(id);
}

export const useNotificationStore = create<NotificationState>((set) => ({
  items: [],
  soundEnabled: false,
  setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
  toggleSoundEnabled: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  showNotification: ({ title, description, duration = DEFAULT_DURATION, tone = "default", sound = false }) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const createdAt = Date.now();

    set((state) => ({
      items: [
        {
          id,
          title,
          description,
          duration,
          tone,
          createdAt,
          sound,
        },
        ...state.items,
      ].slice(0, MAX_NOTIFICATIONS),
    }));

    hideTimers.forEach((timer, key) => {
      const exists = useNotificationStore.getState().items.some((item) => item.id === key);
      if (!exists) {
        clearTimeout(timer);
        hideTimers.delete(key);
      }
    });

    const timer = setTimeout(() => {
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      }));
      hideTimers.delete(id);
    }, duration);

    hideTimers.set(id, timer);
    return id;
  },
  hideNotification: (id) => {
    clearHideTimer(id);
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  },
  clearNotifications: () => {
    hideTimers.forEach((timer) => clearTimeout(timer));
    hideTimers.clear();
    set({ items: [] });
  },
}));
