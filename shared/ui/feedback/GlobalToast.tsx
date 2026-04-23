"use client";

import { useToastStore } from "@/shared/store/useToastStore";
import { bgColorMap } from "@/shared/ui/colors";

export default function GlobalToast() {
  const { message, visible } = useToastStore();

  if (!visible || !message) return null;

  return (
    <div className="pointer-events-none fixed left-1/2 top-6 z-50 -translate-x-1/2">
      <div
        className={`rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-lg ${bgColorMap.secondary.default}`}
      >
        {message}
      </div>
    </div>
  );
}
