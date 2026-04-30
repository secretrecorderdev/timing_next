"use client";

import Link from "next/link";
import Image from "next/image";
import { Text } from "../primitives/text/Text";
import { playNotificationSound, unlockNotificationSound } from "@/shared/lib/notificationSound";
import { useNotificationStore } from "@/shared/store/useNotificationStore";
import { useToastStore } from "@/shared/store/useToastStore";

export function Header() {
  const { showToast } = useToastStore();
  const soundEnabled = useNotificationStore((state) => state.soundEnabled);
  const setSoundEnabled = useNotificationStore((state) => state.setSoundEnabled);

  const handlePrepareClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    showToast("준비중입니다");
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
        <button
          type="button"
          onClick={() => void handleToggleSound()}
          className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${soundEnabled ? "border-blue-300 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}
        >
          소리 {soundEnabled ? "ON" : "OFF"}
        </button>
        {/* <div className="flex items-center gap-2 whitespace-nowrap text-sm text-gray-700">
          <Link href="" onClick={handlePrepareClick} className="hover:underline">
            로그인
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="" onClick={handlePrepareClick} className="hover:underline">
            회원가입
          </Link>
        </div> */}
      </div>
    </header>
  );
}
