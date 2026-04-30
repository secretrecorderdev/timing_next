import dayjs from "dayjs";

export type RangePreset = "7d" | "1m" | "3m" | "1y" | "custom";

export const MIN_TIMING_DATE = "2023-08-01";

export const rangePresetLabels: Record<RangePreset, string> = {
  "7d": "최근 7일",
  "1m": "최근 1개월",
  "3m": "최근 3개월",
  "1y": "최근 1년",
  custom: "직접 선택",
};

export function getTodayDateInTimeZone(timeZone = "Asia/Seoul") {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function getBaseEndOfDay(baseDate?: string) {
  return (baseDate ? dayjs(baseDate) : dayjs()).endOf("day");
}

export function formatDateTimeTo12Digits(date: dayjs.Dayjs) {
  return date.format("YYYYMMDDHHmm");
}

export function formatDateInputValue(value: string) {
  if (!value || value.length < 8) return "";

  const rawDate = value.slice(0, 8);
  return `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`;
}

export function toRangeByPreset(preset: Exclude<RangePreset, "custom">, baseDate?: string) {
  const end = getBaseEndOfDay(baseDate);

  switch (preset) {
    case "7d":
      return {
        startDate: formatDateTimeTo12Digits(end.subtract(6, "day").startOf("day")),
        endDate: formatDateTimeTo12Digits(end),
      };
    case "1m":
      return {
        startDate: formatDateTimeTo12Digits(end.subtract(1, "month").add(1, "day").startOf("day")),
        endDate: formatDateTimeTo12Digits(end),
      };
    case "3m":
      return {
        startDate: formatDateTimeTo12Digits(end.subtract(3, "month").add(1, "day").startOf("day")),
        endDate: formatDateTimeTo12Digits(end),
      };
    case "1y":
      return {
        startDate: formatDateTimeTo12Digits(end.subtract(1, "year").add(1, "day").startOf("day")),
        endDate: formatDateTimeTo12Digits(end),
      };
  }
}

export function detectRangePreset(startDate: string, endDate: string, baseDate?: string): RangePreset {
  const presets: Exclude<RangePreset, "custom">[] = ["7d", "1m", "3m", "1y"];

  for (const preset of presets) {
    const range = toRangeByPreset(preset, baseDate);

    if (range.startDate === startDate && range.endDate === endDate) {
      return preset;
    }
  }

  return "custom";
}

export function getRangeSummaryLabel(startDate: string, endDate: string, baseDate?: string) {
  const preset = detectRangePreset(startDate, endDate, baseDate);

  if (preset === "custom") {
    return "해당 기간";
  }

  return rangePresetLabels[preset];
}
