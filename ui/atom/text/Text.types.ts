import { ElementType, ComponentPropsWithoutRef } from "react"
import { ColorMap } from "@/ui/lib/colors"

export type TextVariant = "heading" | "body" | "caption" | "label"

export type TextSize = "sm" | "md" | "lg"

export type TextProps<T extends ElementType = "p"> = {
    as?: T;
    varient?: TextVariant
    size?: TextSize
    color?: ColorMap
    className?: string
    children: React.ReactNode
} & ComponentPropsWithoutRef<T>;
