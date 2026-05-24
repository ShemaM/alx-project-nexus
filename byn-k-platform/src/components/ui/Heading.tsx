import React, { HTMLAttributes, ReactNode } from 'react'

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  level?: HeadingLevel
  children?: ReactNode
}

const LEVEL_CLASSES: Record<HeadingLevel, string> = {
  1: 'heading-xl',   // 48px / 700
  2: 'heading-lg',   // 36px / 600
  3: 'heading-md',   // 24px / 600
  4: 'text-xl font-semibold leading-snug',
  5: 'text-base font-semibold leading-snug',
  6: 'text-sm font-semibold leading-snug uppercase tracking-wide',
}

const COMPONENTS = {
  1: 'h1', 2: 'h2', 3: 'h3', 4: 'h4', 5: 'h5', 6: 'h6',
} as const

/** Semantic heading with consistent sizing across h1–h6. */
export const Heading: React.FC<HeadingProps> = ({ level = 1, className = '', children, ...rest }) => {
  const Component = COMPONENTS[level]
  const classes = [LEVEL_CLASSES[level], className].filter(Boolean).join(' ')

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  )
}

export default Heading
