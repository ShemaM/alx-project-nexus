import React from 'react'
import Link from 'next/link'

export const Navbar = () => {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black text-[#0F4C81] tracking-tighter">BYN-K</span>
            <span className="hidden sm:block text-slate-400 font-medium">| Nexus Hub</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#jobs" className="text-sm font-semibold text-slate-600 hover:text-[#0F4C81]">Jobs</Link>
            <Link href="/#scholarships" className="text-sm font-semibold text-slate-600 hover:text-[#0F4C81]">Scholarships</Link>
            <Link href="/admin" className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}