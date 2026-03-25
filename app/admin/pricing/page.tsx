 'use client'

import { useEffect, useState } from 'react'
import {
  Plus, Pencil, Trash2, Star, ToggleLeft, ToggleRight,
  X, Check, Loader2, Package, AlertCircle, Home, Image,
} from 'lucide-react'

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
  sortOrder: number
  createdAt: string
}

const EMPTY_PLAN = {
  name: '',
  description: '',
  price: 0,
  billingCycle: 'monthly' as const,
  features: [''],
  limits: {
    maxProperties: 3,
    maxImages: 5,
    featuredListings: false,
    prioritySupport: false,
    analytics: false,
  },
  isActive: true,
  isPopular: false,
  sortOrder: 0,
}

export default function AdminPricingPage() {
  const [plans, setPlans]             = useState<Plan[]>([])
  const [loading, setLoading]         = useState(true)
  const [saving, setSaving]           = useState(false)
  const [error, setError]             = useState('')
  const [success, setSuccess]         = useState('')
  const [showModal, setShowModal]     = useState(false)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [form, setForm]               = useState(EMPTY_PLAN)
  const [deleteId, setDeleteId]       = useState<string | null>(null)

  const fetchPlans = async () => {
    setLoading(true)
    try {
      const res  = await fetch('/api/admin/plans')
      const data = await res.json()
      if (data.success) setPlans(data.plans)
    } catch { setError('Failed to load plans') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchPlans() }, [])

  const openAdd = () => {
    setEditingPlan(null)
    setForm(EMPTY_PLAN)
    setShowModal(true)
    setError('')
  }

  const openEdit = (plan: Plan) => {
    setEditingPlan(plan)
    setForm({
      name: plan.name,
      description: plan.description,
      price: plan.price,
      billingCycle: plan.billingCycle,
      features: plan.features.length ? plan.features : [''],
      limits: { ...plan.limits },
      isActive: plan.isActive,
      isPopular: plan.isPopular,
      sortOrder: plan.sortOrder,
    })
    setShowModal(true)
    setError('')
  }

  const handleFeatureChange = (i: number, val: string) => {
    const f = [...form.features]; f[i] = val
    setForm({ ...form, features: f })
  }

  const addFeature    = () => setForm({ ...form, features: [...form.features, ''] })
  const removeFeature = (i: number) => {
    const f = form.features.filter((_, idx) => idx !== i)
    setForm({ ...form, features: f.length ? f : [''] })
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.description.trim()) {
      setError('Name and description are required')
      return
    }
    setSaving(true); setError('')
    try {
      const payload = { ...form, features: form.features.filter(f => f.trim()), price: Number(form.price) }
      const url     = editingPlan ? `/api/admin/plans/${editingPlan._id}` : '/api/admin/plans'
      const method  = editingPlan ? 'PUT' : 'POST'
      const res     = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data    = await res.json()
      if (data.success) {
        setSuccess(editingPlan ? 'Plan updated successfully' : 'New plan created')
        setShowModal(false); fetchPlans()
        setTimeout(() => setSuccess(''), 3000)
      } else { setError(data.message || 'Something went wrong') }
    } catch { setError('Unable to connect to server') }
    finally { setSaving(false) }
  }

  const handleToggle = async (plan: Plan) => {
    try {
      await fetch(`/api/admin/plans/${plan._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !plan.isActive }),
      })
      fetchPlans()
    } catch { setError('Failed to toggle plan') }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const res  = await fetch(`/api/admin/plans/${deleteId}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setSuccess('Plan deleted'); setDeleteId(null); fetchPlans()
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch { setError('Failed to delete plan') }
  }

  const cycleLabel: Record<string, string> = {
    monthly: '/mo', yearly: '/yr', 'one-time': 'one-time',
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-semibold text-[#042C53] tracking-tight">Pricing Plans</h1>
            <p className="text-sm text-gray-400 mt-1">Manage subscription packages</p>
          </div>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 bg-[#042C53] hover:bg-[#063a6e] text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Plan
          </button>
        </div>

        {/* ── Alerts ── */}
        {success && (
          <div className="mb-6 flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-xl text-sm">
            <Check className="w-4 h-4 shrink-0" /> {success}
          </div>
        )}
        {error && !showModal && (
          <div className="mb-6 flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {/* ── Plans Grid ── */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-7 h-7 animate-spin text-[#042C53]/40" />
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-32">
            <Package className="w-10 h-10 mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 text-sm font-medium">No plans yet</p>
            <p className="text-gray-300 text-xs mt-1">Create your first pricing plan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {plans.map(plan => (
              <div
                key={plan._id}
                className={`relative bg-white rounded-2xl border transition-all ${
                  plan.isPopular
                    ? 'border-amber-300 shadow-[0_0_0_1px_rgba(251,191,36,0.3)]'
                    : 'border-gray-100 shadow-sm'
                } ${!plan.isActive ? 'opacity-50' : ''}`}
              >
                {/* Popular badge */}
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 bg-amber-400 text-[#042C53] text-[11px] font-semibold px-3 py-1 rounded-full">
                      <Star className="w-3 h-3 fill-[#042C53]" /> Most Popular
                    </span>
                  </div>
                )}

                <div className="p-6">
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0 pr-3">
                      <h3 className="text-base font-semibold text-[#042C53]">{plan.name}</h3>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">{plan.description}</p>
                    </div>
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium shrink-0 ${
                      plan.isActive
                        ? 'bg-green-50 text-green-600 border border-green-100'
                        : 'bg-gray-50 text-gray-400 border border-gray-100'
                    }`}>
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-5">
                    <span className="text-3xl font-bold text-[#042C53]">
                      Rs.&nbsp;{plan.price.toLocaleString()}
                    </span>
                    <span className="text-gray-300 text-sm ml-1">{cycleLabel[plan.billingCycle]}</span>
                  </div>

                  {/* Limits */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                      <Home className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                      <span className="text-xs text-gray-500">
                        {plan.limits.maxProperties === 999 ? 'Unlimited' : plan.limits.maxProperties} properties
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                      <Image className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                      <span className="text-xs text-gray-500">
                        {plan.limits.maxImages === 999 ? 'Unlimited' : plan.limits.maxImages} images
                      </span>
                    </div>
                    {plan.limits.featuredListings && (
                      <div className="flex items-center gap-2 bg-amber-50 rounded-lg px-3 py-2">
                        <Star className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="text-xs text-amber-600">Featured</span>
                      </div>
                    )}
                    {plan.limits.prioritySupport && (
                      <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2">
                        <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="text-xs text-blue-600">Priority Support</span>
                      </div>
                    )}
                    {plan.limits.analytics && (
                      <div className="flex items-center gap-2 bg-green-50 rounded-lg px-3 py-2">
                        <Check className="w-3.5 h-3.5 text-green-400 shrink-0" />
                        <span className="text-xs text-green-600">Analytics</span>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  {plan.features.length > 0 && (
                    <ul className="space-y-1.5 mb-5">
                      {plan.features.slice(0, 3).map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="w-4 h-4 rounded-full bg-[#042C53]/8 flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 text-[#042C53]" />
                          </span>
                          {f}
                        </li>
                      ))}
                      {plan.features.length > 3 && (
                        <li className="text-[11px] text-gray-300 pl-6">+{plan.features.length - 3} more</li>
                      )}
                    </ul>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-1 pt-4 border-t border-gray-50">
                    <button
                      onClick={() => openEdit(plan)}
                      className="flex items-center gap-1.5 text-xs text-[#042C53] hover:bg-[#042C53]/5 px-3 py-1.5 rounded-lg transition font-medium"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleToggle(plan)}
                      className="flex items-center gap-1.5 text-xs text-gray-500 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition"
                    >
                      {plan.isActive
                        ? <ToggleRight className="w-4 h-4 text-green-400" />
                        : <ToggleLeft  className="w-4 h-4 text-gray-300" />}
                      {plan.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => setDeleteId(plan._id)}
                      className="flex items-center gap-1.5 text-xs text-red-400 hover:bg-red-50 px-3 py-1.5 rounded-lg transition ml-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Add / Edit Modal ── */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#042C53]/30 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">

              <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
                <h2 className="text-base font-semibold text-[#042C53]">
                  {editingPlan ? 'Edit Plan' : 'Create New Plan'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-300 hover:text-gray-500 p-1.5 rounded-lg hover:bg-gray-50 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-7 py-6 space-y-5">
                {error && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Plan Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="Free, Basic, Pro..."
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#042C53]/20 focus:border-[#042C53]/40 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Billing Cycle</label>
                    <select
                      value={form.billingCycle}
                      onChange={e => setForm({ ...form, billingCycle: e.target.value as any })}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#042C53]/20 focus:border-[#042C53]/40 transition bg-white"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                      <option value="one-time">One-Time</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Description *</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    rows={2}
                    placeholder="Who is this plan for..."
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#042C53]/20 focus:border-[#042C53]/40 transition resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Price (Rs.) *</label>
                    <input
                      type="number" min={0} value={form.price}
                      onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#042C53]/20 focus:border-[#042C53]/40 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Sort Order</label>
                    <input
                      type="number" value={form.sortOrder}
                      onChange={e => setForm({ ...form, sortOrder: Number(e.target.value) })}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#042C53]/20 focus:border-[#042C53]/40 transition"
                    />
                  </div>
                </div>

                {/* Limits */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-3">Plan Limits</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1.5">Max Properties (999 = unlimited)</label>
                      <input
                        type="number" min={1} value={form.limits.maxProperties}
                        onChange={e => setForm({ ...form, limits: { ...form.limits, maxProperties: Number(e.target.value) } })}
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#042C53]/20 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1.5">Max Images per property</label>
                      <input
                        type="number" min={1} value={form.limits.maxImages}
                        onChange={e => setForm({ ...form, limits: { ...form.limits, maxImages: Number(e.target.value) } })}
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#042C53]/20 transition"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {[
                      { key: 'featuredListings', label: 'Featured Listings' },
                      { key: 'prioritySupport',  label: 'Priority Support' },
                      { key: 'analytics',        label: 'Analytics' },
                    ].map(({ key, label }) => (
                      <label
                        key={key}
                        className="flex items-center gap-2 cursor-pointer bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-xs text-gray-600 hover:bg-gray-100 transition"
                      >
                        <input
                          type="checkbox"
                          checked={form.limits[key as keyof PlanLimits] as boolean}
                          onChange={e => setForm({ ...form, limits: { ...form.limits, [key]: e.target.checked } })}
                          className="rounded accent-[#042C53]"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="block text-xs font-medium text-gray-600">Features</label>
                    <button type="button" onClick={addFeature}
                      className="text-xs text-[#042C53] hover:underline flex items-center gap-1 font-medium">
                      <Plus className="w-3 h-3" /> Add feature
                    </button>
                  </div>
                  <div className="space-y-2">
                    {form.features.map((f, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          type="text" value={f}
                          onChange={e => handleFeatureChange(i, e.target.value)}
                          placeholder={`Feature ${i + 1}`}
                          className="flex-1 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#042C53]/20 transition"
                        />
                        <button type="button" onClick={() => removeFeature(i)}
                          className="text-gray-300 hover:text-red-400 p-2.5 hover:bg-red-50 rounded-xl transition">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex gap-5 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-600">
                    <input type="checkbox" checked={form.isActive}
                      onChange={e => setForm({ ...form, isActive: e.target.checked })}
                      className="rounded accent-[#042C53]" />
                    Active
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-600">
                    <input type="checkbox" checked={form.isPopular}
                      onChange={e => setForm({ ...form, isPopular: e.target.checked })}
                      className="rounded accent-[#042C53]" />
                    Mark as Popular
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 px-7 pb-7">
                <button onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="px-5 py-2.5 text-sm text-white bg-[#042C53] hover:bg-[#063a6e] rounded-xl font-medium flex items-center gap-2 disabled:opacity-50 transition">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingPlan ? 'Update Plan' : 'Create Plan'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Delete Confirm ── */}
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#042C53]/30 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-800 mb-2">Delete this plan?</h3>
              <p className="text-gray-400 text-sm mb-7 leading-relaxed">
                This action cannot be undone. All associated data will be removed.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)}
                  className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition text-gray-600">
                  Cancel
                </button>
                <button onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 text-sm text-white bg-red-500 hover:bg-red-600 rounded-xl font-medium transition">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}