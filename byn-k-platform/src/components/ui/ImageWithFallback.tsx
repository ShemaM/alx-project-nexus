'use client'

import React, { useState } from 'react'
import Image from 'next/image'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

interface ImageWithFallbackProps {
  src?: string
  alt?: string
  className?: string
  style?: React.CSSProperties
  /** Mark as priority to preload (for above-the-fold images like hero) */
  priority?: boolean
  /** Fill the parent container (requires parent to have position: relative) */
  fill?: boolean
  /** Sizes attribute for responsive images */
  sizes?: string
  /** Quality of the optimized image (1-100) */
  quality?: number
}

export function ImageWithFallback({ 
  src, 
  alt = '', 
  className, 
  style,
  priority = false,
  fill = false,
  sizes = '100vw',
  quality = 75,
}: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false)

  const handleError = () => {
    setDidError(true)
  }

  if (didError || !src) {
    return (
      <div
        className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
        style={style}
      >
        <div className="flex items-center justify-center w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ERROR_IMG_SRC} alt="Error loading image" data-original-url={src} />
        </div>
      </div>
    )
  }

  // Use Next.js Image component for optimized loading
  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      style={style}
      fill={fill}
      sizes={sizes}
      quality={quality}
      priority={priority}
      onError={handleError}
    />
  )
}