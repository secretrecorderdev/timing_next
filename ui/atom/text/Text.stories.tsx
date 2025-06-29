import type { Meta, StoryObj } from '@storybook/nextjs'
import { Text } from './Text'
import type { TextVariant, TextSize } from './Text'
import { textColorMap } from '@/ui/lib/colors'
import { ColorType } from '@/ui/lib/colors' 

const meta: Meta<typeof Text> = {
  title: 'Atom/Text',
  component: Text,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['heading', 'body', 'caption', 'label'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'muted', 'error', 'success', 'default'],
    },
    as: {
      control: 'select',
      options: ['p', 'span', 'h1', 'h2', 'label'],
    },
  },
  args: {
    children: 'Sample text',
    variant: 'body',
    size: 'md',
    color: 'default',
    as: 'p',
  },
}
export default meta

type Story = StoryObj<typeof Text>

export const Default: Story = {}

export const AllColors: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {Object.keys(textColorMap).map((color) => (
        <Text key={color} color={color as ColorType}>
          Text color: {color}
        </Text>
      ))}
    </div>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {['heading', 'body', 'caption', 'label'].map((v) => (
        <Text key={v} variant={v as TextVariant}>
          This is {v}
        </Text>
      ))}
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {['sm', 'md', 'lg'].map((s) => (
        <Text key={s} size={s as TextSize}>
          This is size {s}
        </Text>
      ))}
    </div>
  ),
}
