import { create } from 'zustand'
import dayjs from 'dayjs'

interface DateRangeStore {
  startDate: string
  endDate: string
  setRange: (start: string, end: string) => void
  resetRange: () => void
}

export const useTimingDateRangeStore = create<DateRangeStore>((set) => ({
  startDate: dayjs().subtract(3, 'month').format('YYYY-MM-DD'),
  endDate: dayjs().format('YYYY-MM-DD'),
  setRange: (start, end) => set({ startDate: start, endDate: end }),
  resetRange: () =>
    set({
      startDate: dayjs().subtract(3, 'month').format('YYYY-MM-DD'),
      endDate: dayjs().format('YYYY-MM-DD'),
    }),
}))
