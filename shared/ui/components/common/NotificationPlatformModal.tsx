"use client";

import {
  APP_STORE_URL,
  GOOGLE_PLAY_URL,
  type NotificationRuntime,
} from "@/shared/lib/notificationRuntime";
import CommonModal from "@/shared/ui/components/common/CommonModal";
import { Text } from "@/shared/ui/primitives/text/Text";

interface NotificationPlatformModalProps {
  open: boolean;
  runtime: Exclude<NotificationRuntime, "ANDROID_APP"> | null;
  onClose: () => void;
}

const storeButtonClass =
  "inline-flex min-h-10 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90";

export default function NotificationPlatformModal({
  open,
  runtime,
  onClose,
}: NotificationPlatformModalProps) {
  const showGooglePlay = runtime === "ANDROID_WEB" || runtime === "DESKTOP_WEB";
  const showAppStore = runtime === "IOS_WEB" || runtime === "DESKTOP_WEB";

  return (
    <CommonModal
      open={open}
      title="알림 설정"
      cancelText="닫기"
      hideConfirmButton
      onCancel={onClose}
    >
      <div className="space-y-4">
        {runtime === "IOS_APP" ? (
          <Text size="sm" color="muted">
            iOS 앱 알림 설정은 추후 지원할 예정입니다.
          </Text>
        ) : (
          <Text size="sm" color="muted">
            앱 푸시 알림은 타이밍 앱에서만 사용할 수 있습니다. 사용하는 기기에 맞는 앱을 설치해 주세요.
          </Text>
        )}

        {showGooglePlay || showAppStore ? (
          <div className="flex flex-col gap-2 sm:flex-row">
            {showGooglePlay ? (
              <a
                href={GOOGLE_PLAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={storeButtonClass}
              >
                {runtime === "ANDROID_WEB" ? "Google Play로 이동" : "Android 앱 설치"}
              </a>
            ) : null}
            {showAppStore ? (
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={storeButtonClass}
              >
                {runtime === "IOS_WEB" ? "App Store로 이동" : "iPhone 앱 설치"}
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </CommonModal>
  );
}
