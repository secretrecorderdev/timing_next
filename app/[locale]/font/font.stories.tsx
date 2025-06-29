import type { Meta, StoryObj } from '@storybook/nextjs';
import FontPage from './page';

// 폰트랑 컬러는 독스로 만들어야 하네 ㅎㅎ

// 아하 버튼 독스가 있구나 ㅎㅎ

const meta: Meta<typeof FontPage> = {
  title: 'Base/Fonts',
  component: FontPage,
//   tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FontPage>;

export const Default: Story = {

};