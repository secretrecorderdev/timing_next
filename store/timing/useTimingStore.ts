// src/stores/useTimingStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { TimingUpdateMessage } from '@/types/socket';

type TimingState = {
  last: TimingUpdateMessage | null;
  setLast: (msg: TimingUpdateMessage) => void;
  reset: () => void;
};

export const useTimingStore = create<TimingState>()(
  devtools(
    persist(
      (set) => ({
        last: null,
        setLast: (msg) => set({ last: msg }),
        reset: () => set({ last: null }),
      }),
      { name: 'timing-store' }
    ),
    { name: 'timing-store-devtools' }
  )
);

export const selectLast = (s: TimingState) => s.last;