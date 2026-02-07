'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { unsubscribe } from '@/lib/api'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const UnsubscribePage = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [message, setMessage] = useState('Unsubscribing...')

  useEffect(() => {
    if (token) {
      const performUnsubscribe = async () => {
        const response = await unsubscribe(token)
        setMessage(response.message)
      }
      performUnsubscribe()
    } else {
      setMessage('No unsubscribe token found.')
    }
  }, [token])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4">Unsubscribe</h1>
          <p className="text-lg">{message}</p>
          <Link href="/" className="mt-6 inline-block bg-[#2D8FDD] text-white px-6 py-2 rounded-lg">
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default UnsubscribePage