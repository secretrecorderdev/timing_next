import clsx from "clsx";
import type { ReactNode } from "react";

interface CommonDetailGridItem {
  label: ReactNode;
  value: ReactNode;
}

interface CommonDetailGridProps {
  items: CommonDetailGridItem[];
  className?: string;
  itemClassName?: string;
  labelClassName?: string;
  valueClassName?: string;
}

export default function CommonDetailGrid({
  items,
  className,
  itemClassName,
  labelClassName,
  valueClassName,
}: CommonDetailGridProps) {
  return (
    <div className={clsx("flex flex-col gap-3", className)}>
      {items.map((item, index) => (
        <div
          key={index}
          className={clsx(
            "grid grid-cols-1 gap-y-1 rounded-xl bg-gray-50 px-4 py-3 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-x-3 sm:gap-y-0",
            itemClassName,
          )}
        >
          <div className={clsx("text-sm font-medium text-gray-500", labelClassName)}>
            {item.label}
          </div>
          <div className={clsx("break-words text-left text-base font-semibold text-gray-900 sm:text-right", valueClassName)}>
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}

export type { CommonDetailGridItem };
