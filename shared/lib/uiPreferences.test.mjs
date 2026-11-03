import assert from "node:assert/strict";
import test from "node:test";
import { readUiPreferences, writeUiPreferences, UI_PREFERENCES_STORAGE_KEY } from "./uiPreferences.ts";

function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}

test("매매 필터·간략보기·소리만 저장하고 다시 읽는다", () => {
  const storage = memoryStorage();
  const preferences = { tradeTypeFilter: "short", viewMode: "compact", soundEnabled: true };
  writeUiPreferences(storage, { ...preferences, pushEnabled: true, token: "not-a-real-token", items: ["temporary"] });
  assert.deepEqual(readUiPreferences(storage), preferences);
  assert.deepEqual(JSON.parse(storage.getItem(UI_PREFERENCES_STORAGE_KEY)), { version: 1, ...preferences });
});

test("저장값이 없거나 손상되었으면 안전한 기본값으로 복원한다", () => {
  const defaults = { tradeTypeFilter: "all", viewMode: "detailed", soundEnabled: false };
  assert.deepEqual(readUiPreferences(null), defaults);
  const storage = memoryStorage();
  for (const raw of [null, "{broken", "null", "[]", "true", '"compact"', '{"version":2,"soundEnabled":true}', '{"soundEnabled":true}']) {
    storage.setItem(UI_PREFERENCES_STORAGE_KEY, raw);
    assert.deepEqual(readUiPreferences(storage), defaults);
  }
});

test("각 필드의 타입·허용값을 검증하고 알 수 없는 속성은 무시한다", () => {
  const storage = memoryStorage();
  storage.setItem(UI_PREFERENCES_STORAGE_KEY, JSON.stringify({
    version: 1, tradeTypeFilter: "invalid", viewMode: "compact", soundEnabled: "true", pushEnabled: true,
  }));
  assert.deepEqual(readUiPreferences(storage), { tradeTypeFilter: "all", viewMode: "compact", soundEnabled: false });
  for (const tradeTypeFilter of ["all", "buy", "short"]) {
    for (const viewMode of ["compact", "detailed"]) {
      for (const soundEnabled of [true, false]) {
        const preferences = { tradeTypeFilter, viewMode, soundEnabled };
        writeUiPreferences(storage, preferences);
        assert.deepEqual(readUiPreferences(storage), preferences);
      }
    }
  }
});

test("localStorage 읽기·쓰기 실패가 사용자 조작을 중단시키지 않는다", () => {
  const storage = {
    getItem() { throw new Error("SecurityError"); },
    setItem() { throw new Error("QuotaExceededError"); },
  };
  assert.deepEqual(readUiPreferences(storage), { tradeTypeFilter: "all", viewMode: "detailed", soundEnabled: false });
  assert.doesNotThrow(() => writeUiPreferences(storage, { tradeTypeFilter: "buy", viewMode: "compact", soundEnabled: true }));
  assert.doesNotThrow(() => writeUiPreferences(null, { tradeTypeFilter: "all", viewMode: "detailed", soundEnabled: false }));
});
