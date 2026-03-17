import React, { HTMLAttributes, ReactNode } from 'react'

export type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  level?: 1 | 2 | 3
  children?: ReactNode
}

const LEVEL_CLASSES = {
  1: 'heading-xl',
  2: 'heading-lg',
  3: 'heading-md',
} as const

const COMPONENTS = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
} as const

/** Stateful heading helper that applies semantic sizes via utility classes. */
export const Heading: React.FC<HeadingProps> = ({ level = 1, className = '', children, ...rest }) => {
  const Component = COMPONENTS[level]
  const classes = `${LEVEL_CLASSES[level]} ${className}`.trim()

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  )
}

export default Heading
