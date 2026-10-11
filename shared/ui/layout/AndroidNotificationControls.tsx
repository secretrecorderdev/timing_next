"use client";

import { useEffect, useState } from "react";
import { detectNotificationRuntime } from "@/shared/lib/notificationRuntime";
import {
  getTimingAndroidBridgeClient,
  isTimingAndroidApp,
} from "@/shared/lib/timingAndroidBridge";
import {
  ANDROID_NOTIFICATION_PROMPT_SNOOZE_KEY,
  createNotificationPromptSnoozeUntil,
  shouldShowAndroidNotificationPrompt,
} from "@/shared/lib/notificationPrompt";
import CommonModal from "@/shared/ui/components/common/CommonModal";
import { Header } from "@/shared/ui/layout/Header";
import { Text } from "@/shared/ui/primitives/text/Text";
import Image from "next/image"

export default function AndroidNotificationControls() {
  const [isAndroidApp, setIsAndroidApp] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);

  useEffect(() => {
    const bridge = getTimingAndroidBridgeClient();
    const runtime = detectNotificationRuntime({
      isAndroidApp: isTimingAndroidApp(),
      iosBridge: window.TimingIOS,
      navigator,
    });

    if (runtime !== "ANDROID_APP" || !bridge) {
      return;
    }

    let cancelled = false;
    const openTimer = window.setTimeout(() => {
      void bridge
        .getNotificationEnabled()
        .then((enabled) => {
          if (cancelled) return;

          const snoozeUntil = localStorage.getItem(ANDROID_NOTIFICATION_PROMPT_SNOOZE_KEY);
          setIsAndroidApp(true);
          setNotificationEnabled(enabled);
          setPromptOpen(
            shouldShowAndroidNotificationPrompt({
              runtime,
              notificationEnabled: enabled,
              snoozeUntil,
            }),
          );
        })
        .catch((error) => {
          console.error("[notification] failed to initialize Android notification prompt", error);
        });
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(openTimer);
    };
  }, []);

  const handleEnable = () => {
    const bridge = getTimingAndroidBridgeClient();
    if (!bridge) {
      return;
    }

    void bridge
      .setNotificationEnabled(true)
      .then(() => {
        setNotificationEnabled(true);
        setPromptOpen(false);
      })
      .catch((error) => {
        console.error("[notification] failed to enable Android notifications", error);
      });
  };

  const handleSnooze = () => {
    localStorage.setItem(
      ANDROID_NOTIFICATION_PROMPT_SNOOZE_KEY,
      String(createNotificationPromptSnoozeUntil()),
    );
    setPromptOpen(false);
  };

  return (
    <>
      <Header
        isAndroidApp={isAndroidApp}
        androidNotificationEnabled={notificationEnabled}
        onOpenAndroidNotificationPrompt={() => setPromptOpen(true)}
        onAndroidNotificationDisabled={() => setNotificationEnabled(false)}
      />
      <CommonModal
        open={promptOpen}
        title="푸시 알림 안내"
        confirmText="알림 켜기"
        cancelText="일주일 동안 보지 않기"
        closeOnBackdropClick={false}
        onConfirm={handleEnable}
        onCancel={handleSnooze}
        onBack={() => setPromptOpen(false)}
      >
        <Text size="sm" color="muted" className="leading-6">
          푸시 알림을 허용하면 실시간 매수/매도 발생 시 푸시 알림이 발송됩니다.
        </Text>
        <Image
          src="/assets/images/common/ex_push.png"
          alt="푸시 알림 예시"
          width={320}
          height={180}
        />
        <Text size="sm" color="muted" className="leading-6">
          알림 발송은 알림 ON/OFF 버튼으로 언제든지 등록/해제할 수 있습니다.
        </Text>
      </CommonModal>
    </>
  );
}
