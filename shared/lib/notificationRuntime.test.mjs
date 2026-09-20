import assert from "node:assert/strict";
import test from "node:test";

import { detectNotificationRuntime } from "./notificationRuntime.ts";

const desktopNavigator = { userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", platform: "Win32", maxTouchPoints: 0 };

test("Android native bridge를 Android 앱으로 우선 판별한다", () => {
  assert.equal(
    detectNotificationRuntime({ androidBridge: { getPlatform: () => "ANDROID" }, navigator: desktopNavigator }),
    "ANDROID_APP",
  );
});

test("iOS native bridge 분기를 준비한다", () => {
  assert.equal(
    detectNotificationRuntime({ iosBridge: { getPlatform: () => "IOS" }, navigator: desktopNavigator }),
    "IOS_APP",
  );
});

test("Android userAgent는 native bridge가 없을 때 Android 웹으로만 판별한다", () => {
  assert.equal(
    detectNotificationRuntime({
      navigator: { userAgent: "Mozilla/5.0 (Linux; Android 14)", platform: "Linux armv8l", maxTouchPoints: 5 },
    }),
    "ANDROID_WEB",
  );
});

test("iPhone과 터치 가능한 iPad 데스크톱 UA를 iOS 웹으로 판별한다", () => {
  assert.equal(
    detectNotificationRuntime({
      navigator: { userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0)", platform: "iPhone", maxTouchPoints: 5 },
    }),
    "IOS_WEB",
  );
  assert.equal(
    detectNotificationRuntime({
      navigator: { userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X)", platform: "MacIntel", maxTouchPoints: 5 },
    }),
    "IOS_WEB",
  );
});

test("모바일 식별 정보가 없는 브라우저는 PC 웹으로 판별한다", () => {
  assert.equal(detectNotificationRuntime({ navigator: desktopNavigator }), "DESKTOP_WEB");
});
