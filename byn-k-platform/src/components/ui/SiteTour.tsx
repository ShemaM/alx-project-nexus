/**
 * Site Tour Component
 * 
 * Guided tour overlay for first-time visitors.
 * Highlights key features and provides onboarding guidance.
 * 
 * Features:
 * - Step-by-step guidance
 * - Spotlight effect on target elements
 * - Skip and navigation controls
 * - Responsive design
 * 
 * @module components/ui/SiteTour
 */
'use client'

import React, { useEffect, useState, useRef } from 'react'
import { X, ChevronLeft, ChevronRight, SkipForward } from 'lucide-react'
import { useSiteTour, TourStep } from '@/contexts/SiteTourContext'

// ============================================
// Tooltip Component
// ============================================

interface TooltipProps {
  step: TourStep
  currentStep: number
  totalSteps: number
  onNext: () => void
  onPrev: () => void
  onSkip: () => void
  position: { top: number; left: number }
}

function TourTooltip({ 
  step, 
  currentStep, 
  totalSteps, 
  onNext, 
  onPrev, 
  onSkip,
  position 
}: TooltipProps) {
  return (
    <div
      className="fixed z-[10001] w-80 bg-white rounded-xl shadow-2xl border border-gray-100 animate-fade-in"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900 text-lg">
          {step.title}
        </h3>
        <button
          onClick={onSkip}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
          aria-label="Close tour"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-gray-600 text-sm leading-relaxed">
          {step.content}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-4 pt-0">
        {/* Progress */}
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentStep ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {currentStep > 0 && (
            <button
              onClick={onPrev}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}
          
          {currentStep < totalSteps - 1 ? (
            <>
              <button
                onClick={onSkip}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <SkipForward className="w-4 h-4" />
                Skip
              </button>
              <button
                onClick={onNext}
                className="flex items-center gap-1 px-4 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={onNext}
              className="px-4 py-1.5 text-sm text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              Get Started! 🚀
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Main Site Tour Component
// ============================================

/**
 * Site Tour overlay component
 * Place this component at the root of your app
 */
export function SiteTour() {
  const { isOpen, currentStep, steps, nextStep, prevStep, skipTour } = useSiteTour()
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const overlayRef = useRef<HTMLDivElement>(null)

  // Find and highlight the target element
  useEffect(() => {
    if (!isOpen || !steps[currentStep]) return

    const step = steps[currentStep]
    const targetElement = document.querySelector(step.target)

    if (targetElement) {
      const rect = targetElement.getBoundingClientRect()
      setTargetRect(rect)

      // Calculate tooltip position based on placement
      const padding = 16
      let top = 0
      let left = 0

      switch (step.placement) {
        case 'top':
          top = rect.top - padding - 200 // Approximate tooltip height
          left = rect.left + rect.width / 2 - 160 // Center tooltip
          break
        case 'bottom':
          top = rect.bottom + padding
          left = rect.left + rect.width / 2 - 160
          break
        case 'left':
          top = rect.top + rect.height / 2 - 100
          left = rect.left - padding - 320 // Tooltip width
          break
        case 'right':
          top = rect.top + rect.height / 2 - 100
          left = rect.right + padding
          break
        default:
          top = rect.bottom + padding
          left = rect.left + rect.width / 2 - 160
      }

      // Keep tooltip within viewport
      top = Math.max(16, Math.min(top, window.innerHeight - 300))
      left = Math.max(16, Math.min(left, window.innerWidth - 336))

      setTooltipPosition({ top, left })

      // Scroll target into view
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } else {
      setTargetRect(null)
      setTooltipPosition({ top: window.innerHeight / 2 - 100, left: window.innerWidth / 2 - 160 })
    }
  }, [isOpen, currentStep, steps])

  if (!isOpen) return null

  const currentTourStep = steps[currentStep]

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[10000] bg-black/50 transition-opacity"
        onClick={skipTour}
      />

      {/* Spotlight (cut-out for target element) */}
      {targetRect && (
        <div
          className="fixed z-[10000] rounded-lg ring-4 ring-blue-500 ring-offset-4 pointer-events-none animate-pulse"
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
          }}
        />
      )}

      {/* Tooltip */}
      {currentTourStep && (
        <TourTooltip
          step={currentTourStep}
          currentStep={currentStep}
          totalSteps={steps.length}
          onNext={nextStep}
          onPrev={prevStep}
          onSkip={skipTour}
          position={tooltipPosition}
        />
      )}
    </>
  )
}

export default SiteTour
