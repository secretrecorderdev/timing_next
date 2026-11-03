import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { UiPreferencesBootstrap } from "./UiPreferencesBootstrap";
import { Header } from "@/shared/ui/layout/Header";
import GlobalNotification from "@/shared/ui/feedback/GlobalNotification";
import { TradeCard } from "@/shared/ui/components/trade/TradeCard";
import { useTradeViewStore } from "@/shared/store/useTradeViewStore";
import { useNotificationStore } from "@/shared/store/useNotificationStore";

function PreferencesPreview() {
  const tradeTypeFilter = useTradeViewStore((state) => state.tradeTypeFilter);
  const viewMode = useTradeViewStore((state) => state.viewMode);
  const soundEnabled = useNotificationStore((state) => state.soundEnabled);
  return (
    <div className="mx-auto max-w-4xl px-3">
      <UiPreferencesBootstrap />
      <GlobalNotification />
      <Header />
      <p className="my-4 text-sm text-gray-600">
        필터·보기·소리를 변경한 뒤 새로고침하여 복원을 확인합니다. 푸시는 저장하지 않습니다.
      </p>
      <output className="mb-4 block text-sm">{JSON.stringify({ tradeTypeFilter, viewMode, soundEnabled })}</output>
      <TradeCard item={{
        code: "005930", name: "샘플 종목", buyState: 1, buyPrice: 10000, currentPrice: 11000,
        holdingDays: 3, buyDateTime: "2026-11-03 09:00", profit: 10,
      }} />
    </div>
  );
}

const meta = {
  title: "shared/bootstrap/UiPreferences",
  component: PreferencesPreview,
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true, navigation: { pathname: "/ko/timing" } },
  },
} satisfies Meta<typeof PreferencesPreview>;
export default meta;
type Story = StoryObj<typeof meta>;
export const HeaderPreferences: Story = {};
