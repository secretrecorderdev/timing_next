import { proxyPostToBackend } from "@/common/api/proxy";

export async function postHoldRoute() {
  return proxyPostToBackend("/stock/getHoldList", undefined, "Hold API proxy failed");
}
