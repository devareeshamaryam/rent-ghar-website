 // app/admin/suggestions/page.tsx
import connectDB from '@/lib/mongoose'
import Suggestion from '@/models/Suggestion'

interface ISuggestion {
  _id: string
  firstName: string
  lastName?: string
  email: string
  message: string
  createdAt: string
}

async function getSuggestions(): Promise<ISuggestion[]> {
  await connectDB()
  const data = await Suggestion.find().sort({ createdAt: -1 }).lean()
  return JSON.parse(JSON.stringify(data))
}

export default async function SuggestionsPage() {
  const suggestions = await getSuggestions()

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Suggestions</h1>
        <p className="text-sm text-gray-500 mt-1">
          All messages received from the Contact Us page
        </p>
      </div>

      {/* Stats badge */}
      <div className="flex items-center gap-2 mb-6">
        <span className="bg-[#042C53] text-white text-xs font-semibold px-3 py-1 rounded-full">
          {suggestions.length} total
        </span>
      </div>

      {/* Empty state */}
      {suggestions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="mb-4">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <p className="text-sm">No suggestions yet</p>
        </div>
      )}

      {/* Cards */}
      <div className="flex flex-col gap-4">
        {suggestions.map((s) => (
          <div
            key={s._id}
            className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              {/* Avatar + name */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#042C53] flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {s.firstName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {s.firstName} {s.lastName ?? ''}
                  </p>
                  <p className="text-xs text-gray-400">{s.email}</p>
                </div>
              </div>

              {/* Date */}
              <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                {new Date(s.createdAt).toLocaleDateString('en-PK', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>

            {/* Message */}
            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-lg px-4 py-3">
              {s.message}
            </p>

            {/* Reply button */}
            <div className="mt-3 flex justify-end">
              <a
                href={`mailto:${s.email}`}
                className="text-xs font-semibold text-[#042C53] hover:underline flex items-center gap-1"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Reply via Email
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}