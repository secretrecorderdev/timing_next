"use client";

import dayjs from "dayjs";
import { useMemo } from "react";
import { Button } from "@/shared/ui/primitives/button/Button";
import {
  detectRangePreset,
  formatDateInputValue,
  formatDateTimeTo12Digits,
  MIN_TIMING_DATE,
  rangePresetLabels,
  type RangePreset,
  toRangeByPreset,
} from "@/shared/lib/dateRange";

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  minDate?: string;
  onChangeRange: (startDate: string, endDate: string) => void;
}

export function DateRangeFilter({
  startDate,
  endDate,
  minDate = MIN_TIMING_DATE,
  onChangeRange,
}: DateRangeFilterProps) {
  const selectedPreset = useMemo(
    () => detectRangePreset(startDate, endDate),
    [endDate, startDate]
  );

  const startInputValue = useMemo(() => formatDateInputValue(startDate), [startDate]);
  const endInputValue = useMemo(() => formatDateInputValue(endDate), [endDate]);
  const maxDate = dayjs().format("YYYY-MM-DD");

  const handlePresetClick = (preset: Exclude<RangePreset, "custom">) => {
    const range = toRangeByPreset(preset);
    onChangeRange(range.startDate, range.endDate);
  };

  const handleDateChange = (type: "start" | "end", value: string) => {
    const nextDate = dayjs(value);

    if (!nextDate.isValid()) return;

    const currentStart = dayjs(startInputValue || minDate);
    const currentEnd = dayjs(endInputValue || maxDate);

    const nextStart = type === "start" ? nextDate.startOf("day") : currentStart.startOf("day");
    const nextEnd = type === "end" ? nextDate.endOf("day") : currentEnd.endOf("day");

    if (nextStart.isAfter(nextEnd)) {
      if (type === "start") {
        onChangeRange(
          formatDateTimeTo12Digits(nextStart),
          formatDateTimeTo12Digits(nextStart.endOf("day"))
        );
      } else {
        onChangeRange(
          formatDateTimeTo12Digits(nextEnd.startOf("day")),
          formatDateTimeTo12Digits(nextEnd)
        );
      }
      return;
    }

    onChangeRange(formatDateTimeTo12Digits(nextStart), formatDateTimeTo12Digits(nextEnd));
  };

  return (
    <section className="mb-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex gap-2 overflow-x-auto pb-1">
        <label className="flex min-w-[156px] flex-1 flex-col gap-1 text-sm text-gray-600">
          <span className="ml-1 font-medium text-gray-800">시작일</span>
          <input
            type="date"
            min={minDate}
            max={endInputValue || maxDate}
            value={startInputValue}
            onChange={(event) => handleDateChange("start", event.target.value)}
            className="h-11 min-w-0 rounded-xl border border-gray-300 px-3 text-base text-gray-900 outline-none transition focus:border-emerald-500"
          />
        </label>

        <label className="flex min-w-[156px] flex-1 flex-col gap-1 text-sm text-gray-600">
          <span className="ml-1 font-medium text-gray-800">종료일</span>
          <input
            type="date"
            min={startInputValue || minDate}
            max={maxDate}
            value={endInputValue}
            onChange={(event) => handleDateChange("end", event.target.value)}
            className="h-11 min-w-0 rounded-xl border border-gray-300 px-3 text-base text-gray-900 outline-none transition focus:border-emerald-500 disabled:bg-gray-100 disabled:text-gray-400"
          />
        </label>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {(Object.keys(rangePresetLabels) as RangePreset[]).map((preset) => {
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
              {rangePresetLabels[preset]}
            </Button>
          );
        })}
      </div>
    </section>
  );
}
