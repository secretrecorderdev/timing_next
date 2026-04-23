import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useEffect } from 'react';
import GlobalToast from './GlobalToast';
import { useToastStore } from '@/shared/store/useToastStore';
import { Button } from '@/shared/ui/primitives/button/Button';

function ToastStoryDemo() {
  const { showToast, hideToast } = useToastStore();

  useEffect(() => {
    hideToast();
  }, [hideToast]);

  return (
    <div className="flex min-h-[220px] w-[420px] flex-col items-center justify-center gap-4 rounded-2xl bg-gray-100 p-8">
      <GlobalToast />
      <Button onClick={() => showToast('클립보드에 복사했습니다')}>토스트 띄우기</Button>
      <Button color="muted" variant="outline" onClick={hideToast}>토스트 닫기</Button>
    </div>
  );
}

const meta = {
  title: 'shared/ui/feedback/GlobalToast',
  component: ToastStoryDemo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '전역 토스트 피드백 컴포넌트. 복사 완료 같은 짧은 메시지를 노출한다.',
      },
    },
  },
} satisfies Meta<typeof ToastStoryDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
