"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { BsGraphUp } from "react-icons/bs";
import { MdContentCopy } from "react-icons/md";
import { SiNaver } from "react-icons/si";
import { useToastStore } from "@/shared/store/useToastStore";

interface TradeActionButtonsProps {
  code: string;
  className?: string;
}

export function TradeActionButtons({ code, className }: TradeActionButtonsProps) {
  const router = useRouter();
  const pathname = usePathname() ?? "/ko/timing";
  const { showToast } = useToastStore();
  const naverHref = `https://finance.naver.com/item/main.nhn?code=${code}`;
  const tossHref = `https://contents.tossinvest.com/stocks/A${code}`;
  const localeMatch = pathname.match(/^\/(ko|en)(?=\/|$)/);
  const localePrefix = localeMatch?.[0] ?? "/ko";

  const handleCopy = async (event?: React.MouseEvent) => {
    event?.stopPropagation();

    try {
      await navigator.clipboard.writeText(code);
      showToast("클립보드에 복사되었습니다");
    } catch {
      showToast("복사에 실패했습니다");
    }
  };

  const handleChartClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    router.push(`${localePrefix}/item?code=${code}`);
  };

  return (
    <div className={className ?? "mt-1 flex flex-wrap justify-center gap-2 sm:mt-1 sm:justify-center sm:gap-2.5"}>
      <button
        type="button"
        onClick={handleChartClick}
        title="차트 보기"
        className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
      >
        <BsGraphUp className="cursor-pointer text-[24px] text-gray-500 sm:text-[28px]" />
      </button>
      <button
        type="button"
        onClick={handleCopy}
        title="복사하기"
        className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
      >
        <MdContentCopy className="cursor-pointer text-[24px] text-gray-600 sm:text-[28px]" />
      </button>
      <a
        href={naverHref}
        target="_blank"
        rel="noreferrer noopener"
        title="네이버"
        className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
        onClick={(event) => event.stopPropagation()}
      >
        <SiNaver className="cursor-pointer text-[24px] text-green-600 sm:text-[28px]" />
      </a>
      <a
        href={tossHref}
        target="_blank"
        rel="noreferrer noopener"
        title="토스증권"
        className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
        onClick={(event) => event.stopPropagation()}
      >
        <Image
          src="/assets/images/icon/stock_toss.png"
          alt="Toss"
          width={28}
          height={28}
          className="h-6 w-6 cursor-pointer sm:h-7 sm:w-7"
        />
      </a>
    </div>
  );
}
