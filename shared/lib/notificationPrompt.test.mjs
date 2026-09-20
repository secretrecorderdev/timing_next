import assert from "node:assert/strict";
import test from "node:test";

import {
  createNotificationPromptSnoozeUntil,
  getAndroidNotificationToggleAction,
  shouldShowAndroidNotificationPrompt,
} from "./notificationPrompt.ts";

const NOW = 1_800_000_000_000;

test("알림을 켜는 동작은 안내 모달을 열고 끄는 동작은 즉시 비활성화한다", () => {
  assert.equal(getAndroidNotificationToggleAction(false), "OPEN_PROMPT");
  assert.equal(getAndroidNotificationToggleAction(true), "DISABLE");
});

test("Android 앱에서 알림이 꺼져 있고 숨김 기간이 없으면 안내한다", () => {
  assert.equal(
    shouldShowAndroidNotificationPrompt({
      runtime: "ANDROID_APP",
      notificationEnabled: false,
      snoozeUntil: null,
      now: NOW,
    }),
    true,
  );
});

test("Android 앱이 아니거나 알림이 이미 켜져 있으면 안내하지 않는다", () => {
  for (const runtime of ["ANDROID_WEB", "IOS_WEB", "IOS_APP", "DESKTOP_WEB"]) {
    assert.equal(
      shouldShowAndroidNotificationPrompt({
        runtime,
        notificationEnabled: false,
        snoozeUntil: null,
        now: NOW,
      }),
      false,
    );
  }

  assert.equal(
    shouldShowAndroidNotificationPrompt({
      runtime: "ANDROID_APP",
      notificationEnabled: true,
      snoozeUntil: null,
      now: NOW,
    }),
    false,
  );
});

test("일주일 동안 보지 않기 만료 전에는 숨기고 만료 후 다시 안내한다", () => {
  const snoozeUntil = createNotificationPromptSnoozeUntil(NOW);

  assert.equal(
    shouldShowAndroidNotificationPrompt({
      runtime: "ANDROID_APP",
      notificationEnabled: false,
      snoozeUntil: String(snoozeUntil),
      now: snoozeUntil - 1,
    }),
    false,
  );
  assert.equal(
    shouldShowAndroidNotificationPrompt({
      runtime: "ANDROID_APP",
      notificationEnabled: false,
      snoozeUntil: String(snoozeUntil),
      now: snoozeUntil,
    }),
    true,
  );
});
