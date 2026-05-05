import { apiRequest } from "@/shared/api/axiosRequest";
import type { TimingWindowRiskItem } from "@/domain/risk/types/risk";

function extractData(payload: unknown) {
  if (payload && typeof payload === "object") {
    return (payload as { data?: unknown }).data;
  }

  return null;
}

function normalizeLatestRiskResponse(payload: unknown): TimingWindowRiskItem | null {
  const maybeData = extractData(payload);

  if (maybeData && typeof maybeData === "object") {
    return maybeData as TimingWindowRiskItem;
  }

  return null;
}

function normalizeRiskHistoryResponse(payload: unknown): TimingWindowRiskItem[] {
  const maybeData = extractData(payload);

  if (Array.isArray(maybeData)) {
    return maybeData as TimingWindowRiskItem[];
  }

  return [];
}

export async function fetchLatestRisk(): Promise<TimingWindowRiskItem | null> {
  const payload = await apiRequest<unknown, Record<string, never>>("/risk/latest", {
    method: "POST",
    body: {},
  });

  return normalizeLatestRiskResponse(payload);
}

export interface RiskHistoryInput {
  startDate?: string;
  endDate?: string;
}

export async function fetchRiskHistory(input: RiskHistoryInput): Promise<TimingWindowRiskItem[]> {
  const payload = await apiRequest<unknown, RiskHistoryInput>("/risk/history", {
    method: "POST",
    body: {
      startDate: input.startDate,
      endDate: input.endDate,
    },
  });

  return normalizeRiskHistoryResponse(payload);
}
