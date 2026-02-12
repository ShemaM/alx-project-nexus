/**
 * Client Providers Component
 * 
 * Wraps the application with all necessary client-side context providers.
 * This component is marked as 'use client' since contexts require client-side state.
 * 
 * Includes:
 * - NotificationProvider: Toast notifications
 * - SiteTourProvider: Onboarding tour
 * - LanguageProvider: Multilingual support
 * - LoadingStateProvider: Global loading state management
 * 
 * @module components/layout/Providers
 */
'use client'

import React, { ReactNode } from 'react'
import { NotificationProvider, SiteTourProvider, LanguageProvider, LoadingStateProvider } from '@/contexts'
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
    <LanguageProvider>
      <LoadingStateProvider>
        <NotificationProvider>
          <SiteTourProvider>
            {children}
            {/* Global UI components */}
            <ToastContainer />
            <SiteTour />
          </SiteTourProvider>
        </NotificationProvider>
      </LoadingStateProvider>
    </LanguageProvider>
  )
}

export default Providers
