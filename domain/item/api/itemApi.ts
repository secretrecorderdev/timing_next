import { apiRequest } from "@/shared/api/axiosRequest";
import type { KospiStockItem } from "@/domain/item/types/item";

function normalizeKospiStockList(payload: unknown): KospiStockItem[] {
  if (Array.isArray(payload)) {
    return payload as KospiStockItem[];
  }

  if (payload && typeof payload === "object") {
    const maybeData = (payload as { data?: unknown }).data;
    if (Array.isArray(maybeData)) {
      return maybeData as KospiStockItem[];
    }
  }

  return [];
}

export async function fetchKospiStockList(startDate = ""): Promise<KospiStockItem[]> {
  const form = new URLSearchParams();
  form.set("startDate", startDate);

  const payload = await apiRequest<unknown, string>("/stock/getKospiList", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
  });

  return normalizeKospiStockList(payload);
}
