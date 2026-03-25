 'use client'

import { useEffect, useState } from 'react'
import { Check, Loader2, Star, AlertCircle, Home, Image, BarChart2, Headphones, Zap } from 'lucide-react'

interface PlanLimits {
  maxProperties: number
  maxImages: number
  featuredListings: boolean
  prioritySupport: boolean
  analytics: boolean
}

interface Plan {
  _id: string
  name: string
  description: string
  price: number
  billingCycle: 'monthly' | 'yearly' | 'one-time'
  features: string[]
  limits: PlanLimits
  isActive: boolean
  isPopular: boolean
}

interface UserSubscription {
  plan: Plan
  status: string
  expiresAt: string
}

export default function SubscriptionPage() {
  const [plans, setPlans]               = useState<Plan[]>([])
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [loading, setLoading]           = useState(true)
  const [selecting, setSelecting]       = useState<string | null>(null)
  const [error, setError]               = useState('')
  const [success, setSuccess]           = useState('')

  useEffect(() => {
    async function fetchData() {
      try {
        const [planRes, subRes] = await Promise.all([
          fetch('/api/plans'),
          fetch('/api/dashboard/subscription'),
        ])
        const planData = await planRes.json()
        const subData  = await subRes.json()
        if (planData.success) setPlans(planData.plans)
        if (subData.success && subData.subscription) setSubscription(subData.subscription)
      } catch { setError('Failed to load subscription data') }
      finally { setLoading(false) }
    }
    fetchData()
  }, [])

  const handleSelectPlan = async (planId: string) => {
    setSelecting(planId); setError('')
    try {
      const res  = await fetch('/api/user/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      })
      const data = await res.json()
      if (data.success) {
        setSuccess('Plan activated successfully')
        setSubscription(data.subscription)
        setTimeout(() => setSuccess(''), 4000)
      } else { setError(data.message || 'Failed to select plan') }
    } catch { setError('Unable to connect to server') }
    finally { setSelecting(null) }
  }

  const cycleLabel: Record<string, string> = {
    monthly: '/mo', yearly: '/yr', 'one-time': 'one-time',
  }

  const isCurrentPlan = (planId: string) =>
    subscription?.plan?._id === planId && subscription?.status === 'active'

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-[#042C53]/30" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/40">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* ── Page Header ── */}
        <div className="mb-10">
          <h1 className="text-2xl font-semibold text-[#042C53] tracking-tight">Subscription</h1>
          <p className="text-sm text-gray-400 mt-1">Choose a plan and start managing your properties</p>
        </div>

        {/* ── Alerts ── */}
        {success && (
          <div className="mb-6 flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-xl text-sm">
            <Check className="w-4 h-4 shrink-0" /> {success}
          </div>
        )}
        {error && (
          <div className="mb-6 flex items-center gap-2 bg-red-50 border border-red-100 text-red-500 px-4 py-3 rounded-xl text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {/* ── Active Subscription Banner ── */}
        {subscription ? (
          <div className="mb-8 bg-[#042C53] rounded-2xl p-6 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-amber-400 uppercase tracking-widest mb-1">Current Plan</p>
              <h2 className="text-white font-semibold text-lg">{subscription.plan.name}</h2>
              <p className="text-white/40 text-xs mt-1">
                Expires {new Date(subscription.expiresAt).toLocaleDateString('en-PK', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">
                Rs.&nbsp;{subscription.plan.price.toLocaleString()}
              </p>
              <p className="text-white/30 text-xs">{cycleLabel[subscription.plan.billingCycle]}</p>
            </div>
          </div>
        ) : (
          <div className="mb-8 bg-white border border-amber-100 rounded-2xl p-6 flex items-center gap-5">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#042C53]">No active subscription</p>
              <p className="text-xs text-gray-400 mt-0.5">Choose a plan below to start listing your properties</p>
            </div>
          </div>
        )}

        {/* ── Section Label ── */}
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-5">
          Available Plans
        </p>

        {/* ── Plans Grid ── */}
        {plans.length === 0 ? (
          <div className="text-center py-20 text-gray-300 text-sm">No plans available at the moment</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {plans.map(plan => {
              const current = isCurrentPlan(plan._id)
              return (
                <div
                  key={plan._id}
                  className={`relative bg-white rounded-2xl border transition-all flex flex-col ${
                    plan.isPopular
                      ? 'border-amber-300 shadow-[0_0_0_1px_rgba(251,191,36,0.2),0_4px_24px_rgba(0,0,0,0.06)]'
                      : current
                        ? 'border-[#042C53]/20 shadow-[0_0_0_1px_rgba(4,44,83,0.1)]'
                        : 'border-gray-100 shadow-sm'
                  }`}
                >
                  {/* Popular badge */}
                  {plan.isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 bg-amber-400 text-[#042C53] text-[11px] font-semibold px-3 py-1 rounded-full">
                        <Star className="w-3 h-3 fill-[#042C53]" /> Most Popular
                      </span>
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-1">
                    {/* Plan name + status */}
                    <div className="mb-5">
                      <div className="flex items-center justify-between mb-1.5">
                        <h3 className="text-base font-semibold text-[#042C53]">{plan.name}</h3>
                        {current && (
                          <span className="text-[10px] bg-[#042C53]/8 text-[#042C53] font-medium px-2.5 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">{plan.description}</p>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                      <span className="text-3xl font-bold text-[#042C53]">
                        {plan.price === 0 ? 'Free' : `Rs. ${plan.price.toLocaleString()}`}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-gray-300 text-sm ml-1">{cycleLabel[plan.billingCycle]}</span>
                      )}
                    </div>

                    {/* Limits */}
                    <div className="grid grid-cols-2 gap-2 mb-5">
                      <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
                        <Home className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                        <span className="text-xs text-gray-500">
                          {plan.limits.maxProperties === 999 ? 'Unlimited' : plan.limits.maxProperties}
                          <span className="text-gray-300"> prop.</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
                        <Image className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                        <span className="text-xs text-gray-500">
                          {plan.limits.maxImages === 999 ? 'Unlimited' : plan.limits.maxImages}
                          <span className="text-gray-300"> img.</span>
                        </span>
                      </div>
                      {plan.limits.featuredListings && (
                        <div className="flex items-center gap-2 bg-amber-50 rounded-xl px-3 py-2.5">
                          <Star className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="text-xs text-amber-600">Featured</span>
                        </div>
                      )}
                      {plan.limits.prioritySupport && (
                        <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2.5">
                          <Headphones className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span className="text-xs text-blue-500">Priority</span>
                        </div>
                      )}
                      {plan.limits.analytics && (
                        <div className="flex items-center gap-2 bg-green-50 rounded-xl px-3 py-2.5 col-span-2">
                          <BarChart2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                          <span className="text-xs text-green-600">Analytics Dashboard</span>
                        </div>
                      )}
                    </div>

                    {/* Features list */}
                    {plan.features.length > 0 && (
                      <ul className="space-y-2 mb-6 flex-1">
                        {plan.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs text-gray-500">
                            <span className="mt-0.5 w-4 h-4 rounded-full bg-[#042C53]/6 flex items-center justify-center shrink-0">
                              <Check className="w-2.5 h-2.5 text-[#042C53]" />
                            </span>
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* CTA Button */}
                    <button
                      onClick={() => !current && handleSelectPlan(plan._id)}
                      disabled={current || selecting === plan._id}
                      className={`w-full mt-auto py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        current
                          ? 'bg-gray-50 text-gray-300 border border-gray-100 cursor-default'
                          : plan.isPopular
                            ? 'bg-amber-400 hover:bg-amber-500 text-[#042C53] font-semibold shadow-sm'
                            : 'bg-[#042C53] hover:bg-[#063a6e] text-white'
                      }`}
                    >
                      {selecting === plan._id && <Loader2 className="w-4 h-4 animate-spin" />}
                      {current ? 'Current Plan' : plan.price === 0 ? 'Get Started' : 'Choose Plan'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── Footer note ── */}
        <p className="text-center text-xs text-gray-300 mt-10">
          All plans include 24/7 listing availability. Upgrade or downgrade anytime.
        </p>

      </div>
    </div>
  )
}