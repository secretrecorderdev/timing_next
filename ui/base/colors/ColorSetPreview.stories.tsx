import type { Meta, StoryObj } from '@storybook/nextjs';
import ColorPage from '../../page/ColorPreviewPage.ssg';

const meta: Meta<typeof ColorPage> = {
  title: 'Base/Colors',
  component: ColorPage,
//   tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ColorPage>;

export const Default: Story = {
  args: {
    label: 'text',
  },
};