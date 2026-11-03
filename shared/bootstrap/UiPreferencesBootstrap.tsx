"use client";

import { useEffect } from "react";
import { readUiPreferences, writeUiPreferences } from "@/shared/lib/uiPreferences";
import { useTradeViewStore } from "@/shared/store/useTradeViewStore";
import { useNotificationStore } from "@/shared/store/useNotificationStore";

export function UiPreferencesBootstrap() {
  useEffect(() => {
    let storage: Storage;
    try {
      storage = window.localStorage;
    } catch {
      return;
    }

    // Restore after hydration, before subscribing, so defaults cannot overwrite saved choices.
    const preferences = readUiPreferences(storage);
    useTradeViewStore.setState({
      tradeTypeFilter: preferences.tradeTypeFilter,
      viewMode: preferences.viewMode,
    });
    useNotificationStore.getState().setSoundEnabled(preferences.soundEnabled);

    const save = () => {
      const { tradeTypeFilter, viewMode } = useTradeViewStore.getState();
      const { soundEnabled } = useNotificationStore.getState();
      writeUiPreferences(storage, { tradeTypeFilter, viewMode, soundEnabled });
    };
    const unsubscribeTradeView = useTradeViewStore.subscribe((state, previous) => {
      if (state.tradeTypeFilter !== previous.tradeTypeFilter || state.viewMode !== previous.viewMode) {
        save();
      }
    });
    const unsubscribeSound = useNotificationStore.subscribe((state, previous) => {
      if (state.soundEnabled !== previous.soundEnabled) save();
    });

    return () => {
      unsubscribeTradeView();
      unsubscribeSound();
    };
  }, []);

  return null;
}
