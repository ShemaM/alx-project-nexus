'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown } from 'lucide-react'

const categories = [
  { href: '/categories/jobs', label: 'Jobs' },
  { href: '/categories/scholarships', label: 'Scholarships' },
  { href: '/categories/internships', label: 'Internships' },
  { href: '/categories/training', label: 'Training' },
]

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/images/logo.png" 
              alt="BANYAMULENGE YOUTH KENYA Logo" 
              width={40} 
              height={40}
              className="rounded-lg"
            />
            <span className="text-xl font-black text-[#0F4C81] tracking-tight">BANYAMULENGE YOUTH KENYA</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-[#0F4C81] transition-colors"
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
                        className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#0F4C81]"
                        onClick={() => setIsCategoriesOpen(false)}
                      >
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
            <Link href="/partners" className="text-sm font-semibold text-slate-600 hover:text-[#0F4C81] transition-colors">Partners</Link>
            <Link href="/about" className="text-sm font-semibold text-slate-600 hover:text-[#0F4C81] transition-colors">About</Link>
            <Link href="/admin" className="bg-[#0F4C81] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#0d3f6b] transition-colors">
              Admin Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-slate-600 hover:text-[#0F4C81] transition-colors"
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
                  className="block py-2 text-slate-600 hover:text-[#0F4C81] font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {cat.label}
                </Link>
              ))}
            </div>
            
            <div className="border-t border-[#E2E8F0] pt-4 space-y-4">
              <Link 
                href="/partners" 
                className="block py-2 text-slate-600 hover:text-[#0F4C81] font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Partners
              </Link>
              <Link 
                href="/about" 
                className="block py-2 text-slate-600 hover:text-[#0F4C81] font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/admin" 
                className="block bg-[#0F4C81] text-white px-4 py-3 rounded-lg text-sm font-bold text-center hover:bg-[#0d3f6b] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}