import React, { HTMLAttributes, ReactNode } from 'react'

export type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode
}

/** Centered content wrapper matching the CSS container utility for consistent padding. */
export const Container: React.FC<ContainerProps> = ({ children, className = '', ...rest }) => (
  <div className={`container ${className}`.trim()} {...rest}>
    {children}
  </div>
)

export default Container
