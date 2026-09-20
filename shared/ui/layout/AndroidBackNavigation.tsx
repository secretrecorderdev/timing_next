"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { handleAndroidBack } from "@/shared/lib/androidBackNavigation";
import { closeTopmostCommonModal } from "@/shared/lib/commonModalBackStack";
import { detectNotificationRuntime } from "@/shared/lib/notificationRuntime";
import CommonModal from "@/shared/ui/components/common/CommonModal";
import { Text } from "@/shared/ui/primitives/text/Text";

export default function AndroidBackNavigation() {
  const pathname = usePathname() ?? "/ko/timing";
  const router = useRouter();
  const [exitModalOpen, setExitModalOpen] = useState(false);

  useEffect(() => {
    const runtime = detectNotificationRuntime({
      androidBridge: window.TimingAndroid,
      iosBridge: window.TimingIOS,
      navigator,
    });

    if (runtime !== "ANDROID_APP") {
      return;
    }

    const handleBack = () => {
      handleAndroidBack({
        closeTopmostModal: closeTopmostCommonModal,
        pathname,
        navigateBack: () => router.back(),
        openExitConfirmation: () => setExitModalOpen(true),
      });
    };

    window.__timingHandleAndroidBack = handleBack;

    return () => {
      if (window.__timingHandleAndroidBack === handleBack) {
        delete window.__timingHandleAndroidBack;
      }
    };
  }, [pathname, router]);

  const handleExit = () => {
    const bridge = window.TimingAndroid;
    if (typeof bridge?.finishApp !== "function") {
      console.error("[navigation] Android finishApp bridge is unavailable");
      return;
    }

    bridge.finishApp();
  };

  return (
    <CommonModal
      open={exitModalOpen}
      title="앱 종료"
      confirmText="종료"
      cancelText="취소"
      closeOnBackdropClick={false}
      onConfirm={handleExit}
      onCancel={() => setExitModalOpen(false)}
    >
      <Text size="sm" color="muted" className="leading-6">
        타이밍 앱을 종료하시겠습니까?
      </Text>
      <div
        aria-label="향후 광고 영역"
        data-ad-placeholder="true"
        className="mt-4 min-h-24 rounded-xl border border-dashed border-gray-200 bg-gray-50"
      />
    </CommonModal>
  );
}
