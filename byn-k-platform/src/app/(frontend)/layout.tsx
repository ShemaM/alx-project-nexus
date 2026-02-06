/**
 * Root Layout for Frontend
 * 
 * Main layout component for the public-facing frontend.
 * Includes global providers, metadata, and styling.
 * 
 * @module app/(frontend)/layout
 */
import React from 'react'
import { Providers } from '@/components/layout/Providers'
import './styles.css'

// SEO Metadata
export const metadata = {
  title: {
    default: 'Banyamulenge Youth Kenya Platform - Opportunities for Banyamulenge Youth',
    template: '%s | BYN-K Platform',
  },
  description: 'Verified jobs, scholarships, internships, and fellowships for Banyamulenge refugee youth in Kenya. Find opportunities that accept your documentation.',
  keywords: ['jobs', 'scholarships', 'internships', 'fellowships', 'Banyamulenge', 'refugee', 'Kenya', 'opportunities'],
  authors: [{ name: 'BYN-K Platform' }],
  creator: 'Banyamulenge Youth Kenya Platform',
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
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}