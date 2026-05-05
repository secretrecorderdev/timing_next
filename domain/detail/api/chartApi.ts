import { apiRequest } from "@/shared/api/axiosRequest";
import type { DailyCloseChartItem } from "@/domain/detail/types/chart";

function normalizeDailyCloseChart(payload: unknown): DailyCloseChartItem[] {
  if (Array.isArray(payload)) {
    return payload as DailyCloseChartItem[];
  }

  if (payload && typeof payload === "object") {
    const maybeData = (payload as { data?: unknown }).data;
    if (Array.isArray(maybeData)) {
      return maybeData as DailyCloseChartItem[];
    }
  }

  return [];
}

export async function fetchDailyCloseChart(input: {
  code: string;
  startDate: number;
  endDate: number;
}): Promise<DailyCloseChartItem[]> {
  const payload = await apiRequest<unknown, typeof input>("/chart/daily-close", {
    method: "POST",
    body: input,
  });

  return normalizeDailyCloseChart(payload);
}
