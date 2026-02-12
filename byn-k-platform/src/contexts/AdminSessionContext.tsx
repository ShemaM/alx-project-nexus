/**
 * Admin Session Context
 * 
 * Provides session management for admin users with automatic logout on inactivity.
 * The admin must login every time and will be logged out when the session is inactive.
 * 
 * Features:
 * - Automatic logout after configurable inactivity period (default: 15 minutes)
 * - Activity tracking (mouse, keyboard, touch, scroll events)
 * - Warning notification before logout
 * - Session expiration on browser tab close/visibility change
 * 
 * @module contexts/AdminSessionContext
 */
'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

// ============================================
// Configuration
// ============================================

// Session timeout in milliseconds (15 minutes)
const SESSION_TIMEOUT_MS = 15 * 60 * 1000

// Warning before logout in milliseconds (2 minutes before)
const WARNING_BEFORE_LOGOUT_MS = 2 * 60 * 1000

// Activity events to track
const ACTIVITY_EVENTS = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click']

// ============================================
// Types
// ============================================

interface AdminSessionContextValue {
  isSessionActive: boolean
  timeUntilLogout: number | null
  showWarning: boolean
  extendSession: () => void
  logout: () => Promise<void>
}

// ============================================
// Context
// ============================================

const AdminSessionContext = createContext<AdminSessionContextValue | undefined>(undefined)

// ============================================
// Provider Component
// ============================================

interface AdminSessionProviderProps {
  children: ReactNode
}

export function AdminSessionProvider({ children }: AdminSessionProviderProps) {
  const router = useRouter()
  const [isSessionActive, setIsSessionActive] = useState(true)
  const [timeUntilLogout, setTimeUntilLogout] = useState<number | null>(null)
  const [showWarning, setShowWarning] = useState(false)
  
  const lastActivityRef = useRef<number>(Date.now())
  const logoutTimerRef = useRef<NodeJS.Timeout | null>(null)
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null)
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null)

  /**
   * Perform logout action
   */
  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store',
      })
    } catch (error) {
      console.error('Error during admin logout:', error)
    } finally {
      setIsSessionActive(false)
      router.push('/login?message=Session expired. Please log in again.')
    }
  }, [router])

  /**
   * Clear all timers
   */
  const clearAllTimers = useCallback(() => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current)
      logoutTimerRef.current = null
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current)
      warningTimerRef.current = null
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
      countdownIntervalRef.current = null
    }
  }, [])

  /**
   * Reset and start the session timer
   */
  const resetTimer = useCallback(() => {
    clearAllTimers()
    lastActivityRef.current = Date.now()
    setShowWarning(false)
    setTimeUntilLogout(null)

    // Set warning timer
    warningTimerRef.current = setTimeout(() => {
      setShowWarning(true)
      
      // Start countdown
      const logoutTime = Date.now() + WARNING_BEFORE_LOGOUT_MS
      countdownIntervalRef.current = setInterval(() => {
        const remaining = Math.max(0, logoutTime - Date.now())
        setTimeUntilLogout(Math.ceil(remaining / 1000))
        
        if (remaining <= 0 && countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current)
        }
      }, 1000)
    }, SESSION_TIMEOUT_MS - WARNING_BEFORE_LOGOUT_MS)

    // Set logout timer
    logoutTimerRef.current = setTimeout(() => {
      logout()
    }, SESSION_TIMEOUT_MS)
  }, [clearAllTimers, logout])

  /**
   * Extend session by resetting timers
   */
  const extendSession = useCallback(() => {
    resetTimer()
  }, [resetTimer])

  /**
   * Handle user activity
   */
  const handleActivity = useCallback(() => {
    const now = Date.now()
    // Only reset if more than 1 second has passed (debounce)
    if (now - lastActivityRef.current > 1000) {
      resetTimer()
    }
  }, [resetTimer])

  /**
   * Handle visibility change (tab switch or browser minimize)
   */
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      // Page is hidden - could force shorter timeout
      // But for now, we'll keep the normal timeout
    } else {
      // Page is visible again - check if session expired
      const elapsed = Date.now() - lastActivityRef.current
      if (elapsed >= SESSION_TIMEOUT_MS) {
        logout()
      } else {
        handleActivity()
      }
    }
  }, [handleActivity, logout])

  // Set up activity listeners and timers
  useEffect(() => {
    // Start the timer on mount
    resetTimer()

    // Add activity event listeners
    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true })
    })

    // Add visibility change listener
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup
    return () => {
      clearAllTimers()
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, handleActivity)
      })
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [resetTimer, handleActivity, handleVisibilityChange, clearAllTimers])

  const value: AdminSessionContextValue = {
    isSessionActive,
    timeUntilLogout,
    showWarning,
    extendSession,
    logout,
  }

  return (
    <AdminSessionContext.Provider value={value}>
      {children}
      {/* Session Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 animate-scale-up">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Session Expiring</h2>
              <p className="text-gray-600 mb-4">
                Your session will expire in <span className="font-bold text-amber-600">{timeUntilLogout}</span> seconds due to inactivity.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={extendSession}
                  className="px-6 py-2.5 bg-[#2D8FDD] hover:bg-[#1E6BB8] text-white rounded-lg font-semibold transition-colors"
                >
                  Stay Logged In
                </button>
                <button
                  onClick={logout}
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
                >
                  Logout Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminSessionContext.Provider>
  )
}

// ============================================
// Hook
// ============================================

/**
 * Hook to access the admin session system
 * @throws Error if used outside AdminSessionProvider
 */
export function useAdminSession(): AdminSessionContextValue {
  const context = useContext(AdminSessionContext)
  
  if (context === undefined) {
    throw new Error('useAdminSession must be used within an AdminSessionProvider')
  }
  
  return context
}

export default AdminSessionContext
