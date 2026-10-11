"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import { usePathname } from "next/navigation";
import { MdRefresh } from "react-icons/md";
import { getAuthMe } from "@/domain/auth/api/authApi";
import {
  detectNotificationRuntime,
  type NotificationRuntime,
} from "@/shared/lib/notificationRuntime";
import CommonModal from "@/shared/ui/components/common/CommonModal";
import NotificationPlatformModal from "@/shared/ui/components/common/NotificationPlatformModal";
import { Text } from "../primitives/text/Text";
import { playNotificationSound, unlockNotificationSound } from "@/shared/lib/notificationSound";
import { useAuthStore } from "@/shared/store/useAuthStore";
import { useNotificationStore } from "@/shared/store/useNotificationStore";
import { usePageRefreshStore } from "@/shared/store/usePageRefreshStore";
import { useToastStore } from "@/shared/store/useToastStore";
import { getPageRefreshTarget } from "@/shared/lib/pageRefresh";
import { getAndroidNotificationToggleAction } from "@/shared/lib/notificationPrompt";
import {
  getTimingAndroidBridgeClient,
  isTimingAndroidApp,
} from "@/shared/lib/timingAndroidBridge";

interface HeaderProps {
  isAndroidApp?: boolean;
  androidNotificationEnabled?: boolean;
  onOpenAndroidNotificationPrompt?: () => void;
  onAndroidNotificationDisabled?: () => void;
}

