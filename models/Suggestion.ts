// models/Suggestion.ts
import mongoose, { Schema, Document, models } from 'mongoose'

export interface ISuggestion extends Document {
  firstName: string
  lastName?: string
  email: string
  message: string
  createdAt: Date
}

const SuggestionSchema = new Schema<ISuggestion>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName:  { type: String, trim: true },
    email:     { type: String, required: true, trim: true },
    message:   { type: String, required: true, trim: true },
  },
  { timestamps: true }
)

const Suggestion = models.Suggestion || mongoose.model<ISuggestion>('Suggestion', SuggestionSchema)
export default Suggestion