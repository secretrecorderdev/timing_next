import { type ComponentPropsWithoutRef, type ElementType } from "react";
import clsx from "clsx";
import { textColorMap, type ColorType } from "@/shared/ui/colors";

export type TextVariant = "heading" | "body" | "caption" | "label";
export type TextSize = "sm" | "md" | "lg" | "xl";

export type TextProps<T extends ElementType = "p"> = {
  as?: T;
  variant?: TextVariant;
  size?: TextSize;
  color?: ColorType;
  className?: string;
  children: React.ReactNode;
} & ComponentPropsWithoutRef<T>;

export function Text<T extends ElementType = "p">({
  as,
  variant = "body",
  size = "md",
  color = "default",
  className,
  children,
  ...rest
}: TextProps<T>) {
  const Component = as || "p";

  const base = "leading-relaxed";
  const variantClass = {
    heading: "font-bold",
    body: "font-normal",
    caption: "text-xs",
    label: "uppercase tracking-wide font-medium",
  }[variant];

  const sizeClass = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  }[size];

  const colorClass = textColorMap[color]?.default;

  return (
    <Component className={clsx(base, variantClass, sizeClass, colorClass, className)} {...rest}>
      {children}
    </Component>
  );
}
