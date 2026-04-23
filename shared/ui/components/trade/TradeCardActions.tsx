"use client";

import { MdContentCopy } from "react-icons/md";
import { SiNaver } from "react-icons/si";
import { BsGraphUp } from "react-icons/bs";
import Image from "next/image";
import { useToastStore } from "@/shared/store/useToastStore";

interface TradeCardActionsProps {
  code: string;
}

export function TradeCardActions({ code }: TradeCardActionsProps) {
  const { showToast } = useToastStore();
  const naverHref = `https://finance.naver.com/item/main.nhn?code=${code}`;
  const tossHref = `https://contents.tossinvest.com/stocks/A${code}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      showToast("클립보드에 복사했습니다");
    } catch {
      showToast("복사에 실패했습니다");
    }
  };

  return (
    <div className="flex justify-end gap-3 mt-3 text-lg">
      <BsGraphUp title="차트 보기" className="cursor-pointer text-gray-500" />
      <button type="button" onClick={handleCopy} title="복사하기" className="inline-flex items-center">
        <MdContentCopy className="cursor-pointer text-gray-600" />
      </button>
      <a
        href={naverHref}
        target="_blank"
        rel="noreferrer noopener"
        title="네이버"
        className="inline-flex items-center"
      >
        <SiNaver className="cursor-pointer text-green-600" />
      </a>
      <a
        href={tossHref}
        target="_blank"
        rel="noreferrer noopener"
        title="토스증권"
        className="inline-flex items-center"
      >
        <Image
          src="/assets/images/icon/stock_toss.png"
          alt="Toss"
          width={20}
          height={20}
          style={{ width: "auto", height: "auto" }}
        />
      </a>
    </div>
  );
}
