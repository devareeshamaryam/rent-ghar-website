import mongoose, { Schema, Document, Model, Types } from 'mongoose'

// ─── Sub-schemas ──────────────────────────────────────────
interface INearbyItem {
  name: string
  time: string
}

interface INearbyPlaces {
  schools:     INearbyItem[]
  hospitals:   INearbyItem[]
  restaurants: INearbyItem[]
  shopping:    INearbyItem[]
}

interface ISeo {
  metaTitle:       string
  metaDescription: string
}

// ─── Main interface ───────────────────────────────────────
export interface IProperty extends Document {
  // Identity
  propertyId: string              // auto-generated e.g. RG-2025-00001
  title:      string
  slug:       string

  // Classification
  propertyType: Types.ObjectId    // ref → PropertyType
  city:         Types.ObjectId    // ref → City
  area:         Types.ObjectId    // ref → Area
  purpose:      'For Rent' | 'For Sale'

  // Location
  address: string
  lat:     number
  lng:     number

  // Details
  bedrooms:  number
  bathrooms: number
  marla:     number
  kanal:     number
  price:     number

  // Media
  mainPhoto:        string        // cloudinary / local URL
  additionalPhotos: string[]
  youtubeUrl:       string

  // Content
  description: string             // HTML from TipTap

  // Features (array of keys e.g. ['parking','gas','security'])
  features: string[]

  // Nearby places
  nearbyPlaces: INearbyPlaces

  // Contact
  contactNumber:   string
  whatsappNumber:  string

  // SEO
  seo: ISeo

  // Status
  status:    'active' | 'pending' | 'rejected' | 'expired'
  featured:  boolean
  views:     number

  // Owner (ref → User — add later when auth is ready)
  owner?: Types.ObjectId

  createdAt: Date
  updatedAt: Date
}

// ─── Schema ───────────────────────────────────────────────
const NearbyItemSchema = new Schema<INearbyItem>(
  { name: String, time: String },
  { _id: false }
)

const PropertySchema = new Schema<IProperty>(
  {
    // Identity
    propertyId: {
      type:    String,
      unique:  true,
    },
    title: { type: String, required: true, trim: true },
    slug:  { type: String, required: true, trim: true, unique: true, lowercase: true },

    // Classification
    propertyType: { type: Schema.Types.ObjectId, ref: 'PropertyType', required: true },
    city:         { type: Schema.Types.ObjectId, ref: 'City',         required: true },
    area:         { type: Schema.Types.ObjectId, ref: 'Area',         required: true },
    purpose:      { type: String, enum: ['For Rent', 'For Sale'], default: 'For Rent' },

    // Location
    address: { type: String, trim: true },
    lat:     { type: Number, default: 0 },
    lng:     { type: Number, default: 0 },

    // Details
    bedrooms:  { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    marla:     { type: Number, default: 0 },
    kanal:     { type: Number, default: 0 },
    price:     { type: Number, required: true },

    // Media
    mainPhoto:        { type: String, default: '' },
    additionalPhotos: [{ type: String }],
    youtubeUrl:       { type: String, default: '' },

    // Content
    description: { type: String, default: '' },

    // Features
    features: [{ type: String }],

    // Nearby places
    nearbyPlaces: {
      schools:     { type: [NearbyItemSchema], default: [] },
      hospitals:   { type: [NearbyItemSchema], default: [] },
      restaurants: { type: [NearbyItemSchema], default: [] },
      shopping:    { type: [NearbyItemSchema], default: [] },
    },

    // Contact
    contactNumber:  { type: String, default: '' },
    whatsappNumber: { type: String, default: '' },

    // SEO
    seo: {
      metaTitle:       { type: String, default: '' },
      metaDescription: { type: String, default: '' },
    },

    // Status
    status:   { type: String, enum: ['active', 'pending', 'rejected', 'expired'], default: 'pending' },
    featured: { type: Boolean, default: false },
    views:    { type: Number, default: 0 },

    // Owner
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

// ─── Auto-generate propertyId before save ────────────────
PropertySchema.pre('save', async function (next) {
  if (!this.propertyId) {
    const year  = new Date().getFullYear()
    const count = await (this.constructor as Model<IProperty>).countDocuments()
    const pad   = String(count + 1).padStart(5, '0')
    this.propertyId = `RG-${year}-${pad}`
  }
  next()
})

// ─── Indexes for fast filtering ───────────────────────────
PropertySchema.index({ city: 1, area: 1 })
PropertySchema.index({ status: 1 })
PropertySchema.index({ price: 1 })
PropertySchema.index({ createdAt: -1 })

const Property: Model<IProperty> =
  mongoose.models.Property ||
  mongoose.model<IProperty>('Property', PropertySchema)

export default Property