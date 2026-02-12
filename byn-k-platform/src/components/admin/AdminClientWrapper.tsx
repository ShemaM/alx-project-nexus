'use client'

import React, { ReactNode } from 'react'
import { AdminSessionProvider } from '@/contexts'

interface AdminClientWrapperProps {
  children: ReactNode
}

/**
 * Admin Client Wrapper
 * 
 * Wraps admin pages with client-side providers including session management.
 * Ensures admin users are logged out when inactive.
 */
export function AdminClientWrapper({ children }: AdminClientWrapperProps) {
  return (
    <AdminSessionProvider>
      {children}
    </AdminSessionProvider>
  )
}

export default AdminClientWrapper
