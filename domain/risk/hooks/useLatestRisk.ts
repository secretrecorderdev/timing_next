import { useQuery } from "@tanstack/react-query";
import { fetchLatestRisk } from "@/domain/risk/api/riskApi";

export function useLatestRisk() {
  return useQuery({
    queryKey: ["latestRisk"],
    queryFn: fetchLatestRisk,
    staleTime: 1000 * 60,
  });
}
