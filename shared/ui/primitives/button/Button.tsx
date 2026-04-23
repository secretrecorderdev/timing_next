import clsx from "clsx";
import type { ColorType } from "@/shared/ui/colors";
import { bgColorMap, borderColorMap, textColorMap } from "@/shared/ui/colors";

export type ButtonSize = "sm" | "md" | "lg";
export type ButtonVariant = "filled" | "outline";

interface ButtonProps {
  color?: ColorType;
  size?: ButtonSize;
  variant?: ButtonVariant;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

export function Button({
  color = "primary",
  size = "md",
  variant = "filled",
  disabled = false,
  onClick,
  children,
  className,
}: ButtonProps) {
  const base = "rounded-md font-semibold focus:outline-none transition cursor-pointer";

  const sizeClasses = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-4 py-2",
    lg: "text-lg px-5 py-3",
  };

  const isOutline = variant === "outline";

  const textClass = disabled
    ? textColorMap[color].disabled || textColorMap[color].default
    : isOutline
      ? [
          textColorMap[color].default,
          textColorMap[color].hover,
          textColorMap[color].active,
        ]
          .filter(Boolean)
          .join(" ")
      : "text-white";

  const bgClass = isOutline
    ? "bg-transparent"
    : disabled
      ? bgColorMap[color].disabled || bgColorMap[color].default
      : [bgColorMap[color].default, bgColorMap[color].hover, bgColorMap[color].active]
          .filter(Boolean)
          .join(" ");

  const borderClass = isOutline
    ? disabled
      ? borderColorMap[color].disabled || borderColorMap[color].default
      : [borderColorMap[color].default, borderColorMap[color].hover, borderColorMap[color].active]
          .filter(Boolean)
          .join(" ")
    : "border border-transparent";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={clsx(base, sizeClasses[size], textClass, bgClass, borderClass, {
        "opacity-50 cursor-not-allowed": disabled,
      }, className)}
    >
      {children}
    </button>
  );
}
