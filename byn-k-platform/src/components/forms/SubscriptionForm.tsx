'use client'

import { useState } from 'react'
import { subscribe } from '@/lib/api'
import { Mail } from 'lucide-react'

const SubscriptionForm = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      const response = await subscribe(email)
      setMessage(response.message)
    } catch (error) {
      setMessage('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
      setEmail('')
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Subscribe for Updates</h3>
      <form onSubmit={handleSubmit} className="flex items-center">
        <div className="relative w-full">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 pl-10 border rounded-l-lg"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#2D8FDD] text-white p-3 rounded-r-lg disabled:bg-gray-400"
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  )
}

export default SubscriptionForm
