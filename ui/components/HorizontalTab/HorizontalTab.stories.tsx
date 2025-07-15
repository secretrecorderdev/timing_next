import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import HorizontalTabs, { TabItem } from './HorizontalTab';
// import { useArgs } from '@storybook/preview-api';
import { colorTypes } from '@/ui/lib/colors';

const meta: Meta<typeof HorizontalTabs> = {
  title: 'Components/HorizontalTabs',
  component: HorizontalTabs,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: { type: 'select' },
      options: colorTypes,
    },
  },
};

export default meta;
type Story = StoryObj<typeof HorizontalTabs>;

const tabs: TabItem[] = [
  { key: 'tab1', label: '탭 1' },
  { key: 'tab2', label: '탭 2' },
  { key: 'tab3', label: '탭 3' },
];

export const Controlled: Story = {
  render: (args) => {
    const [activeKey, setActiveKey] = useState(args.activeKey);

    return (
      <HorizontalTabs
        {...args}
        activeKey={activeKey}
        onChange={(key) => {
          setActiveKey(key);
          console.log('선택된 탭:', key);
        }}
      />
    );
  },
  args: {
    tabs,
    activeKey: 'tab1',
    color: 'primary',
  },
};

// export const Controlled: Story = {
//   render: (args) => {
//     const [, updateArgs] = useArgs();

//     return (
//       <HorizontalTabs
//         {...args}
//         onChange={(key) => {
//           updateArgs({ activeKey: key });
//           console.log('선택된 탭:', key);
//         }}
//       />
//     );
//   },
//   args: {
//     tabs,
//     activeKey: 'tab1',
//     color: 'primary', 
//   },
// };