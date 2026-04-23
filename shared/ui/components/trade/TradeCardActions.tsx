import { MdContentCopy } from "react-icons/md";
import { SiNaver } from "react-icons/si";
import { BsGraphUp } from "react-icons/bs";
import Image from "next/image";

export function TradeCardActions() {
  return (
    <div className="flex justify-end gap-3 mt-3 text-lg">
      <BsGraphUp title="차트 보기" className="cursor-pointer text-gray-500" />
      <MdContentCopy title="복사하기" className="cursor-pointer text-gray-600" />
      <SiNaver title="네이버" className="cursor-pointer text-green-600" />
      <Image
        src="/assets/images/icon/stock_toss.png"
        alt="Toss"
        width={20}
        height={20}
        style={{ width: "auto", height: "auto" }}
      />
    </div>
  );
}
