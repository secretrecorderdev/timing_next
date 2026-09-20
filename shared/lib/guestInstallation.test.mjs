import assert from "node:assert/strict";
import test from "node:test";

import {
  createInstallationUuid,
  detectGuestPlatform,
  getOrCreateInstallationId,
  INSTALLATION_ID_STORAGE_KEY,
  LEGACY_GUEST_DEVICE_ID_STORAGE_KEY,
} from "./guestInstallation.ts";

test("비보안 HTTP WebView에서도 getRandomValues로 UUID를 생성한다", () => {
  const bytes = Uint8Array.from([
    0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77,
    0x88, 0x99, 0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff,
  ]);
  const cryptoWithoutRandomUuid = {
    getRandomValues(target) {
      target.set(bytes);
      return target;
    },
  };

  assert.equal(
    createInstallationUuid(cryptoWithoutRandomUuid),
    "00112233-4455-4677-8899-aabbccddeeff",
  );
});

class MemoryStorage {
  values = new Map();

  getItem(key) {
    return this.values.get(key) ?? null;
  }

  setItem(key, value) {
    this.values.set(key, value);
  }
}

test("기존 installationId를 재사용한다", () => {
  const storage = new MemoryStorage();
  storage.setItem(INSTALLATION_ID_STORAGE_KEY, "existing-installation-id");
  let generated = false;

  const installationId = getOrCreateInstallationId(storage, () => {
    generated = true;
    return "new-installation-id";
  });

  assert.equal(installationId, "existing-installation-id");
  assert.equal(generated, false);
});

test("installationId가 없으면 UUID를 한 번 생성해 저장한다", () => {
  const storage = new MemoryStorage();

  const installationId = getOrCreateInstallationId(storage, () => "generated-installation-id");

  assert.equal(installationId, "generated-installation-id");
  assert.equal(storage.getItem(INSTALLATION_ID_STORAGE_KEY), "generated-installation-id");
});

test("기존 guest device id를 installationId로 이전해 재사용한다", () => {
  const storage = new MemoryStorage();
  storage.setItem(LEGACY_GUEST_DEVICE_ID_STORAGE_KEY, "legacy-device-id");

  const installationId = getOrCreateInstallationId(storage, () => "new-installation-id");

  assert.equal(installationId, "legacy-device-id");
  assert.equal(storage.getItem(INSTALLATION_ID_STORAGE_KEY), "legacy-device-id");
});

test("명시적인 Android 브리지가 ANDROID를 반환할 때만 Android WebView로 판별한다", () => {
  assert.equal(detectGuestPlatform({ getPlatform: () => "ANDROID" }), "ANDROID");
  assert.equal(detectGuestPlatform({ getPlatform: () => "android" }), "ANDROID");
  assert.equal(detectGuestPlatform({ getPlatform: () => "WEB" }), "WEB");
  assert.equal(detectGuestPlatform(undefined), "WEB");
});
