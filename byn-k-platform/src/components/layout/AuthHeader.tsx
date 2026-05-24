'use client'

import Link from 'next/link'
import Image from 'next/image'

/** Branded dark header for auth routes. */
export default function AuthHeader() {
  return (
    <header className="border-b border-primary/20 bg-[#061027]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3" aria-label="Back to home">
          <Image
            src="/images/logo.png"
            alt="BYN-K Logo"
            width={40}
            height={40}
            className="rounded-lg"
            priority
          />
          <div className="flex flex-col">
            <span className="text-base font-black leading-tight tracking-tight text-primary">
              BANYAMULENGE
            </span>
            <span className="text-[10px] font-semibold tracking-wider text-secondary">
              YOUTH KENYA
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="text-sm font-semibold text-slate-400 transition hover:text-white"
        >
          ← Back to site
        </Link>
      </div>
    </header>
  )
}
