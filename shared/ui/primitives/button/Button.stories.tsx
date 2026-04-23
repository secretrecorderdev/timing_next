import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from './Button';
import { colorTypes } from '@/shared/ui/colors';

const meta = {
  title: 'shared/ui/primitives/button/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: '공용 버튼 프리미티브. color, variant, size 조합을 빠르게 확인하기 위한 스토리.',
      },
    },
  },
  args: {
    children: '매수 시그널 보기',
    color: 'primary',
    size: 'md',
    variant: 'filled',
    disabled: false,
  },
  argTypes: {
    color: {
      control: 'select',
      options: colorTypes,
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'inline-radio',
      options: ['filled', 'outline'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Filled: Story = {};

export const Outline: Story = {
  args: {
    variant: 'outline',
    color: 'secondary',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    color: 'muted',
  },
};

export const AllColors: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {colorTypes.map((color) => (
        <Button key={color} color={color}>
          {color}
        </Button>
      ))}
    </div>
  ),
};
