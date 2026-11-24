import { apiRequest } from "@/shared/api/axiosRequest";
import { normalizeRiskDailyResponse } from "@/domain/risk/types/riskDaily";

export async function fetchRiskDaily() {
  const payload = await apiRequest<unknown>("/risk/daily", { method: "GET" });
  return normalizeRiskDailyResponse(payload);
}
