import { ElementType, ComponentPropsWithoutRef } from 'react'
import clsx from 'clsx'
import { textColorMap } from '@/ui/lib/colors'
import { ColorType } from '@/ui/lib/colors' 
export type TextVariant = 'heading' | 'body' | 'caption' | 'label'
export type TextSize = 'sm' | 'md' | 'lg'

export type TextProps<T extends ElementType = 'p'> = {
  as?: T
  variant?: TextVariant
  size?: TextSize
  color?: ColorType
  className?: string
  children: React.ReactNode
} & ComponentPropsWithoutRef<T>

export const Text = <T extends ElementType = 'p'>({
  as,
  variant = 'body',
  size = 'md',
  color = 'default',
  className,
  children,
  ...rest
}: TextProps<T>) => {
  const Component = as || 'p'

  const base = 'leading-relaxed'
  const variantClass = {
    heading: 'font-bold',
    body: 'font-normal',
    caption: 'text-xs',
    label: 'uppercase tracking-wide font-medium',
  }[variant]

  const sizeClass = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }[size]

  const colorClass = [
    textColorMap[color]?.default,
    textColorMap[color]?.hover,
    textColorMap[color]?.active,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Component
      className={clsx(base, variantClass, sizeClass, colorClass, className)}
      {...rest}
    >
      {children}
    </Component>
  )
}
