"use client";

import { useEffect } from "react";
import { loginAsGuest } from "@/domain/auth/api/authApi";
import {
  createInstallationUuid,
  detectGuestPlatform,
  getOrCreateInstallationId,
} from "@/shared/lib/guestInstallation";
import { useAuthStore } from "@/shared/store/useAuthStore";
import { useGuestStore } from "@/shared/store/useGuestStore";

let guestLoginPromise: ReturnType<typeof loginAsGuest> | null = null;

function loginAsGuestOnce(deviceId: string, platform: "WEB" | "ANDROID") {
  if (!guestLoginPromise) {
    guestLoginPromise = loginAsGuest({ deviceId, platform }).catch((error) => {
      guestLoginPromise = null;
      throw error;
    });
  }

  return guestLoginPromise;
}

export default function GuestAuthBootstrap() {
  const hydrated = useAuthStore((state) => state.hydrated);
  const user = useAuthStore((state) => state.user);
  const setGuestSession = useGuestStore((state) => state.setGuestSession);

  useEffect(() => {
    if (!hydrated || user) {
      return;
    }

    const installationId = getOrCreateInstallationId(localStorage, createInstallationUuid);
    const platform = detectGuestPlatform(window.TimingAndroid);

    void loginAsGuestOnce(installationId, platform)
      .then((guest) => {
        setGuestSession(installationId, platform, guest);
      })
      .catch((error) => {
        console.error("[guestAuth] guest login failed", error);
      });
  }, [hydrated, setGuestSession, user]);

  return null;
}
