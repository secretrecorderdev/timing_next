import { NextRequest } from "next/server";
import { proxyPostToBackend } from "@/common/api/proxy";

export async function postTimingRoute(request: NextRequest) {
  const body = await request.json();
  return proxyPostToBackend("/stock/getTimingList", body ?? {}, "Timing API proxy failed");
}
