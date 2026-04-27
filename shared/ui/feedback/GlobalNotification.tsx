"use client";

import { useNotificationSoundEffect } from "@/shared/hooks/useNotificationSoundEffect";
import { useNotificationStore, type NotificationTone } from "@/shared/store/useNotificationStore";

const toneClassNameMap: Record<NotificationTone, string> = {
  default: "border-gray-200 bg-white text-gray-900",
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  danger: "border-red-200 bg-red-50 text-red-900",
  info: "border-blue-200 bg-blue-50 text-blue-900",
};

export default function GlobalNotification() {
  const items = useNotificationStore((state) => state.items);
  const hideNotification = useNotificationStore((state) => state.hideNotification);
  const soundEnabled = useNotificationStore((state) => state.soundEnabled);

  useNotificationSoundEffect(items, soundEnabled);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[min(360px,calc(100vw-2rem))] flex-col gap-3">
      {items.map((item) => (
        <div
          key={item.id}
          className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-lg backdrop-blur-sm ${toneClassNameMap[item.tone]}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold leading-5">{item.title}</div>
              {item.description ? (
                <div className="mt-1 whitespace-pre-wrap break-words text-sm opacity-80">{item.description}</div>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => hideNotification(item.id)}
              className="cursor-pointer text-xs font-medium opacity-60 transition hover:opacity-100"
              aria-label="알림 닫기"
            >
              닫기
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
