"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { logGuestAccess } from "@/domain/auth/api/authApi";
import { useAuthStore } from "@/shared/store/useAuthStore";

const GUEST_DEVICE_ID_KEY = "timing-guest-device-id";
const GUEST_ACCESS_LOGGED_KEY = "timing-guest-access-logged";

function getGuestDeviceId() {
  const existing = localStorage.getItem(GUEST_DEVICE_ID_KEY);
  if (existing) {
    return existing;
  }

  const next = crypto.randomUUID();
  localStorage.setItem(GUEST_DEVICE_ID_KEY, next);
  return next;
}

export default function GuestAccessBootstrap() {
  const pathname = usePathname() ?? "/";
  const hydrated = useAuthStore((state) => state.hydrated);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!hydrated || user) {
      return;
    }

    const alreadyLogged = localStorage.getItem(GUEST_ACCESS_LOGGED_KEY);
    if (alreadyLogged === "true") {
      console.log("[jang][guestAccess] already logged, skip", { pathname });
      return;
    }

    const deviceId = getGuestDeviceId();

    void logGuestAccess({
      deviceId,
      targetPath: pathname,
      appVersion: "web",
      platform: "WEB",
    })
      .then(() => {
        localStorage.setItem(GUEST_ACCESS_LOGGED_KEY, "true");
        console.log("[jang][guestAccess] logged first guest access", { deviceId, pathname });
      })
      .catch((error) => {
        console.error("[jang][guestAccess] failed to log guest access", error);
      });
  }, [hydrated, pathname, user]);

  return null;
}
