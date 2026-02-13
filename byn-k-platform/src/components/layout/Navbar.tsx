'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown, ChevronRight, Bookmark, LogOut } from 'lucide-react'
import { usePathname } from 'next/navigation'

import { getCurrentUser } from '@/lib/api'

const categories = [
  { href: '/categories/jobs', label: 'Jobs' },
  { href: '/categories/scholarships', label: 'Scholarships' },
  { href: '/categories/internships', label: 'Internships' },
  { href: '/categories/fellowships', label: 'Fellowships' },
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

export const Navbar = () => {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

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
    signup: 'Sign Up',
    training: 'Training',
    unsubscribe: 'Unsubscribe',
    jobs: 'Jobs',
    scholarships: 'Scholarships',
    internships: 'Internships',
    fellowships: 'Fellowships',
  }

  const segments = (pathname || '/').split('/').filter(Boolean)
  const showBreadcrumbs = segments.length > 0

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
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser()
        // Cast to UserData type since getCurrentUser returns Record<string, unknown>
        setUser(currentUser as UserData | null)
      } catch (error) {
        console.error('Error checking auth:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

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
    <nav className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo - Enlarged */}
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/images/logo.png" 
              alt="BANYAMULENGE YOUTH KENYA Logo" 
              width={56} 
              height={56}
              className="rounded-lg"
              priority
            />
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-black text-[#2D8FDD] tracking-tight leading-tight">BANYAMULENGE</span>
              <span className="text-xs md:text-sm font-semibold text-[#D52B2B] tracking-wider">YOUTH KENYA</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-[#2D8FDD] transition-colors"
              >
                Opportunities
                <ChevronDown size={16} className={`transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>
              {isCategoriesOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10"
                    onClick={() => setIsCategoriesOpen(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#E2E8F0] py-2 z-20">
                    {categories.map((cat) => (
                      <Link
                        key={cat.href}
                        href={cat.href}
                        className="block px-4 py-2 text-sm text-slate-600 hover:bg-[#2D8FDD]/5 hover:text-[#2D8FDD]"
                        onClick={() => setIsCategoriesOpen(false)}
                      >
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
            <Link href="/partners" className="text-sm font-semibold text-slate-600 hover:text-[#2D8FDD] transition-colors">Partners</Link>
            <Link href="/about" className="text-sm font-semibold text-slate-600 hover:text-[#2D8FDD] transition-colors">About</Link>
            
            {/* User Auth Section */}
            {!isLoading && (
              <>
                {user ? (
                  <div className="flex items-center gap-4">
                    {/* Bookmarks Link */}
                    <Link 
                      href="/my-opportunities?tab=bookmarked" 
                      className="flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-[#2D8FDD] transition-colors"
                      title="My Bookmarks"
                    >
                      <Bookmark size={18} />
                      <span className="hidden lg:inline">Bookmarks</span>
                    </Link>
                    
                    {/* User Menu */}
                    <div className="relative">
                      <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#2D8FDD] transition-colors"
                      >
                        <div className="w-8 h-8 bg-[#2D8FDD] text-white rounded-full flex items-center justify-center">
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
                          <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#E2E8F0] py-2 z-20">
                            <div className="px-4 py-2 border-b border-[#E2E8F0]">
                              <p className="text-sm font-medium text-slate-700 truncate">{user.name || user.username || 'User'}</p>
                              <p className="text-xs text-slate-500 truncate">{user.email || ''}</p>
                            </div>
                            <Link
                              href="/my-opportunities?tab=bookmarked"
                              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-[#2D8FDD]/5 hover:text-[#2D8FDD]"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <Bookmark size={16} />
                              My Bookmarks
                            </Link>
                            <button
                              type="button"
                              onClick={handleLogout}
                              disabled={isLoggingOut}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <LogOut size={16} className={isLoggingOut ? 'animate-spin' : ''} />
                              {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link 
                      href="/login" 
                      className="text-sm font-semibold text-slate-600 hover:text-[#2D8FDD] transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/signup" 
                      className="bg-[#2D8FDD] hover:bg-[#1E6BB8] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-slate-600 hover:text-[#2D8FDD] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#E2E8F0]">
          <div className="px-4 py-4 space-y-4">
            {/* Categories */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Opportunities</p>
              {categories.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="block py-2 text-slate-600 hover:text-[#2D8FDD] font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {cat.label}
                </Link>
              ))}
            </div>
            
            <div className="border-t border-[#E2E8F0] pt-4 space-y-4">
              <Link 
                href="/partners" 
                className="block py-2 text-slate-600 hover:text-[#2D8FDD] font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Partners
              </Link>
              <Link 
                href="/about" 
                className="block py-2 text-slate-600 hover:text-[#2D8FDD] font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </div>

            {/* Mobile Auth Section */}
            <div className="border-t border-[#E2E8F0] pt-4">
              {!isLoading && (
                <>
                  {user ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 py-2">
                        <div className="w-10 h-10 bg-[#2D8FDD] text-white rounded-full flex items-center justify-center font-semibold">
                          {(user.name || user.username || user.email || 'U')[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-slate-700">{user.name || user.username || 'User'}</p>
                          <p className="text-sm text-slate-500">{user.email || ''}</p>
                        </div>
                      </div>
                      <Link 
                        href="/my-opportunities?tab=bookmarked"
                        className="flex items-center gap-2 py-2 text-slate-600 hover:text-[#2D8FDD] font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Bookmark size={18} />
                        My Bookmarks
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex items-center gap-2 py-2 text-red-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <LogOut size={18} className={isLoggingOut ? 'animate-spin' : ''} />
                        {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link 
                        href="/login"
                        className="block w-full text-center py-2.5 border border-[#2D8FDD] text-[#2D8FDD] rounded-lg font-semibold hover:bg-[#2D8FDD]/5 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link 
                        href="/signup"
                        className="block w-full text-center py-2.5 bg-[#2D8FDD] text-white rounded-lg font-semibold hover:bg-[#1E6BB8] transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {showBreadcrumbs && (
        <div className="border-t border-[#E2E8F0] bg-slate-50/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 overflow-x-auto">
            <ol className="flex items-center gap-1 whitespace-nowrap text-xs sm:text-sm">
              <li>
                <Link href="/" className="text-slate-500 hover:text-[#2D8FDD] transition-colors">
                  Home
                </Link>
              </li>
              {breadcrumbItems.map((item) => (
                <li key={item.href} className="flex items-center gap-1">
                  <ChevronRight size={14} className="text-slate-400" />
                  {item.isLast ? (
                    <span className="font-semibold text-[#2D8FDD]">{item.label}</span>
                  ) : (
                    <Link href={item.href} className="text-slate-500 hover:text-[#2D8FDD] transition-colors">
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
