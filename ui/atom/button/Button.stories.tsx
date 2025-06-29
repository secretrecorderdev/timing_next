import type { Meta, StoryObj } from '@storybook/nextjs'
import { Button } from './Button'
import type { ColorType } from '@/ui/lib/colors'
import type { SizeType } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Atom/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'muted', 'error', 'success', 'default'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    outline: {
      control: 'select',
      options: [false, true],
    },
    disabled: {
      control: 'boolean',
    },
    onClick: { action: 'clicked' },
  },
  args: {
    children: '버튼',
    variant: 'primary',
    size: 'md',
    outline: false,
    disabled: false,
  },
}
export default meta

type Story = StoryObj<typeof Button>

export const Default: Story = {}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {['primary', 'secondary', 'muted', 'error', 'success'].map((v) => (
        <div key={v} className="flex gap-2 items-center">
          <Button variant={v as ColorType}>{v}</Button>
          <Button variant={v as ColorType} outline>
            {v} outline
          </Button>
          <Button variant={v as ColorType} disabled>
            {v} disabled
          </Button>
        </div>
      ))}
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex gap-4">
      {['sm', 'md', 'lg'].map((s) => (
        <Button key={s} size={s as SizeType}>
          size: {s}
        </Button>
      ))}
    </div>
  ),
}