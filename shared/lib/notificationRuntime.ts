import type { TimingAndroidBridge } from "@/shared/lib/guestInstallation";

export type NotificationRuntime =
  | "ANDROID_APP"
  | "IOS_APP"
  | "ANDROID_WEB"
  | "IOS_WEB"
  | "DESKTOP_WEB";

export interface TimingIosBridge {
  getPlatform?: () => string;
}

interface NavigatorLike {
  userAgent: string;
  platform?: string;
  maxTouchPoints?: number;
}

interface NotificationRuntimeInput {
  androidBridge?: TimingAndroidBridge;
  iosBridge?: TimingIosBridge;
  navigator: NavigatorLike;
}

function bridgePlatform(bridge?: { getPlatform?: () => string }) {
  try {
    return bridge?.getPlatform?.().toUpperCase();
  } catch {
    return undefined;
  }
}

export function detectNotificationRuntime({
  androidBridge,
  iosBridge,
  navigator,
}: NotificationRuntimeInput): NotificationRuntime {
  if (bridgePlatform(androidBridge) === "ANDROID") {
    return "ANDROID_APP";
  }
  if (bridgePlatform(iosBridge) === "IOS") {
    return "IOS_APP";
  }

  const userAgent = navigator.userAgent;
  if (/Android/i.test(userAgent)) {
    return "ANDROID_WEB";
  }

  const isIosUserAgent = /iPhone|iPad|iPod/i.test(userAgent);
  const isDesktopModeIpad = navigator.platform === "MacIntel" && (navigator.maxTouchPoints ?? 0) > 1;
  if (isIosUserAgent || isDesktopModeIpad) {
    return "IOS_WEB";
  }

  return "DESKTOP_WEB";
}

export const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=com.myfarmus.app";
export const APP_STORE_URL = "https://apps.apple.com/kr/app/id6740599324";
