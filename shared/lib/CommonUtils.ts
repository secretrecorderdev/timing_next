// lib/utils.ts
import { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs)); // tailwind 중복까지 정리하고 싶다면 twMerge도 가능
}

export function formatDateTime(dt: string): string {
  if (!dt || dt.length !== 12) return "-";
  return dayjs(dt, "YYYYMMDDHHmm").format("YYYY-MM-DD HH:mm");
}

export function getHoldingDaysFrom(dateStr: string): number {
  const parsed = dayjs(dateStr, "YYYYMMDDHHmm");
  if (!parsed.isValid()) return 0;
  return dayjs().diff(parsed, "day");
}