 import mongoose, { Schema, Document, Model, Types } from 'mongoose'

// ── Property-Type Specific Content ──────────────────────────
export interface IPropertyTypeContent {
  propertyType: Types.ObjectId   // ref: 'PropertyType'
  purpose:      'rent' | 'buy' | 'both'
  metaTitle:    string
  metaDescription: string
  content:      string           // rich text HTML
}

const PropertyTypeContentSchema = new Schema<IPropertyTypeContent>(
  {
    propertyType:    { type: Schema.Types.ObjectId, ref: 'PropertyType', required: true },
    purpose:         { type: String, enum: ['rent', 'buy', 'both'], default: 'rent' },
    metaTitle:       { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    content:         { type: String, default: '' },
  },
  { _id: true }
)

// ── Main City Interface ──────────────────────────────────────
export interface ICity extends Document {
  name:     string
  slug:     string
  state:    string          // e.g. Sindh
  country:  string          // e.g. Pakistan
  thumbnail: string         // image URL

  // General SEO
  metaTitle:       string
  metaDescription: string
  canonicalUrl:    string
  description:     string   // rich text HTML — general

  // Rent Page SEO
  rentMetaTitle:       string
  rentMetaDescription: string
  rentContent:         string   // rich text HTML

  // Buy Page SEO
  buyMetaTitle:       string
  buyMetaDescription: string
  buyContent:         string   // rich text HTML

  // Property-Type Specific Content (e.g. "House for Rent in Karachi")
  propertyTypeContent: IPropertyTypeContent[]

  isActive:  boolean
  createdAt: Date
  updatedAt: Date
}

// ── Schema ───────────────────────────────────────────────────
const CitySchema = new Schema<ICity>(
  {
    name:      { type: String, required: true, trim: true, unique: true },
    slug:      { type: String, required: true, trim: true, unique: true, lowercase: true },
    state:     { type: String, default: '' },
    country:   { type: String, default: '' },
    thumbnail: { type: String, default: '' },

    // General SEO
    metaTitle:       { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    canonicalUrl:    { type: String, default: '' },
    description:     { type: String, default: '' },

    // Rent SEO
    rentMetaTitle:       { type: String, default: '' },
    rentMetaDescription: { type: String, default: '' },
    rentContent:         { type: String, default: '' },

    // Buy SEO
    buyMetaTitle:       { type: String, default: '' },
    buyMetaDescription: { type: String, default: '' },
    buyContent:         { type: String, default: '' },

    // Property-Type Specific
    propertyTypeContent: { type: [PropertyTypeContentSchema], default: [] },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

// ── Auto-generate meta if empty (on save) ───────────────────
CitySchema.pre('save', function () {
  if (!this.metaTitle && this.name)
    this.metaTitle = `Properties in ${this.name} | RentGhars`

  if (!this.metaDescription && this.name)
    this.metaDescription = `Find properties for rent and sale in ${this.name}. Browse houses, apartments, flats and more on RentGhars.`

  if (!this.rentMetaTitle && this.name)
    this.rentMetaTitle = `Houses for Rent in ${this.name} | RentGhars`

  if (!this.rentMetaDescription && this.name)
    this.rentMetaDescription = `Browse houses, apartments and flats for rent in ${this.name}. Find your perfect home on RentGhars.`

  if (!this.buyMetaTitle && this.name)
    this.buyMetaTitle = `Properties for Sale in ${this.name} | RentGhars`

  if (!this.buyMetaDescription && this.name)
    this.buyMetaDescription = `Browse properties for sale in ${this.name}. Find your dream home on RentGhars.`
})

const City: Model<ICity> =
  mongoose.models.City || mongoose.model<ICity>('City', CitySchema)

export default City