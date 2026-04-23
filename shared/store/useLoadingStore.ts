"use client";

import { create } from 'zustand';

interface LoadingStore {
  isGlobalLoading: boolean;
  setGlobalLoading: (v: boolean) => void;
}

export const useLoadingStore = create<LoadingStore>((set) => ({
  isGlobalLoading: false,
  setGlobalLoading: (v) => set({ isGlobalLoading: v }),
}));