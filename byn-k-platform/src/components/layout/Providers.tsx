/**
 * Client Providers Component
 * 
 * Wraps the application with all necessary client-side context providers.
 * This component is marked as 'use client' since contexts require client-side state.
 * 
 * Includes:
 * - NotificationProvider: Toast notifications
 * - SiteTourProvider: Onboarding tour
 * 
 * @module components/layout/Providers
 */
'use client'

import React, { ReactNode } from 'react'
import { NotificationProvider, SiteTourProvider } from '@/contexts'
import { ToastContainer } from '@/components/ui/Toast'
import { SiteTour } from '@/components/ui/SiteTour'

interface ProvidersProps {
  children: ReactNode
}

/**
 * Client-side providers wrapper
 * Includes all global context providers and their UI components
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <NotificationProvider>
      <SiteTourProvider>
        {children}
        {/* Global UI components */}
        <ToastContainer />
        <SiteTour />
      </SiteTourProvider>
    </NotificationProvider>
  )
}

export default Providers
