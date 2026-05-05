"use client";

import CommonModal from "@/shared/ui/components/common/CommonModal";
import { Button } from "@/shared/ui/primitives/button/Button";
import { useSignalInboxStore } from "@/shared/store/useSignalInboxStore";

const toneClassNameMap = {
  default: "border-gray-200 bg-gray-50 text-gray-800",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  danger: "border-red-200 bg-red-50 text-red-800",
  info: "border-cyan-200 bg-cyan-50 text-cyan-800",
} as const;

export default function SignalInboxModal() {
  const open = useSignalInboxStore((state) => state.open);
  const items = useSignalInboxStore((state) => state.items);
  const currentIndex = useSignalInboxStore((state) => state.currentIndex);
  const prevItem = useSignalInboxStore((state) => state.prevItem);
  const nextItem = useSignalInboxStore((state) => state.nextItem);
  const confirmCurrent = useSignalInboxStore((state) => state.confirmCurrent);

  const currentItem = items[currentIndex] ?? null;

  if (!currentItem) {
    return null;
  }

  return (
    <CommonModal
      open={open}
      title="실시간 신호"
      confirmText="확인"
      hideCancelButton
      closeOnBackdropClick={false}
      onConfirm={confirmCurrent}
      onCancel={confirmCurrent}
      panelClassName="max-w-lg"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
          <span>{currentIndex + 1} / {items.length}</span>
          <span>{currentItem.source ?? "signal-inbox"}</span>
        </div>

        <div className={`rounded-2xl border px-4 py-4 ${toneClassNameMap[currentItem.tone]}`}>
          <div className="text-base font-semibold">{currentItem.title}</div>
          <div className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">
            {currentItem.body ?? "-"}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <Button
            color="default"
            variant="outline"
            onClick={prevItem}
            disabled={currentIndex <= 0}
          >
            이전
          </Button>
          <Button
            color="default"
            variant="outline"
            onClick={nextItem}
            disabled={currentIndex >= items.length - 1}
          >
            다음
          </Button>
        </div>
      </div>
    </CommonModal>
  );
}
