'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown, ChevronRight, Bookmark, LogOut, Loader2, MailOpen, UserCircle2, LogIn, UserPlus } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'

import { getCurrentUser } from '@/lib/api'

// Primary navigation entries for the desktop/mobile navbar.
const navLinks = [
  { href: '/opportunities', label: 'Opportunities' },
  { href: '/events', label: 'Events' },
  { href: '/partners', label: 'Partners' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

interface UserData {
  id?: number | string
  email?: string
  name?: string | null
  username?: string | null
  is_admin?: boolean
  is_staff?: boolean
  roles?: string[]
}

/** Global navigation bar with authentication controls and responsive drawer handling. */
export const Navbar = () => {
  const pathname = usePathname()
  const { data: session, status: sessionStatus } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showVerifyBanner, setShowVerifyBanner] = useState(false)

  const segmentLabelMap: Record<string, string> = {
    about: 'About',
    admin: 'Admin',
    analytics: 'Analytics',
    bookmarks: 'Bookmarks',
    categories: 'Categories',
    'confirm-subscription': 'Confirm Subscription',
    contact: 'Contact',
    dashboard: 'Dashboard',
    faq: 'FAQ',
    'forgot-password': 'Forgot Password',
    login: 'Sign In',
    'my-opportunities': 'My Opportunities',
    opportunities: 'Opportunities',
    partners: 'Partners',
    events: 'Events',
    signup: 'Sign Up',
    training: 'Training',
    unsubscribe: 'Unsubscribe',
    jobs: 'Jobs',
    scholarships: 'Scholarships',
    internships: 'Internships',
    fellowships: 'Fellowships',
  }

  // Auth routes get a stripped layout — no breadcrumbs needed.
  const AUTH_ROUTES = new Set(['/login', '/signup', '/forgot-password', '/confirm-subscription', '/unsubscribe'])
  const isAuthRoute = AUTH_ROUTES.has(pathname ?? '')

  const segments = (pathname || '/').split('/').filter(Boolean)
  const showBreadcrumbs = segments.length > 0 && !isAuthRoute

  const breadcrumbItems = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join('/')}`
    const safeSegment = decodeURIComponent(segment)
    const label =
      segmentLabelMap[safeSegment.toLowerCase()] ||
      safeSegment
        .replaceAll('-', ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())

    return {
      href,
      label,
      isLast: index === segments.length - 1,
    }
  })

  useEffect(() => {
    // Fast-path: OAuth user — data already in NextAuth session, zero API call.
    if (sessionStatus === 'authenticated') {
      const djangoUser = (session as any)?.djangoUser
      if (djangoUser) {
        setUser(djangoUser as UserData)
        setIsLoading(false)
        return
      }
    }

    // NextAuth still resolving — wait before falling back to the API.
    if (sessionStatus === 'loading') return

    // No OAuth session (email-auth user or unauthenticated) — check via cookie API.
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser as UserData | null)
      } catch (error) {
        console.error('Error checking auth:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [sessionStatus, session])

  // Show verification banner for logged-in users who haven't verified their email
  useEffect(() => {
    if (!user) return
    const verified = document.cookie.split(';').some((c) => c.trim() === 'email-verified=1')
    setShowVerifyBanner(!verified)
  }, [user])

  // Highlight the nav link if the current pathname falls under it.
  const isActiveLink = (href: string) => {
    if (!pathname) return false
    if (href === '/' && pathname === '/') return true
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const handleLogout = async () => {
    if (isLoggingOut) return
    
    setIsLoggingOut(true)
    setIsUserMenuOpen(false)
    setIsMenuOpen(false)
    
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store',
      })
      
      if (response.ok) {
        setUser(null)
        // Force a hard navigation to clear all client-side state
        window.location.replace('/')
      } else {
        console.error('Logout failed with status:', response.status)
        // Still redirect even if server returns error, to clear local state
        setUser(null)
        window.location.replace('/')
      }
    } catch (error) {
      console.error('Error logging out:', error)
      // Even on error, clear local state and redirect
      setUser(null)
      window.location.replace('/')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white text-slate-900 shadow-sm">
      {/* Email verification banner */}
      {showVerifyBanner && (
        <div className="flex items-center justify-between gap-3 bg-secondary px-4 py-2 text-xs font-semibold text-navy">
          <span className="flex items-center gap-1.5">
            <MailOpen size={13} aria-hidden="true" />
            Please verify your email address to unlock bookmarks and alerts.
          </span>
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/signup/check-email" className="underline underline-offset-2 hover:opacity-80">
              Resend link
            </Link>
            <button
              type="button"
              aria-label="Dismiss verification banner"
              onClick={() => setShowVerifyBanner(false)}
              className="opacity-60 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between">
          <Link href="/" className="flex h-full items-center" aria-label="Banyamulenge Youth Kenya home">
            <Image
              src="/images/logo.png"
              alt="BANYAMULENGE YOUTH KENYA Logo"
              width={84}
              height={84}
              className="h-[72px] w-[72px] object-contain md:h-20 md:w-20"
              priority
            />
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${isActiveLink(link.href) ? 'bg-secondary text-navy font-bold' : 'text-slate-700 hover:bg-primary/8 hover:text-primary'}`}
              >
                {link.label}
              </Link>
            ))}

            {isLoading ? (
              /* Stable skeleton prevents layout shift while session loads */
              <div className="flex items-center gap-3" aria-hidden="true">
                <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
                <div className="h-8 w-20 animate-pulse rounded-lg bg-slate-200" />
              </div>
            ) : (
              <>
                {user ? (
                  <div className="flex items-center gap-4">
                    <Link
                      href="/my-opportunities?tab=bookmarked"
                      className="flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-primary transition-colors"
                      title="My Bookmarks"
                    >
                      <Bookmark size={18} />
                      <span className="hidden lg:inline">Bookmarks</span>
                    </Link>

                    <div className="relative">
                      <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-primary transition-colors"
                      >
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
                          {(user.name || user.username || user.email || 'U')[0].toUpperCase()}
                        </div>
                        <ChevronDown size={16} className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isUserMenuOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsUserMenuOpen(false)}
                          />
                          <div className="absolute top-full right-0 z-20 mt-2 w-48 rounded-xl border border-primary/25 bg-[#07101f] py-2 shadow-2xl">
                            <div className="px-4 py-2 border-b border-primary/20">
                              <p className="text-sm font-medium text-slate-100 truncate">{user.name || user.username || 'User'}</p>
                              <p className="text-xs text-slate-300 truncate">{user.email || ''}</p>
                            </div>
                            <Link
                              href="/my-opportunities?tab=bookmarked"
                              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-200 hover:bg-primary/10 hover:text-secondary"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <Bookmark size={16} />
                              My Bookmarks
                            </Link>
                            <button
                              type="button"
                              onClick={handleLogout}
                              disabled={isLoggingOut}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-200 hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isLoggingOut ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
                              {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:border-primary hover:bg-primary/8 hover:text-primary"
                    >
                      <UserCircle2 size={18} />
                      My Profile
                      <ChevronDown size={14} className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isUserMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)} />
                        <div className="absolute top-full right-0 z-20 mt-2 w-64 overflow-hidden rounded-xl border border-primary/25 bg-[#07101f] shadow-2xl">
                          <div className="px-5 py-4 border-b border-primary/20 bg-primary/5">
                            <p className="text-sm font-bold text-slate-100">Welcome to BYN-K</p>
                            <p className="text-xs text-slate-400 mt-0.5">Opportunities for Banyamulenge youth</p>
                          </div>
                          <div className="p-3 space-y-2">
                            <Link
                              href="/login"
                              className="flex items-center justify-center gap-2 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-primary-dark transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <LogIn size={15} />
                              Sign In
                            </Link>
                            <Link
                              href="/signup"
                              className="flex items-center justify-center gap-2 w-full rounded-lg border border-secondary/60 px-4 py-2.5 text-sm font-bold text-secondary hover:bg-secondary/10 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <UserPlus size={15} />
                              Create Free Account
                            </Link>
                          </div>
                          <p className="text-center text-xs text-slate-400 pb-3">100% free. No credit card needed.</p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden rounded-lg border border-slate-300 p-2 text-slate-700 transition-colors hover:border-primary hover:text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-4 py-5 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-lg px-3 py-2 text-base font-medium transition ${isActiveLink(link.href) ? 'bg-secondary text-navy font-bold' : 'text-slate-700 hover:bg-primary/8 hover:text-primary'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {isLoading ? (
              <div className="border-t border-primary/20 pt-4 space-y-3" aria-hidden="true">
                <div className="h-10 animate-pulse rounded-lg bg-primary/15" />
                <div className="h-10 animate-pulse rounded-lg bg-primary/15" />
              </div>
            ) : (
              <div className="border-t border-primary/20 pt-4">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 py-2">
                      <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                        {(user.name || user.username || user.email || 'U')[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-slate-100">{user.name || user.username || 'User'}</p>
                        <p className="text-sm text-slate-300">{user.email || ''}</p>
                      </div>
                    </div>
                    <Link
                      href="/my-opportunities?tab=bookmarked"
                      className="flex items-center gap-2 py-2 text-blue-100 hover:text-secondary font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Bookmark size={18} />
                      My Bookmarks
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex items-center gap-2 py-2 text-red-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoggingOut ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
                      {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 pb-1">
                      <UserCircle2 size={16} className="text-slate-400" />
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">My Profile</p>
                    </div>
                    <Link
                      href="/login"
                      className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary py-3 text-sm font-bold text-white hover:bg-primary-dark transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LogIn size={16} />
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="flex items-center justify-center gap-2 w-full rounded-xl border border-secondary/60 py-3 text-sm font-bold text-secondary hover:bg-secondary/10 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserPlus size={16} />
                      Create Free Account
                    </Link>
                    <p className="text-center text-xs text-slate-500 pt-1">100% free. No credit card needed.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {showBreadcrumbs && (
        <div className="border-t border-slate-100 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 overflow-x-auto">
            <ol className="flex items-center gap-1 whitespace-nowrap text-xs sm:text-sm">
              <li>
                <Link href="/" className="text-slate-500 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              {breadcrumbItems.map((item) => (
                <li key={item.href} className="flex items-center gap-1">
                  <ChevronRight size={14} className="text-slate-400" />
                  {item.isLast ? (
                    <span className="font-semibold text-primary">{item.label}</span>
                  ) : (
                    <Link href={item.href} className="text-slate-500 hover:text-primary transition-colors">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </nav>
  )
}
