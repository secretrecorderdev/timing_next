import type { TradeTypeFilter, TradeViewMode } from "@/shared/store/useTradeViewStore";

export const UI_PREFERENCES_STORAGE_KEY = "timing-ui-preferences";

export interface UiPreferences {
  tradeTypeFilter: TradeTypeFilter;
  viewMode: TradeViewMode;
  soundEnabled: boolean;
}

type PreferencesStorage = Pick<Storage, "getItem" | "setItem">;

export function readUiPreferences(storage: PreferencesStorage | null): UiPreferences {
  const defaults: UiPreferences = { tradeTypeFilter: "all", viewMode: "detailed", soundEnabled: false };
  if (!storage) return defaults;
  try {
    const value: unknown = JSON.parse(storage.getItem(UI_PREFERENCES_STORAGE_KEY) ?? "null");
    if (!value || typeof value !== "object" || Array.isArray(value)) return defaults;
    const fields = value as Record<string, unknown>;
    if (fields.version !== 1) return defaults;
    return {
      tradeTypeFilter: fields.tradeTypeFilter === "all" || fields.tradeTypeFilter === "buy" || fields.tradeTypeFilter === "short"
        ? fields.tradeTypeFilter : defaults.tradeTypeFilter,
      viewMode: fields.viewMode === "compact" || fields.viewMode === "detailed" ? fields.viewMode : defaults.viewMode,
      soundEnabled: typeof fields.soundEnabled === "boolean" ? fields.soundEnabled : defaults.soundEnabled,
    };
  } catch {
    return defaults;
  }
}

export function writeUiPreferences(storage: PreferencesStorage | null, preferences: UiPreferences): void {
  try {
    storage?.setItem(UI_PREFERENCES_STORAGE_KEY, JSON.stringify({
      version: 1,
      tradeTypeFilter: preferences.tradeTypeFilter,
      viewMode: preferences.viewMode,
      soundEnabled: preferences.soundEnabled,
    }));
  } catch {
    // Keep the in-memory controls usable when browser storage is unavailable/full.
  }
}
