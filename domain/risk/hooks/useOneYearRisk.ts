import { useQuery } from "@tanstack/react-query";
import { fetchRiskHistory } from "@/domain/risk/api/riskApi";

export function useOneYearRisk(startDate?: string, endDate?: string, enabled = true) {
  return useQuery({
    queryKey: ["riskHistory", startDate ?? "", endDate ?? ""],
    queryFn: () => fetchRiskHistory({ startDate, endDate }),
    enabled,
    staleTime: 1000 * 60,
  });
}
