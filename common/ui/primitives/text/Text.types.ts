import { ElementType, ComponentPropsWithoutRef } from "react"
import { ColorMap } from "@/common/ui/colors"

/**
 * 텍스트의 의미에 따라 스타일을 나누는 Variant 타입입니다.
 * 디자인 시스템 내에서 일관된 텍스트 스타일링을 위해 사용합니다.
 *
 * - `heading`: 페이지 제목이나 섹션 제목에 사용됩니다.
 * - `body`: 일반 본문 텍스트에 사용됩니다.
 * - `caption`: 이미지 설명, 날짜 등 보조 설명 텍스트에 사용됩니다.
 * - `label`: 입력 폼 항목 등 인터페이스 라벨에 사용됩니다.
 * jang, 2025-07-02
 */
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
