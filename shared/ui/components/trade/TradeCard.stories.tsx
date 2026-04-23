import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TradeCard } from './TradeCard';
import { TradeList } from './TradeList';
import type { TradeItem } from './trade.types';

const baseItem: TradeItem = {
  code: '005930',
  name: '삼성전자',
  buyState: 1,
  buyPrice: 58400,
  currentPrice: 61200,
  holdingDays: 7,
  buyDateTime: '2026-04-16 09:12',
  profit: 4.79,
};

const tradeItems: TradeItem[] = [
  baseItem,
  {
    ...baseItem,
    code: '000660',
    name: 'SK하이닉스',
    buyState: 3,
    buyPrice: 201500,
    currentPrice: 196000,
    holdingDays: 4,
    buyDateTime: '2026-04-19 10:05',
    profit: -2.73,
  },
  {
    ...baseItem,
    code: '035420',
    name: 'NAVER',
    buyState: 0,
    buyPrice: 0,
    currentPrice: 183500,
    holdingDays: 0,
    buyDateTime: '2026-04-23 11:40',
    profit: 0,
  },
];

const meta = {
  title: 'shared/ui/components/trade/TradeCard',
  component: TradeCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '매매 카드 컴포넌트. 수익/손실/미확정 상태와 리스트 배치를 함께 검증한다.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl bg-gray-50 p-6">
        <Story />
      </div>
    ),
  ],
  args: {
    item: baseItem,
  },
} satisfies Meta<typeof TradeCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Profit: Story = {};

export const Loss: Story = {
  args: {
    item: tradeItems[1],
  },
};

export const Pending: Story = {
  args: {
    item: tradeItems[2],
  },
};

export const List: Story = {
  render: () => <TradeList items={tradeItems} />,
};
