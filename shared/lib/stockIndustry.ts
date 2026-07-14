export function formatStockIndustryLabel(
  sector?: string | null,
  primaryIndustry?: string | null,
) {
  if (!sector) {
    return null;
  }

  if (sector === "지주회사" && primaryIndustry) {
    return `${sector} · ${primaryIndustry}`;
  }

  return sector;
}