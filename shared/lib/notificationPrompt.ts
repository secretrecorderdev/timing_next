import type { NotificationRuntime } from "@/shared/lib/notificationRuntime";

export const ANDROID_NOTIFICATION_PROMPT_SNOOZE_KEY =
  "timing-android-notification-prompt-snooze-until";

const NOTIFICATION_PROMPT_SNOOZE_MILLIS = 7 * 24 * 60 * 60 * 1000;

interface AndroidNotificationPromptInput {
  runtime: NotificationRuntime;
  notificationEnabled: boolean;
  snoozeUntil: string | null;
  now?: number;
}

export function getAndroidNotificationToggleAction(
  notificationEnabled: boolean,
): "OPEN_PROMPT" | "DISABLE" {
  return notificationEnabled ? "DISABLE" : "OPEN_PROMPT";
}

export function createNotificationPromptSnoozeUntil(now = Date.now()): number {
  return now + NOTIFICATION_PROMPT_SNOOZE_MILLIS;
}

export function shouldShowAndroidNotificationPrompt({
  runtime,
  notificationEnabled,
  snoozeUntil,
  now = Date.now(),
}: AndroidNotificationPromptInput): boolean {
  if (runtime !== "ANDROID_APP" || notificationEnabled) {
    return false;
  }

  const parsedSnoozeUntil = Number(snoozeUntil);
  return !snoozeUntil || !Number.isFinite(parsedSnoozeUntil) || parsedSnoozeUntil <= now;
}
