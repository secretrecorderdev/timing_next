import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";

const meta: Meta<typeof Card> = {
  title: "ATOM/Card",
  component: Card,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    title: "기본 카드",
    description: "이건 카드의 설명입니다.",
    children: <p>카드 안의 내용입니다.</p>,
  },
};

export const WithCustomClass: Story = {
  args: {
    title: "파란 배경 카드",
    className: "bg-blue-100",
    children: <div>배경이 파란 카드입니다.</div>,
  },
};