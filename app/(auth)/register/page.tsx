// Page: /register
// Naye user ka signup form

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [showPass, setShowPass] = useState(false)

  const set = (key: string, val: string) => {
    setForm(prev => ({ ...prev, [key]: val }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      const res  = await fetch('/api/auth/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          name:     form.name,
          email:    form.email,
          phone:    form.phone,
          password: form.password,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.message)
        return
      }

      router.push('/dashboard')
      router.refresh()

    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#042C53] focus:ring-1 focus:ring-[#042C53] transition"

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 bg-[#042C53] rounded-xl flex items-center justify-center text-white font-bold">R</div>
            <span className="text-xl font-bold text-gray-900">RentGhars</span>
          </Link>
          <p className="text-sm text-gray-500 mt-2">Create your account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name</label>
              <input className={inputCls} placeholder="Your full name" required
                value={form.name} onChange={e => set('name', e.target.value)} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
              <input type="email" className={inputCls} placeholder="you@example.com" required
                value={form.email} onChange={e => set('email', e.target.value)} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Phone <span className="text-gray-300 font-normal">(Optional)</span>
              </label>
              <input className={inputCls} placeholder="03XX XXXXXXX"
                value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} className={`${inputCls} pr-10`}
                  placeholder="Min. 6 characters" required
                  value={form.password} onChange={e => set('password', e.target.value)} />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirm Password</label>
              <input type="password" className={inputCls} placeholder="Re-enter password" required
                value={form.confirm} onChange={e => set('confirm', e.target.value)} />
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
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

          </form>

          <div className="mt-5 pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              Already have an account?{' '}
              <Link href="/login" className="text-[#042C53] font-semibold hover:underline">Sign in</Link>
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