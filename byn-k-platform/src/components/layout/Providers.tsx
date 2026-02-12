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
 * - GlobalLoadingIndicator: Page transition loading overlay
 * 
 * @module components/layout/Providers
 */
'use client'

import React, { ReactNode, Suspense } from 'react'
import { NotificationProvider, SiteTourProvider, LanguageProvider, LoadingStateProvider } from '@/contexts'
import { ToastContainer } from '@/components/ui/Toast'
import { SiteTour } from '@/components/ui/SiteTour'
import { GlobalLoadingIndicator } from '@/components/ui/GlobalLoadingIndicator'

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
            <Suspense fallback={null}>
              <GlobalLoadingIndicator />
            </Suspense>
          </SiteTourProvider>
        </NotificationProvider>
      </LoadingStateProvider>
    </LanguageProvider>
  )
}

export default Providers
