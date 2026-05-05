import DetailPageClient from "@/domain/detail/DetailPageClient";
import { getTodayDateInTimeZone } from "@/shared/lib/dateRange";

export default async function ItemDetail({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { code } = await params;
  const today = getTodayDateInTimeZone();

  return <DetailPageClient code={code} today={today} />;
}
