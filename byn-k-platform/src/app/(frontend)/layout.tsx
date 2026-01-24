import React from 'react'
import './styles.css'

export const metadata = {
  description: 'Verified jobs and scholarships for Banyamulenge refugee youth in Kenya.',
  title: 'Banyamulenge Youth Kenya - Opportunity Platform | Nexus Hub',
}

export default async function RootLayout(props: Readonly<{ children: React.ReactNode }>) {
  const { children } = props

  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}