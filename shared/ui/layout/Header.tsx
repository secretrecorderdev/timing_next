"use client";

import Link from "next/link";
import Image from "next/image";
import { Text } from "../primitives/text/Text";
import { useToastStore } from "@/shared/store/useToastStore";

export function Header() {
  const { showToast } = useToastStore();

  const handlePrepareClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    showToast("준비중입니다");
  };

  return (
    <header className="w-full px-0 py-3 flex justify-between items-center border-b border-white/10">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-1 text-primary font-bold me-2"
        >
          <Image
            src="/assets/images/header/logo_image_green.png"
            alt="타이밍 로고"
            width={36}
            height={36}
            priority
            className="w-auto h-9 me-2 mt-2"
          />
          <Text as="span" size="xl" variant="heading">
            The
          </Text>
          <Text as="span" color="primary" size="xl" variant="heading">
            Timing
          </Text>
        </Link>

        <div className="flex items-center gap-1 text-primary font-bold mt-1">
          <Text as="span" size="md" variant="heading">
            주식은
          </Text>
          <Text className="mt-0" as="span" color="primary" size="md" variant="heading">
            타이밍
          </Text>
        </div>
      </div>

      <div className="flex gap-4 items-center text-sm font-semibold me-0">
        <Link href="" onClick={handlePrepareClick} className="hover:underline">
          로그인
        </Link>
        |
        <Link href="" onClick={handlePrepareClick} className="hover:underline">
          회원가입
        </Link>
      </div>
    </header>
  );
}
