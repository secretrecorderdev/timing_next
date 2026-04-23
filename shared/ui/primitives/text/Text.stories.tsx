import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Text } from './Text';
import { colorTypes } from '@/shared/ui/colors';

const meta = {
  title: 'shared/ui/primitives/text/Text',
  component: Text,
  parameters: {
    docs: {
      description: {
        component: '타이포그래피 프리미티브. variant와 size 기준으로 톤을 비교한다.',
      },
    },
  },
  args: {
    children: '타이밍에서 포착한 매매 흐름을 확인하세요.',
    variant: 'body',
    size: 'md',
    color: 'default',
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['heading', 'body', 'caption', 'label'],
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    color: {
      control: 'select',
      options: colorTypes,
    },
    as: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Scale: Story = {
  render: () => (
    <div className="space-y-3">
      <Text variant="heading" size="xl">매수 후보 리포트</Text>
      <Text variant="body" size="lg">오늘 장중 흐름에서 거래량이 붙은 종목을 요약합니다.</Text>
      <Text variant="caption" size="sm" color="muted">데이터 기준 시각 2026-04-23 12:21</Text>
      <Text variant="label" size="md" color="primary">timing signal</Text>
    </div>
  ),
};

export const ColorVariants: Story = {
  render: () => (
    <div className="space-y-2">
      {colorTypes.map((color) => (
        <Text key={color} color={color}>
          {color} text sample
        </Text>
      ))}
    </div>
  ),
};
