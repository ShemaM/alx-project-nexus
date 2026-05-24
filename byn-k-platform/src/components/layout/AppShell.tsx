'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { Navbar } from './Navbar'
import Footer from './Footer'
import AuthHeader from './AuthHeader'

const AUTH_ROUTES = new Set([
  '/login',
  '/signup',
  '/forgot-password',
  '/confirm-subscription',
  '/unsubscribe',
])

/**
 * Mounts Navbar+Footer once for the whole app session.
 * Auth routes get a stripped AuthHeader only (no Footer) for conversion focus.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthRoute = AUTH_ROUTES.has(pathname ?? '')

  if (isAuthRoute) {
    return (
      <>
        <AuthHeader />
        <div id="main-content" tabIndex={-1} className="byn-main-surface focus:outline-none">
          {children}
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div id="main-content" tabIndex={-1} className="byn-main-surface focus:outline-none">
        {children}
      </div>
      <Footer />
    </>
  )
}
