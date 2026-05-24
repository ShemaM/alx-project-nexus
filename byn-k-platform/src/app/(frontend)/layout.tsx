import React from 'react'
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'
import { Providers } from '@/components/layout/Providers'
import AppShell from '@/components/layout/AppShell'
import './styles.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-syne',   // keeps all existing font-syne classes working
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans', // keeps all existing font-sans classes working
  display: 'swap',
})

export const metadata = {
  title: {
    default: 'Banyamulenge Youth Kenya Platform - Opportunities for Banyamulenge Youth',
    template: '%s | BYN-K Platform',
  },
  description: 'Verified jobs, scholarships, internships, and fellowships for Banyamulenge refugee youth in Kenya. Find opportunities that accept your documentation.',
  keywords: ['jobs', 'scholarships', 'internships', 'fellowships', 'Banyamulenge', 'refugee', 'Kenya', 'opportunities'],
  authors: [{ name: 'BYN-K Platform' }],
  creator: 'BYN-K Platform',
  icons: {
    icon: '/images/logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Banyamulenge Youth Kenya Platform',
    title: 'Banyamulenge Youth Kenya Platform - Opportunities for Banyamulenge Youth',
    description: 'Verified jobs, scholarships, internships, and fellowships for Banyamulenge refugee youth in Kenya.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BYN-K Platform - Opportunities for Banyamulenge Youth',
    description: 'Verified jobs, scholarships, internships, and fellowships for Banyamulenge refugee youth in Kenya.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function RootLayout(props: Readonly<{ children: React.ReactNode }>) {
  const { children } = props

  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${inter.variable}`}>
      <body className="antialiased font-sans" suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-slate-900 focus:rounded-md focus:ring-2 focus:ring-[color:var(--color-primary)]"
        >
          Skip to main content
        </a>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  )
}
