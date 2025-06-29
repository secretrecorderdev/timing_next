import clsx from 'clsx'
// import type { ColorType } from '@/lib/constants/colorMap'
import type { ColorType } from '@/ui/lib/colors'
import { textColorMap, bgColorMap } from '@/ui/lib/colors'

export type SizeType = 'sm' | 'md' | 'lg'
export type StyleType = 'filled' | 'outline'

interface ButtonProps {
  variant?: ColorType
  size?: SizeType
  outline?:  boolean,
  disabled?: boolean
  onClick?: () => void
  className?: string
  children: React.ReactNode
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  outline = false,
  disabled = false,
  onClick,
  children,
  className
}: ButtonProps) => {
  const base = 'rounded-md font-semibold focus:outline-none transition cursor-pointer'

  console.log("사이즈", size)

  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-5 py-3',
  }

  const textClass = disabled
    ? textColorMap[variant].disabled || textColorMap[variant].default
    : outline
    ? [
        textColorMap[variant].default,
        textColorMap[variant].hover,
        textColorMap[variant].active,
      ]
        .filter(Boolean)
        .join(' ')
    : 'text-white'

  const bgClass =
    !outline
      ? disabled
        ? bgColorMap[variant].disabled || bgColorMap[variant].default
        : [
            bgColorMap[variant].default,
            bgColorMap[variant].hover,
            bgColorMap[variant].active,
          ]
            .filter(Boolean)
            .join(' ')
      : 'border border-current bg-transparent'
        
  console.log("폰트 클래스", clsx(base, sizeClasses[size], textClass, bgClass, {
        'opacity-50 cursor-not-allowed': disabled,
      }))
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`${clsx(base, sizeClasses[size], textClass, bgClass, {
        'opacity-50 cursor-not-allowed': disabled,
      })} ${className}` }
    >
      {children}
    </button>
  )
} 
