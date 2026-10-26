"use client";

import dayjs from "dayjs";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Button } from "@/shared/ui/primitives/button/Button";
import {
  detectRangePreset,
  formatDateInputValue,
  formatDateTimeTo12Digits,
  getCalendarRangeOptions,
  MIN_TIMING_DATE,
  rangePresetLabels,
  type RangePreset,
  toRangeByPreset,
} from "@/shared/lib/dateRange";

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  minDate?: string;
  maxDate: string;
  onChangeRange: (startDate: string, endDate: string) => void;
}

export function DateRangeFilter({
  startDate,
  endDate,
  minDate = MIN_TIMING_DATE,
  maxDate,
  onChangeRange,
}: DateRangeFilterProps) {
  const detectedPreset = useMemo(
    () => detectRangePreset(startDate, endDate),
    [endDate, startDate]
  );
  const [isCustomSelected, setIsCustomSelected] = useState(false);
  const [isYearMenuOpen, setIsYearMenuOpen] = useState(false);
  const yearMenuRef = useRef<HTMLDivElement>(null);
  const yearButtonRef = useRef<HTMLButtonElement>(null);
  const yearMenuId = useId();
  const selectedPreset = isCustomSelected ? "custom" : detectedPreset;

  useEffect(() => {
    if (!isYearMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !yearMenuRef.current?.contains(event.target)) {
        setIsYearMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsYearMenuOpen(false);
        yearButtonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isYearMenuOpen]);

  const startInputValue = useMemo(() => formatDateInputValue(startDate), [startDate]);
  const endInputValue = useMemo(() => formatDateInputValue(endDate), [endDate]);
  const calendarOptions = useMemo(
    () => getCalendarRangeOptions(minDate, maxDate),
    [minDate, maxDate]
  );
  const selectedCalendarOption = calendarOptions.find(
    (option) => option.startDate === startDate && option.endDate === endDate
  )?.value ?? "";

  const handlePresetClick = (preset: RangePreset) => {
    if (preset === "custom") {
      setIsCustomSelected(true);
      return;
    }

    setIsCustomSelected(false);
    const range = toRangeByPreset(preset, maxDate);
    onChangeRange(range.startDate, range.endDate);
  };

  const handleDateChange = (type: "start" | "end", value: string) => {
    setIsCustomSelected(true);

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
    <section className="mb-4 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
      <div className="grid grid-cols-2 gap-2 pb-1">
        <label className="flex min-w-0 flex-col gap-1 text-sm text-gray-600">
          <span className="ml-1 font-medium text-gray-800">시작일</span>
          <input
            type="date"
            min={minDate}
            max={endInputValue || maxDate}
            value={startInputValue}
            onChange={(event) => handleDateChange("start", event.target.value)}
            className="h-11 w-full min-w-0 cursor-pointer rounded-xl border border-gray-300 px-2 text-sm text-gray-900 outline-none transition focus:border-emerald-500 sm:px-3 sm:text-base"
          />
        </label>

        <label className="flex min-w-0 flex-col gap-1 text-sm text-gray-600">
          <span className="ml-1 font-medium text-gray-800">종료일</span>
          <input
            type="date"
            min={startInputValue || minDate}
            max={maxDate}
            value={endInputValue}
            onChange={(event) => handleDateChange("end", event.target.value)}
            className="h-11 w-full min-w-0 cursor-pointer rounded-xl border border-gray-300 px-2 text-sm text-gray-900 outline-none transition focus:border-emerald-500 disabled:bg-gray-100 disabled:text-gray-400 sm:px-3 sm:text-base"
          />
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
        {(Object.keys(rangePresetLabels) as RangePreset[]).map((preset) => {
          const isSelected = selectedPreset === preset;

          return (
            <div key={preset} className="flex items-center gap-1.5 sm:gap-2">
              <Button
                size="sm"
                variant={isSelected ? "filled" : "outline"}
                color={isSelected ? "success" : "muted"}
                className="rounded-full px-2! py-1! text-xs! whitespace-nowrap sm:px-4! sm:py-1.5! sm:text-sm!"
                onClick={() => {
                  handlePresetClick(preset);
                }}
              >
                {rangePresetLabels[preset]}
              </Button>
              {preset === "custom" && (
                <div
                  ref={yearMenuRef}
                  className="relative"
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) {
                      setIsYearMenuOpen(false);
                    }
                  }}
                >
                  <button
                    ref={yearButtonRef}
                    type="button"
                    aria-expanded={isYearMenuOpen}
                    aria-controls={yearMenuId}
                    onClick={() => setIsYearMenuOpen((open) => !open)}
                    className="cursor-pointer rounded-full bg-transparent px-2 py-1 text-xs font-semibold whitespace-nowrap text-gray-500 outline-none transition hover:text-gray-600 active:text-gray-700 focus-visible:ring-2 focus-visible:ring-emerald-500 sm:px-4 sm:py-1.5 sm:text-sm"
                  >
                    연도선택
                  </button>
                  {isYearMenuOpen && (
                    <div
                      id={yearMenuId}
                      aria-label="연도·반기 선택"
                      className="absolute right-0 top-full z-30 mt-2 max-h-64 w-40 overflow-y-auto rounded-xl border border-gray-200 bg-white p-1 shadow-lg"
                    >
                      {calendarOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          aria-pressed={selectedCalendarOption === option.value}
                          onClick={() => {
                            setIsCustomSelected(true);
                            onChangeRange(option.startDate, option.endDate);
                            setIsYearMenuOpen(false);
                            yearButtonRef.current?.focus();
                          }}
                          className={`block w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm outline-none hover:bg-emerald-50 focus-visible:bg-emerald-50 ${selectedCalendarOption === option.value ? "bg-emerald-50 font-semibold text-emerald-600" : "text-gray-700"}`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
