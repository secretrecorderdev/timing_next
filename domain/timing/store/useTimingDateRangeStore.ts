import { create } from "zustand";
import dayjs from "dayjs";

interface DateRangeStore {
  startDate: string;
  endDate: string;
  setRange: (start: string, end: string) => void;
  resetRange: () => void;
}

function formatDateTimeTo12Digits(date: dayjs.Dayjs): string {
  return date.format("YYYYMMDDHHmm");
}

function getDefaultRange() {
  const endDate = dayjs().endOf("day");
  const startDate = endDate.subtract(3, "month").add(1, "day").startOf("day");

  return {
    startDate: formatDateTimeTo12Digits(startDate),
    endDate: formatDateTimeTo12Digits(endDate),
  };
}

export const useTimingDateRangeStore = create<DateRangeStore>((set) => ({
  ...getDefaultRange(),
  setRange: (start, end) => set({ startDate: start, endDate: end }),
  resetRange: () => set(getDefaultRange()),
}));
