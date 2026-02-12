/**
 * Navigation Link Component
 * 
 * A wrapper around Next.js Link that shows a loading spinner when clicked.
 * Provides visual feedback during page transitions for better UX.
 * 
 * @module components/ui/NavLink
 */
'use client'

import React, { useState, useCallback, useEffect, ReactNode } from 'react'
import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'

interface NavLinkProps extends LinkProps {
  children: ReactNode
  className?: string
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
  showSpinner?: boolean
}

export function NavLink({ 
  children, 
  className = '', 
  onClick,
  showSpinner = true,
  ...props 
}: NavLinkProps) {
  const [isNavigating, setIsNavigating] = useState(false)
  const pathname = usePathname()

  // Reset loading state when pathname changes
  useEffect(() => {
    setIsNavigating(false)
  }, [pathname])

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    // Don't show loading for same-page links or external links
    const href = typeof props.href === 'string' ? props.href : props.href.pathname
    if (href === pathname || href?.startsWith('http') || href?.startsWith('#')) {
      onClick?.(e)
      return
    }
    
    if (showSpinner) {
      setIsNavigating(true)
    }
    onClick?.(e)
  }, [onClick, pathname, props.href, showSpinner])

  return (
    <Link 
      {...props} 
      className={`${className} ${isNavigating ? 'pointer-events-none opacity-70' : ''}`}
      onClick={handleClick}
    >
      {isNavigating && showSpinner ? (
        <span className="inline-flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin"></span>
          {children}
        </span>
      ) : (
        children
      )}
    </Link>
  )
}

export default NavLink
