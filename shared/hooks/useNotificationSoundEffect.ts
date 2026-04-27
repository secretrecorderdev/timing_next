import { useEffect, useRef } from "react";
import { playNotificationSound, unlockNotificationSound } from "@/shared/lib/notificationSound";
import type { NotificationItem } from "@/shared/store/useNotificationStore";

export function useNotificationSoundEffect(items: NotificationItem[], soundEnabled: boolean) {
  const lastPlayedIdRef = useRef<string | null>(null);

  useEffect(() => {
    const unlock = () => {
      void unlockNotificationSound();
    };

    window.addEventListener("pointerdown", unlock, { passive: true });
    window.addEventListener("keydown", unlock, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  useEffect(() => {
    const newestItem = items[0];
    if (!soundEnabled || !newestItem || !newestItem.sound || lastPlayedIdRef.current === newestItem.id) {
      return;
    }

    void playNotificationSound();
    lastPlayedIdRef.current = newestItem.id;
  }, [items, soundEnabled]);
}
