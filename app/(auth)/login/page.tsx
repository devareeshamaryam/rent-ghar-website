 // Page: /login
// User login form - email + password

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const params   = useSearchParams()
  const redirect = params.get('redirect') || '/dashboard'

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res  = await fetch('/api/auth/login', {
        method:      'POST',
        headers:     { 'Content-Type': 'application/json' },
        body:        JSON.stringify({ email, password }),
        credentials: 'include',
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Login failed')
        return
      }

      // ✅ role ko response se nikalo
      const role = data.user?.role
      window.location.href = role === 'admin' ? '/admin' : '/dashboard'

    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 bg-[#042C53] rounded-xl flex items-center justify-center text-white font-bold">R</div>
            <span className="text-xl font-bold text-gray-900">RentGhars</span>
          </Link>
          <p className="text-sm text-gray-500 mt-2">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                placeholder="you@example.com"
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#042C53] focus:ring-1 focus:ring-[#042C53] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  placeholder="••••••••"
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 pr-10 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#042C53] focus:ring-1 focus:ring-[#042C53] transition"
                />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                  {showPass ? (
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 text-red-600 text-xs px-3 py-2.5 rounded-lg">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-[#042C53] text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-[#063a6e] disabled:opacity-60 transition">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

          </form>

          <div className="mt-5 pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              Don't have an account?{' '}
              <Link href="/register" className="text-[#042C53] font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          <Link href="/" className="hover:text-gray-600 transition">← Back to RentGhars</Link>
        </p>

      </div>
    </div>
  )
}