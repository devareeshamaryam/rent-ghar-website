 'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  Plus, Pencil, Trash2, Star, ToggleLeft, ToggleRight,
  X, Check, Loader2, Package, AlertCircle,
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
  const searchParams = useSearchParams()
  const router       = useRouter()

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
    } catch {
      setError('Plans load karne mein masla hua')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPlans() }, [])

  // Sidebar "Add Package" → ?action=add → auto modal open
  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      openAdd()
      router.replace('/admin/pricing') // URL clean karo
    }
  }, [searchParams])

  const openAdd = () => {
    setEditingPlan(null)
    setForm(EMPTY_PLAN)
    setError('')
    setShowModal(true)
  }

  const openEdit = (plan: Plan) => {
    setEditingPlan(plan)
    setForm({
      name:         plan.name,
      description:  plan.description,
      price:        plan.price,
      billingCycle: plan.billingCycle,
      features:     plan.features.length ? plan.features : [''],
      limits:       { ...plan.limits },
      isActive:     plan.isActive,
      isPopular:    plan.isPopular,
      sortOrder:    plan.sortOrder,
    })
    setError('')
    setShowModal(true)
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
      setError('Naam aur description zaroori hain'); return
    }
    setSaving(true); setError('')
    try {
      const payload = { ...form, features: form.features.filter(f => f.trim()), price: Number(form.price) }
      const url    = editingPlan ? `/api/admin/plans/${editingPlan._id}` : '/api/admin/plans'
      const method = editingPlan ? 'PUT' : 'POST'
      const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data   = await res.json()
      if (data.success) {
        setSuccess(editingPlan ? 'Package update ho gaya! ✅' : 'Naya package ban gaya! 🎉')
        setShowModal(false); fetchPlans()
        setTimeout(() => setSuccess(''), 3000)
      } else { setError(data.message || 'Kuch masla hua') }
    } catch { setError('Server se connection nahi ho pa raha') }
    finally { setSaving(false) }
  }

  const handleToggle = async (plan: Plan) => {
    try {
      await fetch(`/api/admin/plans/${plan._id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !plan.isActive }),
      })
      fetchPlans()
    } catch { setError('Toggle karne mein masla hua') }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const res  = await fetch(`/api/admin/plans/${deleteId}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setSuccess('Package delete ho gaya!')
        setDeleteId(null); fetchPlans()
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch { setError('Delete karne mein masla hua') }
  }

  const cycleLabel: Record<string, string> = { monthly: '/month', yearly: '/year', 'one-time': 'one-time' }

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-7 h-7 text-[#042C53]" /> Pricing Packages
          </h1>
          <p className="text-gray-500 text-sm mt-1">Dynamic packages banao, edit karo ya delete karo</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-[#042C53] hover:bg-[#053a6e] text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          <Plus className="w-4 h-4" /> Naya Package
        </button>
      </div>

      {/* Alerts */}
      {success && (
        <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          <Check className="w-4 h-4" /> {success}
        </div>
      )}
      {error && !showModal && (
        <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-[#042C53]" />
        </div>
      ) : plans.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">Koi package nahi hai abhi</p>
          <p className="text-sm mb-4">Pehla package banao!</p>
          <button onClick={openAdd}
            className="inline-flex items-center gap-2 bg-[#042C53] text-white px-4 py-2 rounded-lg text-sm">
            <Plus className="w-4 h-4" /> Package Banao
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {plans.map(plan => (
            <div key={plan._id}
              className={`relative rounded-2xl border-2 bg-white shadow-sm transition ${plan.isPopular ? 'border-[#042C53]' : 'border-gray-200'} ${!plan.isActive ? 'opacity-60' : ''}`}>

              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[#042C53] text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" /> Popular
                  </span>
                </div>
              )}

              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                    <p className="text-gray-500 text-sm mt-0.5 line-clamp-2">{plan.description}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ml-2 flex-shrink-0 ${plan.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {plan.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="mb-4">
                  <span className="text-3xl font-extrabold text-gray-900">Rs. {plan.price.toLocaleString()}</span>
                  <span className="text-gray-400 text-sm ml-1">{cycleLabel[plan.billingCycle]}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-gray-600">
                  <div className="bg-gray-50 rounded-lg px-3 py-2">🏠 {plan.limits.maxProperties === 999 ? 'Unlimited' : plan.limits.maxProperties} properties</div>
                  <div className="bg-gray-50 rounded-lg px-3 py-2">🖼️ {plan.limits.maxImages === 999 ? 'Unlimited' : plan.limits.maxImages} images</div>
                  {plan.limits.featuredListings && <div className="bg-blue-50 text-blue-600 rounded-lg px-3 py-2">⭐ Featured</div>}
                  {plan.limits.prioritySupport  && <div className="bg-purple-50 text-purple-600 rounded-lg px-3 py-2">🎧 Priority</div>}
                  {plan.limits.analytics        && <div className="bg-green-50 text-green-600 rounded-lg px-3 py-2">📊 Analytics</div>}
                </div>

                {plan.features.length > 0 && (
                  <ul className="space-y-1 mb-4">
                    {plan.features.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" /> {f}
                      </li>
                    ))}
                    {plan.features.length > 3 && (
                      <li className="text-xs text-gray-400 pl-5">+{plan.features.length - 3} aur features</li>
                    )}
                  </ul>
                )}

                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <button onClick={() => openEdit(plan)}
                    className="flex items-center gap-1.5 text-sm text-[#042C53] hover:bg-blue-50 px-3 py-1.5 rounded-lg transition">
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={() => handleToggle(plan)}
                    className="flex items-center gap-1.5 text-sm text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition">
                    {plan.isActive ? <ToggleRight className="w-4 h-4 text-green-500" /> : <ToggleLeft className="w-4 h-4 text-gray-400" />}
                    {plan.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => setDeleteId(plan._id)}
                    className="flex items-center gap-1.5 text-sm text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition ml-auto">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                {editingPlan ? 'Package Edit Karo' : 'Naya Package Banao'}
              </h2>
              <button onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  <AlertCircle className="w-4 h-4" /> {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Package Naam *</label>
                  <input type="text" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Free, Basic, Pro..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#042C53]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Billing Cycle</label>
                  <select value={form.billingCycle}
                    onChange={e => setForm({ ...form, billingCycle: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#042C53]">
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="one-time">One-Time</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={2} placeholder="Yeh package kis ke liye hai..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#042C53] resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qeemat (Rs.) *</label>
                  <input type="number" min={0} value={form.price}
                    onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#042C53]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <input type="number" value={form.sortOrder}
                    onChange={e => setForm({ ...form, sortOrder: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#042C53]" />
                </div>
              </div>

              {/* Limits */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Package Limits</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Max Properties (999 = unlimited)</label>
                    <input type="number" min={1} value={form.limits.maxProperties}
                      onChange={e => setForm({ ...form, limits: { ...form.limits, maxProperties: Number(e.target.value) } })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#042C53]" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Max Images per property</label>
                    <input type="number" min={1} value={form.limits.maxImages}
                      onChange={e => setForm({ ...form, limits: { ...form.limits, maxImages: Number(e.target.value) } })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#042C53]" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-3">
                  {[
                    { key: 'featuredListings', label: '⭐ Featured Listings' },
                    { key: 'prioritySupport',  label: '🎧 Priority Support' },
                    { key: 'analytics',        label: '📊 Analytics' },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer bg-gray-50 rounded-lg px-3 py-2 text-sm">
                      <input type="checkbox"
                        checked={form.limits[key as keyof PlanLimits] as boolean}
                        onChange={e => setForm({ ...form, limits: { ...form.limits, [key]: e.target.checked } })}
                        className="rounded text-[#042C53]" />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Features</label>
                  <button type="button" onClick={addFeature}
                    className="text-xs text-[#042C53] hover:underline flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Feature add karo
                  </button>
                </div>
                <div className="space-y-2">
                  {form.features.map((f, i) => (
                    <div key={i} className="flex gap-2">
                      <input type="text" value={f}
                        onChange={e => handleFeatureChange(i, e.target.value)}
                        placeholder={`Feature ${i + 1}`}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#042C53]" />
                      <button type="button" onClick={() => removeFeature(i)}
                        className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="checkbox" checked={form.isActive}
                    onChange={e => setForm({ ...form, isActive: e.target.checked })}
                    className="rounded text-[#042C53]" />
                  Active
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="checkbox" checked={form.isPopular}
                    onChange={e => setForm({ ...form, isPopular: e.target.checked })}
                    className="rounded text-[#042C53]" />
                  ⭐ Popular badge dikhao
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 pb-6">
              <button onClick={() => setShowModal(false)}
                className="px-5 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="px-5 py-2 text-sm text-white bg-[#042C53] hover:bg-[#053a6e] rounded-lg font-medium flex items-center gap-2 disabled:opacity-60">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingPlan ? 'Update Karo' : 'Package Banao'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Package Delete Karo?</h3>
            <p className="text-gray-500 text-sm mb-6">Yeh action wapas nahi ho sakta. Kya aap sure hain?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleDelete}
                className="flex-1 px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium">
                 Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}