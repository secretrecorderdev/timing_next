import Link from 'next/link'

import Image from "next/image";
import { Text } from '../atom/text/Text';

export function Header() {
  return (
    <header className="w-full px-4 py-3 flex justify-between items-center border-b border-white/10 bg-bgDark">
      {/* 왼쪽: 로고 */}
      <div className="flex items-center gap-4">
        {/* 왼쪽: 로고 + The Timing */}
        <Link
          href="/"
          className="flex items-center gap-1 text-primary font-bold me-4"
        >
          <Image
            src="/assets/images/header/logo_image_green.png"
            alt="이벤트 PC 배너"
            width={36}
            height={36}
            priority
            className="w-auto h-9 me-2"
          />
          <Text as="span" size="xg" variant="heading">
            The
          </Text>
          <Text as="span" color="primary" size="xg" variant="heading">
            Timing
          </Text>
        </Link>

        {/* 오른쪽: 한글 텍스트 */}
        <div className="flex items-center gap-1 text-primary font-bold">
          <Text as="span" size="md" variant="heading">
            주식은
          </Text>
          <Text as="span" color="primary" size="md" variant="heading">
            타이밍
          </Text>
        </div>
      </div>

      {/* 오른쪽: 로그인 / 회원가입 */}
      <div className="flex gap-4 items-center text-sm me-8">
        <Link href="" className="hover:underline">
          로그인
        </Link>
        |
        <Link href="" className="hover:underline">
          회원가입
        </Link>
      </div>
    </header>
  );
}