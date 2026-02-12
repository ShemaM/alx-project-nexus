'use client'

import { useState } from 'react'
import { subscribe } from '@/lib/api'
import { Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

const SubscriptionForm = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const response = await subscribe(email)
      if (response.success) {
        setStatus('success')
        setMessage(response.message)
        setEmail('')
      } else {
        setStatus('error')
        setMessage(response.message || 'An error occurred. Please try again.')
      }
    } catch (_error) {
      setStatus('error')
      setMessage('An error occurred. Please try again.')
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-200" size={20} />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === 'loading'}
            className="w-full h-12 rounded-xl border border-white/20 bg-white/10 pl-11 pr-4 text-white placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-[#F5D300]/50 focus:border-[#F5D300] disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="h-12 px-6 rounded-xl bg-[#F5D300] text-[#1E6BB8] font-bold hover:bg-[#D4B500] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {status === 'loading' ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Subscribing...</span>
            </>
          ) : (
            'Subscribe'
          )}
        </button>
      </form>
      {message && (
        <div className={`mt-3 flex items-center gap-2 text-sm ${
          status === 'success' ? 'text-emerald-300' : 
          status === 'error' ? 'text-red-300' : 'text-blue-100'
        }`}>
          {status === 'success' && <CheckCircle size={16} />}
          {status === 'error' && <AlertCircle size={16} />}
          <span>{message}</span>
        </div>
      )}
    </div>
  )
}

export default SubscriptionForm