export function Header({
  isAndroidApp = false,
  androidNotificationEnabled = false,
  onOpenAndroidNotificationPrompt,
  onAndroidNotificationDisabled,
}: HeaderProps = {}) {
  const pathname = usePathname() ?? "/ko/timing";
  const localePrefix = pathname.match(/^\/(ko|en)(?=\/|$)/)?.[0] ?? "/ko";
  const refreshTarget = getPageRefreshTarget(pathname);
  const { showToast } = useToastStore();
  const requestRefresh = usePageRefreshStore((state) => state.requestRefresh);
  const soundEnabled = useNotificationStore((state) => state.soundEnabled);
  const setSoundEnabled = useNotificationStore((state) => state.setSoundEnabled);
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const hydrated = useAuthStore((state) => state.hydrated);
  const logout = useAuthStore((state) => state.logout);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isTestingAuth, setIsTestingAuth] = useState(false);
  const [notificationModalRuntime, setNotificationModalRuntime] = useState<
    Exclude<NotificationRuntime, "ANDROID_APP"> | null
  >(null);

  const getNotificationRuntime = () =>
    detectNotificationRuntime({
      isAndroidApp: isTimingAndroidApp(),
      iosBridge: window.TimingIOS,
      navigator,
    });


  const handleAuthTest = async () => {
    if (!token?.accessToken || isTestingAuth) {
      showToast("테스트할 access token이 없습니다.");
      return;
    }

    try {
      setIsTestingAuth(true);
      const result = await getAuthMe(token.accessToken);
      console.log("[jang][header] auth test success", result);
      showToast(`인증 테스트 성공: userId ${result.userId}`);
    } catch (error) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ?? `인증 테스트 실패(${status ?? "unknown"})`
        : "인증 테스트 실패";
      console.error("[jang][header] auth test failed", { status, error, message });
      showToast(message);
    } finally {
      setIsTestingAuth(false);
    }
  };

  const handleToggleSound = async () => {
    if (soundEnabled) {
      setSoundEnabled(false);
      showToast("알림 소리를 껐습니다");
      return;
    }

    const unlocked = await unlockNotificationSound();
    setSoundEnabled(unlocked);

    if (unlocked) {
      await playNotificationSound();
    }

    showToast(unlocked ? "알림 소리를 켰습니다" : "이 브라우저에서는 먼저 화면을 터치/클릭해야 소리가 납니다");
  };

  const handleNotificationClick = async () => {
    const runtime = getNotificationRuntime();
    if (runtime !== "ANDROID_APP") {
      setNotificationModalRuntime(runtime);
      return;
    }

    const bridge = getTimingAndroidBridgeClient();
    if (!bridge) {
      showToast("Android 앱 알림 기능이 아직 연결되지 않았습니다.");
      return;
    }

    try {
      const current = await bridge.getNotificationEnabled();
      if (getAndroidNotificationToggleAction(current) === "OPEN_PROMPT") {
        onOpenAndroidNotificationPrompt?.();
        return;
      }

      await bridge.setNotificationEnabled(false);
      onAndroidNotificationDisabled?.();
      showToast("푸시 알림을 껐습니다.");
    } catch (error) {
      console.error("[notification] failed to update Android notification status", error);
      showToast("푸시 알림 설정을 변경하지 못했습니다.");
    }
  };

  const handleRefresh = () => {
    if (refreshTarget) {
      requestRefresh(refreshTarget);
    }
  };

  return (
    <header className="flex w-full flex-col gap-3 border-b border-white/10 px-0 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2">
        <Link
          href="/"
          className="me-2 flex min-w-0 items-center gap-1 font-bold text-primary"
        >
          <Image
            src="/assets/images/header/logo_image_green.png"
            alt="타이밍 로고"
            width={36}
            height={36}
            priority
            className="me-2 mt-1 h-8 w-auto sm:mt-2 sm:h-9"
          />
          <Text as="span" size="xl" variant="heading">
            The
          </Text>
          <Text as="span" color="primary" size="xl" variant="heading">
            Timing
          </Text>
        </Link>

        <div className="mt-1 flex items-center gap-1 font-bold text-primary">
          <Text as="span" size="md" variant="heading">
            주식은
          </Text>
          <Text className="mt-0" as="span" color="primary" size="md" variant="heading">
            타이밍
          </Text>
        </div>
      </div>

      <div className="flex w-full flex-wrap items-center justify-between gap-2 text-sm font-semibold sm:w-auto sm:justify-end sm:gap-4">
        <div className="flex items-center gap-2">
          {/* <button
            type="button"
            onClick={() => void handleAuthTest()}
            className="rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:border-amber-300"
          >
            {isTestingAuth ? "인증 테스트중" : "인증 테스트"}
          </button> */}
          <button
            type="button"
            onClick={handleNotificationClick}
            className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${androidNotificationEnabled ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}
          >
            {isAndroidApp ? `알림 ${androidNotificationEnabled ? "ON" : "OFF"}` : "알림 ON/OFF"}
          </button>
          <button
            type="button"
            onClick={() => void handleToggleSound()}
            className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${soundEnabled ? "border-blue-300 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}
          >
            소리 {soundEnabled ? "ON" : "OFF"}
          </button>
          {refreshTarget ? (
            <button
              type="button"
              onClick={handleRefresh}
              aria-label="새로고침"
              title="새로고침"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:border-gray-300 hover:text-emerald-600"
            >
              <MdRefresh aria-hidden="true" className="h-5 w-5" />
            </button>
          ) : null}
        </div>
        {/* <div className="flex items-center gap-2 whitespace-nowrap text-sm text-gray-700">
          {!hydrated ? (
            <span className="text-xs text-gray-400">로그인 확인중...</span>
          ) : user ? (
            <>
              <span className="max-w-[160px] truncate text-sm text-gray-700">
                {user.nickName || "사용"}님
              </span>
              <span className="text-gray-300">|</span>
              <button
                type="button"
                onClick={() => setLogoutModalOpen(true)}
                className="hover:underline"
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link href={`${localePrefix}/login`} className="hover:underline">
              로그인
            </Link>
          )}
        </div> */}
      </div>

      <NotificationPlatformModal
        open={notificationModalRuntime !== null}
        runtime={notificationModalRuntime}
        onClose={() => setNotificationModalRuntime(null)}
      />

      <CommonModal
        open={logoutModalOpen}
        title="로그아웃"
        confirmText="로그아웃"
        cancelText="취소"
        onCancel={() => setLogoutModalOpen(false)}
        onConfirm={() => {
          logout();
          setLogoutModalOpen(false);
          showToast("로그아웃 되었습니다.");
        }}
      >
        <Text size="sm" color="muted">
          로그아웃 하시겠습니까?
        </Text>
      </CommonModal>
    </header>
  );
}
