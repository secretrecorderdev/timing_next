import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Card } from './Card';
import { Button } from '@/shared/ui/primitives/button/Button';
import { Text } from '@/shared/ui/primitives/text/Text';

const meta = {
  title: 'shared/ui/primitives/card/Card',
  component: Card,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '기본 카드 프리미티브. title, description, custom content 조합을 확인한다.',
      },
    },
  },
  args: {
    title: '오늘의 매매 요약',
    description: '관심 종목과 손익 현황을 카드 형태로 노출한다.',
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <Text>
        스토리북에서 공통 카드 간격, 라운드, 그림자 톤을 우선 검증한다.
      </Text>
    ),
  },
};

export const RichContent: Story = {
  render: () => (
    <Card title="알림" description="급등 후보 3개가 감지됐습니다.">
      <div className="space-y-4">
        <div className="space-y-1">
          <Text variant="heading" size="lg">코스닥 거래량 급증</Text>
          <Text color="muted">체결 강도와 거래량이 동반 상승한 종목 위주로 선별했습니다.</Text>
        </div>
        <div className="flex gap-2">
          <Button size="sm">상세 보기</Button>
          <Button size="sm" variant="outline" color="secondary">관심 종목 추가</Button>
        </div>
      </div>
    </Card>
  ),
};
