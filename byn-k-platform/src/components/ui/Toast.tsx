/**
 * Toast Notification Component
 * 
 * Displays toast notifications with different styles based on type.
 * Supports success, error, warning, and info notifications.
 * 
 * Features:
 * - Animated entrance and exit
 * - Dismissible notifications
 * - Auto-dismiss after duration
 * - Accessible with ARIA attributes
 * 
 * @module components/ui/Toast
 */
'use client'

import React from 'react'
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'
import { useNotification, Notification, NotificationType } from '@/contexts/NotificationContext'

// ============================================
// Icon Mapping
// ============================================

const icons: Record<NotificationType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5" />,
  error: <XCircle className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
}

// ============================================
// Style Mapping
// ============================================

const styles: Record<NotificationType, string> = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
}

const iconStyles: Record<NotificationType, string> = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
}

// ============================================
// Individual Toast Component
// ============================================

interface ToastItemProps {
  notification: Notification
  onDismiss: (id: string) => void
}

function ToastItem({ notification, onDismiss }: ToastItemProps) {
  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        flex items-start gap-3 p-4 rounded-lg border shadow-lg
        animate-slide-in-right
        ${styles[notification.type]}
      `}
    >
      {/* Icon */}
      <span className={`flex-shrink-0 ${iconStyles[notification.type]}`}>
        {icons[notification.type]}
      </span>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        {notification.title && (
          <h4 className="font-semibold text-sm mb-1">
            {notification.title}
          </h4>
        )}
        <p className="text-sm">
          {notification.message}
        </p>
      </div>
      
      {/* Dismiss Button */}
      {notification.dismissible && (
        <button
          onClick={() => onDismiss(notification.id)}
          className="flex-shrink-0 p-1 rounded-full hover:bg-black/5 transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

// ============================================
// Toast Container Component
// ============================================

/**
 * Toast container that renders all active notifications
 * Place this component at the root of your app
 */
export function ToastContainer() {
  const { notifications, dismissNotification } = useNotification()

  if (notifications.length === 0) {
    return null
  }

  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      aria-label="Notifications"
    >
      {notifications.map((notification) => (
        <div key={notification.id} className="pointer-events-auto">
          <ToastItem
            notification={notification}
            onDismiss={dismissNotification}
          />
        </div>
      ))}
    </div>
  )
}

export default ToastContainer
