// import TimingPageClient from "@/app/[locale]/timing/TimingPageClient";
import TimingPageClient from "@/domain/timing/TimingPageClient";
import { getTodayDateInTimeZone } from "@/shared/lib/dateRange";

export default function Timing() {
  const today = getTodayDateInTimeZone();

  return <TimingPageClient today={today} />;
}
