import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Header } from '@/shared/ui/layout/Header';
import NavBar from '@/shared/ui/layout/NavBar';
import { TradeList } from '@/shared/ui/components/trade/TradeList';
import type { TradeItem } from '@/shared/ui/components/trade/trade.types';

const sampleItems: TradeItem[] = Array.from({ length: 120 }, (_, index) => ({
  code: `${String(5930 + index).padStart(6, '0')}`,
  name: `샘플 종목 ${index + 1}`,
  buyState: index % 4,
  buyPrice: 52000 + index * 110,
  currentPrice: 53000 + index * 95,
  holdingDays: (index % 20) + 1,
  buyDateTime: `2026-04-${String((index % 28) + 1).padStart(2, '0')} 09:${String(index % 60).padStart(2, '0')}`,
  profit: Number((((index % 13) - 6) * 1.17).toFixed(2)),
}));

function TimingPageScreen() {
  return (
    <div className="mx-auto min-h-screen max-w-screen-lg bg-white px-4 py-2 text-black">
      <Header />
      <NavBar />
      <TradeList items={sampleItems} height={820} />
    </div>
  );
}

const meta = {
  title: 'pages/timing/Page',
  component: TimingPageScreen,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '타이밍 첫 화면 기준의 페이지 스토리. 헤더, 네비게이션, 거래 리스트를 한 번에 본다.',
      },
    },
  },
} satisfies Meta<typeof TimingPageScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
