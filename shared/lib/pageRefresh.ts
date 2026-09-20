export type PageRefreshTarget = "timing" | "hold";

export function getPageRefreshTarget(pathname: string): PageRefreshTarget | null {
  if (/\/(ko|en)\/timing\/?$/.test(pathname)) {
    return "timing";
  }
  if (/\/(ko|en)\/hold\/?$/.test(pathname)) {
    return "hold";
  }
  return null;
}
