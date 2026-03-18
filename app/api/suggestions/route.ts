 // app/api/suggestions/route.ts
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'        // your existing db connection
import Suggestion from '@/models/Suggestion'   // model below

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const { firstName, lastName, email, message } = body

    if (!firstName || !email || !message) {
      return NextResponse.json(
        { error: 'firstName, email and message are required' },
        { status: 400 }
      )
    }

    const suggestion = await Suggestion.create({ firstName, lastName, email, message })
    return NextResponse.json({ success: true, suggestion }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    await connectDB()
    const suggestions = await Suggestion.find().sort({ createdAt: -1 })
    return NextResponse.json({ success: true, suggestions })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}