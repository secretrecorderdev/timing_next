// components/Notification.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useTimingStore, selectLast } from '@/store/timing/useTimingStore';
import { bgColorMap } from '@/ui/lib/colors'; 

export default function Notification() {
  const lastMsg = useTimingStore(selectLast);
  const [open, setOpen] = useState(false);
  const hideTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!lastMsg) return;
    setOpen(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setOpen(false), 3000);
    return () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, [lastMsg]);

  if (!lastMsg) return null;

  const { value, timestamp } = lastMsg.payload;
   // 고정: 프라이머리 컬러 사용
  const variant: keyof typeof bgColorMap = 'primary';
  const disabled = false;
  const outline = false;

  const bgClass =
    !outline
      ? disabled
        ? bgColorMap[variant].disabled || bgColorMap[variant].default
        : [bgColorMap[variant].default, bgColorMap[variant].hover, bgColorMap[variant].active]
            .filter(Boolean)
            .join(' ')
        : 'border border-current bg-transparent';
  return (
    <div
      className={[
        'fixed right-4 bottom-4 z-[9999] max-w-xs select-none',
        'transition-all duration-300',
        open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none',
      ].join(' ')}
      role="status"
      aria-live="polite"
    >
      <div className={`rounded-xl text-white shadow-2xl px-4 py-3 ${bgClass}`}>
        <div className="flex items-start gap-3">
          <div className="mt-0.5 h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium">매수 매도 신호 알림</p>
            <p className="text-xs text-white/70 break-all">

            {/* asdf */}
              {value} <span className="ml-1">({new Date(timestamp).toLocaleTimeString()})</span>
            </p>
          </div>
          <button
            aria-label="Close notification"
            className="ml-auto -mr-1 rounded-lg px-1 text-white/70 hover:text-white"
            onClick={() => setOpen(false)}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
