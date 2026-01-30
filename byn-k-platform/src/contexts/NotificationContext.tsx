/**
 * Notification Context
 * 
 * Provides a global notification system for the application.
 * Supports toast notifications with different types (success, error, warning, info).
 * 
 * Usage:
 * ```tsx
 * const { showNotification } = useNotification()
 * showNotification({ type: 'success', message: 'Action completed!' })
 * ```
 * 
 * @module contexts/NotificationContext
 */
'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

// ============================================
// Types
// ============================================

/** Notification types with different styling */
export type NotificationType = 'success' | 'error' | 'warning' | 'info'

/** Individual notification object */
export interface Notification {
  id: string
  type: NotificationType
  message: string
  title?: string
  duration?: number
  dismissible?: boolean
}

/** Props for creating a new notification */
export interface NotificationProps {
  type: NotificationType
  message: string
  title?: string
  duration?: number // milliseconds, default 5000
  dismissible?: boolean // default true
}

/** Context value type */
interface NotificationContextValue {
  notifications: Notification[]
  showNotification: (props: NotificationProps) => string
  dismissNotification: (id: string) => void
  clearAllNotifications: () => void
}

// ============================================
// Context
// ============================================

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined)

// ============================================
// Provider Component
// ============================================

interface NotificationProviderProps {
  children: ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  /**
   * Dismiss a specific notification
   * @param id - The notification ID to dismiss
   */
  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  /**
   * Show a new notification
   * @param props - Notification configuration
   * @returns The notification ID for programmatic dismissal
   */
  const showNotification = useCallback((props: NotificationProps): string => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const notification: Notification = {
      id,
      type: props.type,
      message: props.message,
      title: props.title,
      duration: props.duration ?? 5000,
      dismissible: props.dismissible ?? true,
    }

    setNotifications((prev) => [...prev, notification])

    // Auto-dismiss after duration
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        dismissNotification(id)
      }, notification.duration)
    }

    return id
  }, [dismissNotification])

  /**
   * Clear all notifications
   */
  const clearAllNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  const value: NotificationContextValue = {
    notifications,
    showNotification,
    dismissNotification,
    clearAllNotifications,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

// ============================================
// Hook
// ============================================

/**
 * Hook to access the notification system
 * @throws Error if used outside NotificationProvider
 */
export function useNotification(): NotificationContextValue {
  const context = useContext(NotificationContext)
  
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  
  return context
}

export default NotificationContext
