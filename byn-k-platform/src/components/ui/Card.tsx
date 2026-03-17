import React, { HTMLAttributes, ReactNode } from 'react'

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode
}

/** Simplistic styled card wrapper that syncs with the global card class. */
export const Card: React.FC<CardProps> = ({ children, className = '', ...rest }) => (
  <div className={`card ${className}`.trim()} {...rest}>
    {children}
  </div>
)

export default Card
