import ItemPageClient from "@/domain/item/ItemPageClient";
import { getTodayDateInTimeZone } from "@/shared/lib/dateRange";

export default function Item() {
  const today = getTodayDateInTimeZone();

  return <ItemPageClient today={today} />;
}
