import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTimingList } from "@/domain/timing/api/timingApi";
import type { TimingListItem } from "@/domain/timing/types/timing";
import { useNotificationStore } from "@/shared/store/useNotificationStore";
import { useTimingSignalStore } from "@/shared/store/useTimingSignalStore";

const POLLING_INTERVAL_MS = 10_000;
const POLLING_LIMIT = 100;
const MARKET_TIME_CHECK_INTERVAL_MS = 30_000;

function getSignalLabel(item: TimingListItem) {
  const buyState = Number(item.buyState ?? 0);

  if (buyState === 3) {
    return "매도";
  }

  return "매수";
}

function getSignalTone(item: TimingListItem) {
  const buyState = Number(item.buyState ?? 0);
  return buyState === 3 ? "info" : "danger";
}

function formatTimingDate(value?: string | null) {
  if (!value || value.length < 12) {
    return value ?? "-";
  }

  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)} ${value.slice(8, 10)}:${value.slice(10, 12)}`;
}

function resolveSignalPrice(item: TimingListItem) {
  const buyState = Number(item.buyState ?? 0);

  if (buyState === 3) {
    return item.sellPrice ?? item.currentPrice ?? item.buyPrice ?? null;
  }

  return item.buyPrice ?? item.currentPrice ?? item.sellPrice ?? null;
}

function formatSignalPrice(value?: number | null) {
  if (value == null) {
    return "-";
  }

  return value.toLocaleString();
}

function getKoreanTimeParts(nowSeed: number) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(new Date(nowSeed));
  const weekday = parts.find((part) => part.type === "weekday")?.value ?? "";
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? 0);

  return { weekday, hour, minute };
}

function formatKoreanDateTime(nowSeed: number) {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(nowSeed));
}

function isKoreanMarketOpen(nowSeed: number) {
  const { weekday, hour, minute } = getKoreanTimeParts(nowSeed);
  const isWeekday = ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(weekday);
  if (!isWeekday) {
    return false;
  }

  const totalMinutes = hour * 60 + minute;
  return totalMinutes >= 9 * 60 && totalMinutes <= 15 * 60 + 30;
}

export function useTimingSignalPolling() {
  const sessionStartDate = useTimingSignalStore((state) => state.sessionStartDate);
  const initializeSession = useTimingSignalStore((state) => state.initializeSession);
  const appendSignals = useTimingSignalStore((state) => state.appendSignals);
  const [nowSeed, setNowSeed] = useState(() => Date.now());
  const marketOpen = isKoreanMarketOpen(nowSeed);

  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNowSeed(Date.now());
    }, MARKET_TIME_CHECK_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (sessionStartDate != null && !marketOpen) {
      console.log("[timingSignalPolling:pass]", {
        nowKst: formatKoreanDateTime(nowSeed),
        reason: "outside-market-hours",
      });
    }
  }, [marketOpen, nowSeed, sessionStartDate]);

  const query = useQuery({
    queryKey: ["timingSignalPolling", sessionStartDate, marketOpen],
    enabled: sessionStartDate != null && marketOpen,
    queryFn: async () => {
      const { lastTimingDate, sessionStartDate: currentSessionStartDate } = useTimingSignalStore.getState();
      return fetchTimingList({
        startDate: lastTimingDate ?? currentSessionStartDate ?? undefined,
        limit: POLLING_LIMIT,
        offset: 0,
        polling: true,
      });
    },
    refetchInterval: marketOpen ? POLLING_INTERVAL_MS : false,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const incomingItems = query.data?.items ?? [];
    if (incomingItems.length === 0) {
      return;
    }

    const appendedItems = appendSignals(incomingItems);
    if (appendedItems.length === 0) {
      return;
    }

    const { showNotification } = useNotificationStore.getState();
    const newestFirstItems = [...appendedItems].sort((left, right) => (right.timingDate ?? "").localeCompare(left.timingDate ?? ""));

    newestFirstItems.forEach((item) => {
      showNotification({
        title: `[${item.code ?? "-"}] ${item.name ?? "이름없음"} ${getSignalLabel(item)}`,
        description: `가격: ${formatSignalPrice(resolveSignalPrice(item))} · 시각: ${formatTimingDate(item.timingDate)}`,
        tone: getSignalTone(item),
        sound: true,
      });
    });
  }, [appendSignals, query.dataUpdatedAt, query.data?.items]);

  return {
    sessionStartDate,
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
    refetch: query.refetch,
    marketOpen,
  };
}
