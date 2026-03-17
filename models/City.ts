import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ICity extends Document {
  name: string
  slug: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const CitySchema = new Schema<ICity>(
  {
    name:     { type: String, required: true, trim: true, unique: true },
    slug:     { type: String, required: true, trim: true, unique: true, lowercase: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const City: Model<ICity> =
  mongoose.models.City || mongoose.model<ICity>('City', CitySchema)

export default City