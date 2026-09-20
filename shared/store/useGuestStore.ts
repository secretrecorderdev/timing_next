"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { GuestLoginResult } from "@/domain/auth/api/authApi";
import type { GuestPlatform } from "@/shared/lib/guestInstallation";

interface GuestState {
  installationId: string | null;
  platform: GuestPlatform | null;
  guest: GuestLoginResult | null;
  setGuestSession: (
    installationId: string,
    platform: GuestPlatform,
    guest: GuestLoginResult,
  ) => void;
}

export const useGuestStore = create<GuestState>()(
  persist(
    (set) => ({
      installationId: null,
      platform: null,
      guest: null,
      setGuestSession: (installationId, platform, guest) => {
        set({ installationId, platform, guest });
      },
    }),
    {
      name: "timing-guest-session",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
