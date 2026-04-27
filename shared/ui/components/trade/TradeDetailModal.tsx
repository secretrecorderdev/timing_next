"use client";

import CommonDetailGrid from "@/shared/ui/components/common/CommonDetailGrid";
import CommonModal from "@/shared/ui/components/common/CommonModal";
import { cn } from "@/shared/lib/CommonUtils";
import type { TradeItem } from "./trade.types";
import { TradeActionButtons } from "./TradeActionButtons";

interface TradeDetailModalProps {
  open: boolean;
  item: TradeItem | null;
  onClose: () => void;
}

function formatWon(value?: number | null) {
  if (value == null) return "-";
  return `${value.toLocaleString()}원`;
}

function formatSignedPercent(value?: number | null) {
  if (value == null) return "-";
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function getTradeStatusText(buyState: number, buyPrice: number) {
  switch (buyState) {
    case 1:
      return "매수";
    case 2:
      return `매수(${buyPrice.toLocaleString()}원, 매도됨)`;
    case 3:
      return "매도";
    default:
      return "매수(미확정)";
  }
}

function getTradeStatusColor(buyState: number) {
  switch (buyState) {
    case 1:
      return "text-red-500";
    case 2:
      return "text-gray-500";
    case 3:
      return "text-blue-500";
    default:
      return "text-purple-500";
  }
}

export function TradeDetailModal({ open, item, onClose }: TradeDetailModalProps) {
  if (!item) return null;

  const isBuyState = item.buyState === 1;
  const shouldShowSellFields = item.buyState === 2 || item.buyState === 3;
  const sellDateTime = item.buyState === 3 ? (item.timingDateTime ?? "") : (item.sellDateTime ?? "");
  const sellPrice = item.sellPrice;
  const detailItems = [
    { label: "매수 시간", value: item.buyDateTime && item.buyDateTime !== "-" ? item.buyDateTime : "" },
    { label: "매수 가격", value: formatWon(item.buyPrice) },
    ...(isBuyState
      ? [
          { label: "기준 시각", value: item.priceDateTime ?? "" },
          { label: "기준 시각 가격", value: formatWon(item.currentPrice) },
        ]
      : []),
    ...(shouldShowSellFields
      ? [
          { label: "매도 시간", value: sellDateTime },
          { label: "매도 가격", value: formatWon(sellPrice) },
        ]
      : []),
    { label: "보유 기간", value: `${item.holdingDays.toLocaleString()}일` },
    { label: "수익률", value: formatSignedPercent(item.profit) },
  ];

  return (
    <CommonModal
      open={open}
      title="수익률 정보"
      hideCancelButton
      onConfirm={onClose}
      onCancel={onClose}
      panelClassName="max-w-xl"
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1 px-1">
          <div className="text-lg font-semibold text-gray-900">{item.name} [{item.code}]</div>
          <div className={cn("text-sm font-medium", getTradeStatusColor(item.buyState))}>
            {getTradeStatusText(item.buyState, item.buyPrice)}
          </div>
        </div>
        <CommonDetailGrid items={detailItems} itemClassName="bg-gray-100" />
        <TradeActionButtons code={item.code} />
      </div>
    </CommonModal>
  );
}
