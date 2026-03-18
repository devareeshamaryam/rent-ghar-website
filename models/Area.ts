 import mongoose, { Schema, Document, Model, Types } from 'mongoose'

export interface IArea extends Document {
  name:     string
  slug:     string
  city:     Types.ObjectId

  // General SEO
  metaTitle:       string
  metaDescription: string
  canonicalUrl:    string
  description:     string   // rich text HTML

  // Rent Page SEO
  rentMetaTitle:       string
  rentMetaDescription: string
  rentContent:         string   // rich text HTML

  isActive:  boolean
  createdAt: Date
  updatedAt: Date
}

const AreaSchema = new Schema<IArea>(
  {
    name:  { type: String, required: true, trim: true },
    slug:  { type: String, required: true, trim: true, lowercase: true },
    city:  { type: Schema.Types.ObjectId, ref: 'City', required: true },

    // General SEO — auto-generated if empty
    metaTitle:       { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    canonicalUrl:    { type: String, default: '' },
    description:     { type: String, default: '' },

    // Rent Page SEO
    rentMetaTitle:       { type: String, default: '' },
    rentMetaDescription: { type: String, default: '' },
    rentContent:         { type: String, default: '' },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

// Auto-generate meta before save if empty
AreaSchema.pre('save', async function () {
  // Populate city name for auto-generation
  if (!this.metaTitle && this.name) {
    this.metaTitle = `${this.name} Properties | RentGhars`
  }
  if (!this.metaDescription && this.name) {
    this.metaDescription = `Find rental properties in ${this.name}. Browse houses, apartments, flats and more on RentGhars.`
  }
  if (!this.rentMetaTitle && this.name) {
    this.rentMetaTitle = `Houses for Rent in ${this.name} | RentGhars`
  }
  if (!this.rentMetaDescription && this.name) {
    this.rentMetaDescription = `Browse houses, apartments and flats for rent in ${this.name}. Find your perfect home on RentGhars.`
  }
})

AreaSchema.index({ slug: 1, city: 1 }, { unique: true })

const Area: Model<IArea> =
  mongoose.models.Area || mongoose.model<IArea>('Area', AreaSchema)

export default Area