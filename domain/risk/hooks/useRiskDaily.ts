import { useQuery } from "@tanstack/react-query";
import { fetchRiskDaily } from "@/domain/risk/api/riskDailyApi";

export function useRiskDaily(enabled = true) {
  return useQuery({
    queryKey: ["riskDaily"],
    queryFn: fetchRiskDaily,
    enabled,
    staleTime: 1000 * 60,
  });
}
