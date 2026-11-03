import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";
import * as preferences from "../lib/uiPreferences.ts";
import { useTradeViewStore } from "../store/useTradeViewStore.ts";
import { useNotificationStore } from "../store/useNotificationStore.ts";

const require = createRequire(import.meta.url);
const source = readFileSync(new URL("./UiPreferencesBootstrap.tsx", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS },
});

function mount(storage, { blocked = false, ssr = false } = {}) {
  let cleanup;
  const browser = {};
  Object.defineProperty(browser, "localStorage", { get() { if (blocked) throw new Error("SecurityError"); return storage; } });
  const context = {
    exports: {},
    ...(ssr ? {} : { window: browser }),
    require: (id) => ({
      react: { useEffect: (effect) => { if (!ssr) cleanup = effect(); } },
      "@/shared/lib/uiPreferences": preferences,
      "@/shared/store/useTradeViewStore": { useTradeViewStore },
      "@/shared/store/useNotificationStore": { useNotificationStore },
    })[id] ?? require(id),
  };
  vm.runInNewContext(outputText, context);
  assert.equal(context.exports.UiPreferencesBootstrap(), null);
  return () => cleanup?.();
}

function storageWith(value = null) {
  const values = new Map(value ? [[preferences.UI_PREFERENCES_STORAGE_KEY, JSON.stringify(value)]] : []);
  const writes = [];
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => { values.set(key, value); writes.push(key); }, writes };
}
function resetStores() {
  useTradeViewStore.setState({ tradeTypeFilter: "all", viewMode: "detailed" });
  useNotificationStore.getState().clearNotifications();
  useNotificationStore.getState().setSoundEnabled(false);
}

test("진입 시 설정을 복원하고 조작한 세 설정을 재진입해도 유지한다", () => {
  resetStores();
  const storage = storageWith({ version: 1, tradeTypeFilter: "short", viewMode: "compact", soundEnabled: true, pushEnabled: true });
  const unmount = mount(storage);
  try {
    assert.equal(useTradeViewStore.getState().tradeTypeFilter, "short");
    assert.equal(useTradeViewStore.getState().viewMode, "compact");
    assert.equal(useNotificationStore.getState().soundEnabled, true);
    assert.equal(storage.writes.length, 0, "초기 기본값으로 기존 설정을 덮어쓰지 않는다");
    useTradeViewStore.getState().cycleTradeTypeFilter();
    useTradeViewStore.getState().toggleViewMode();
    useNotificationStore.getState().setSoundEnabled(false);
    assert.deepEqual(preferences.readUiPreferences(storage), { tradeTypeFilter: "all", viewMode: "detailed", soundEnabled: false });
    assert.deepEqual([...new Set(storage.writes)], [preferences.UI_PREFERENCES_STORAGE_KEY]);
    assert.deepEqual(Object.keys(JSON.parse(storage.getItem(preferences.UI_PREFERENCES_STORAGE_KEY))).sort(), ["soundEnabled", "tradeTypeFilter", "version", "viewMode"]);
  } finally { unmount(); }
  useTradeViewStore.setState({ tradeTypeFilter: "buy", viewMode: "compact" });
  useNotificationStore.getState().setSoundEnabled(true);
  const unmountAgain = mount(storage);
  try {
    assert.equal(useTradeViewStore.getState().tradeTypeFilter, "all");
    assert.equal(useTradeViewStore.getState().viewMode, "detailed");
    assert.equal(useNotificationStore.getState().soundEnabled, false);
  } finally { unmountAgain(); resetStores(); }
});

test("일시 알림 변경은 저장하지 않고 언마운트 시 구독을 해제한다", () => {
  resetStores();
  const storage = storageWith();
  const unmount = mount(storage);
  try {
    const id = useNotificationStore.getState().showNotification({ title: "일시 알림" });
    useNotificationStore.getState().hideNotification(id);
    useNotificationStore.getState().clearNotifications();
    assert.equal(storage.writes.length, 0);
    useTradeViewStore.getState().toggleViewMode();
    assert.equal(storage.writes.length, 1);
  } finally { unmount(); }
  useTradeViewStore.getState().toggleViewMode();
  useNotificationStore.getState().toggleSoundEnabled();
  assert.equal(storage.writes.length, 1);
  resetStores();
});

test("SSR에서는 localStorage에 접근하지 않으며 접근 차단 시에도 렌더링한다", () => {
  resetStores();
  assert.doesNotThrow(() => mount(null, { blocked: true, ssr: true })());
  assert.doesNotThrow(() => mount(null, { blocked: true })());
  assert.doesNotThrow(() => useTradeViewStore.getState().toggleViewMode());
  resetStores();
});
