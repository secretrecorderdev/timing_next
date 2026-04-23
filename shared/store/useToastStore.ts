"use client";

import { create } from "zustand";

interface ToastState {
  message: string;
  visible: boolean;
  duration: number;
  showToast: (message: string, duration?: number) => void;
  hideToast: () => void;
}

let hideTimer: ReturnType<typeof setTimeout> | null = null;

export const useToastStore = create<ToastState>((set) => ({
  message: "",
  visible: false,
  duration: 2000,
  showToast: (message, duration = 2000) => {
    if (hideTimer) {
      clearTimeout(hideTimer);
    }

    set({ message, visible: true, duration });

    hideTimer = setTimeout(() => {
      set({ visible: false });
    }, duration);
  },
  hideToast: () => {
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
    set({ visible: false });
  },
}));
