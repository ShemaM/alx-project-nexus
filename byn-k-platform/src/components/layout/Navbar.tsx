import React from 'react'
import Link from 'next/link'
import { Star, Menu } from 'lucide-react'

export const Navbar = () => {
  return (
    <nav className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#F5A623] rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-xl font-black text-[#0F4C81] tracking-tight">BYN-K</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#jobs" className="text-sm font-semibold text-slate-600 hover:text-[#0F4C81] transition-colors">Jobs</Link>
            <Link href="/#scholarships" className="text-sm font-semibold text-slate-600 hover:text-[#0F4C81] transition-colors">Scholarships</Link>
            <Link href="/admin" className="bg-[#0F4C81] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#0d3f6b] transition-colors">
              Admin Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-slate-600 hover:text-[#0F4C81] transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  )
}