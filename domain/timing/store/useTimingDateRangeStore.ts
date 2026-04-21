import { create } from 'zustand'
import dayjs from 'dayjs'

interface DateRangeStore {
  startDate: string
  endDate: string
  setRange: (start: string, end: string) => void
  resetRange: () => void
}

function formatDateTimeTo12Digits(date: dayjs.Dayjs): string {
  return date.format('YYYYMMDDHHmm') // "202507281130"
}

export const useTimingDateRangeStore = create<DateRangeStore>((set) => {
  const now = dayjs()
  const threeMonthsAgo = now.subtract(24, 'month')

  return {
    startDate: formatDateTimeTo12Digits(threeMonthsAgo),
    endDate: formatDateTimeTo12Digits(now),
    setRange: (start, end) => set({ startDate: start, endDate: end }),
    resetRange: () =>
      set({
        startDate: formatDateTimeTo12Digits(dayjs().subtract(3, 'month')),
        endDate: formatDateTimeTo12Digits(dayjs()),
      }),
  }
})