"use client";

import dayjs from "dayjs";
import { useMemo } from "react";
import { Button } from "@/shared/ui/primitives/button/Button";
import { useTimingDateRangeStore } from "@/domain/timing/store/useTimingDateRangeStore";

type RangePreset = "7d" | "1m" | "3m" | "1y" | "custom";

const MIN_DATE = "2023-08-01";

const presetLabels: Record<RangePreset, string> = {
  "7d": "최근 7일",
  "1m": "최근 1개월",
  "3m": "최근 3개월",
  "1y": "최근 1년",
  custom: "직접 선택",
};

function formatDateTimeTo12Digits(date: dayjs.Dayjs) {
  return date.format("YYYYMMDDHHmm");
}

function formatDateInputValue(value: string) {
  if (!value || value.length < 8) return "";

  const rawDate = value.slice(0, 8);
  return `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`;
}

function toRangeByPreset(preset: Exclude<RangePreset, "custom">) {
  const end = dayjs().endOf("day");

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

function detectPreset(startDate: string, endDate: string): RangePreset {
  const presets: Exclude<RangePreset, "custom">[] = ["7d", "1m", "3m", "1y"];

  for (const preset of presets) {
    const range = toRangeByPreset(preset);

    if (range.startDate === startDate && range.endDate === endDate) {
      return preset;
    }
  }

  return "custom";
}

export function TimingDateRangeFilter() {
  const { startDate, endDate, setRange } = useTimingDateRangeStore();

  const selectedPreset = useMemo(
    () => detectPreset(startDate, endDate),
    [endDate, startDate]
  );

  const startInputValue = useMemo(() => formatDateInputValue(startDate), [startDate]);
  const endInputValue = useMemo(() => formatDateInputValue(endDate), [endDate]);
  const maxDate = dayjs().format("YYYY-MM-DD");

  const handlePresetClick = (preset: Exclude<RangePreset, "custom">) => {
    const range = toRangeByPreset(preset);
    setRange(range.startDate, range.endDate);
  };

  const handleDateChange = (type: "start" | "end", value: string) => {
    const nextDate = dayjs(value);

    if (!nextDate.isValid()) return;

    const currentStart = dayjs(startInputValue || MIN_DATE);
    const currentEnd = dayjs(endInputValue || maxDate);

    const nextStart = type === "start" ? nextDate.startOf("day") : currentStart.startOf("day");
    const nextEnd = type === "end" ? nextDate.endOf("day") : currentEnd.endOf("day");

    if (nextStart.isAfter(nextEnd)) {
      if (type === "start") {
        setRange(formatDateTimeTo12Digits(nextStart), formatDateTimeTo12Digits(nextStart.endOf("day")));
      } else {
        setRange(formatDateTimeTo12Digits(nextEnd.startOf("day")), formatDateTimeTo12Digits(nextEnd));
      }
      return;
    }

    setRange(formatDateTimeTo12Digits(nextStart), formatDateTimeTo12Digits(nextEnd));
  };

  return (
    <section className="mb-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <label className="flex min-w-0 flex-1 flex-col gap-1 text-sm text-gray-600">
          <span className="font-medium text-gray-800">시작일</span>
          <input
            type="date"
            min={MIN_DATE}
            max={endInputValue || maxDate}
            value={startInputValue}
            onChange={(event) => handleDateChange("start", event.target.value)}
            className="h-11 rounded-xl border border-gray-300 px-3 text-base text-gray-900 outline-none transition focus:border-emerald-500"
          />
        </label>

        <label className="flex min-w-0 flex-1 flex-col gap-1 text-sm text-gray-600">
          <span className="font-medium text-gray-800">종료일</span>
          <input
            type="date"
            min={startInputValue || MIN_DATE}
            max={maxDate}
            value={endInputValue}
            onChange={(event) => handleDateChange("end", event.target.value)}
            className="h-11 rounded-xl border border-gray-300 px-3 text-base text-gray-900 outline-none transition focus:border-emerald-500"
          />
        </label>

        <Button className="h-11 shrink-0 px-5 lg:min-w-[88px]">조회</Button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {(Object.keys(presetLabels) as RangePreset[]).map((preset) => {
          const isSelected = selectedPreset === preset;

          return (
            <Button
              key={preset}
              size="sm"
              variant={isSelected ? "filled" : "outline"}
              color={isSelected ? "success" : "muted"}
              className="rounded-full px-4"
              onClick={() => {
                if (preset === "custom") return;
                handlePresetClick(preset);
              }}
            >
              {presetLabels[preset]}
            </Button>
          );
        })}
      </div>
    </section>
  );
}
