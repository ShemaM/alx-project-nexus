import { tokens } from '@/lib/tokens'
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  CSSProperties,
} from 'react'

type SharedButtonProps = {
  variant?: 'primary' | 'secondary'
  size?: 'md' | 'sm'
  fullWidth?: boolean
  className?: string
  style?: CSSProperties
}

type ButtonAsButton = SharedButtonProps & ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: undefined
}

type ButtonAsAnchor = SharedButtonProps & AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
}

export type ButtonProps = ButtonAsButton | ButtonAsAnchor

/** Reusable button/anchor wrapper that applies brand tokens and variant/size presets. */
export const Button = (props: ButtonProps) => {
  const {
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className = '',
    style,
    href,
    ...rest
  } = props

  const variantClass = variant === 'secondary' ? 'btn-secondary' : 'btn-primary'
  const sizeClass = size === 'sm' ? 'btn-small' : ''
  const classes = [
    variantClass,
    sizeClass,
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const mergedStyle: CSSProperties = {
    transitionTimingFunction: tokens.animation.ease,
    transitionDuration: `${tokens.animation.base}ms`,
    fontFamily: tokens.typography.headingLG.fontFamily,
    ...style,
  }

  if (href) {
    return (
      <a href={href} className={classes} style={mergedStyle} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)} />
    )
  }

  return (
    <button
      type="button"
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      className={classes}
      style={mergedStyle}
    />
  )
}

export default Button
