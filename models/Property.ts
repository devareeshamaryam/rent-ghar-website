 import mongoose, { Schema, Document, Model, Types } from 'mongoose'

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

export interface IProperty extends Document {
  propertyId:      string
  title:           string
  slug:            string
  propertyType:    Types.ObjectId
  city:            Types.ObjectId
  area:            Types.ObjectId
  purpose:         'For Rent' | 'For Sale'
  address:         string
  lat:             number
  lng:             number
  bedrooms:        number
  bathrooms:       number
  marla:           number
  kanal:           number
  price:           number
  mainPhoto:       string
  additionalPhotos: string[]
  youtubeUrl:      string
  description:     string
  features:        string[]
  nearbyPlaces:    INearbyPlaces
  contactNumber:   string
  whatsappNumber:  string
  seo:             ISeo
  status:          'active' | 'pending' | 'rejected' | 'expired'
  featured:        boolean
  views:           number
  owner?:          Types.ObjectId
  createdAt:       Date
  updatedAt:       Date
}

const NearbyItemSchema = new Schema<INearbyItem>(
  { name: String, time: String },
  { _id: false }
)

const PropertySchema = new Schema<IProperty>(
  {
    propertyId:   { type: String, unique: true },
    title:        { type: String, required: true, trim: true },
    slug:         { type: String, required: true, trim: true, unique: true, lowercase: true },
    propertyType: { type: Schema.Types.ObjectId, ref: 'PropertyType', required: true },
    city:         { type: Schema.Types.ObjectId, ref: 'City',         required: true },
    area:         { type: Schema.Types.ObjectId, ref: 'Area',         required: true },
    purpose:      { type: String, enum: ['For Rent', 'For Sale'], default: 'For Rent' },
    address:      { type: String, trim: true },
    lat:          { type: Number, default: 0 },
    lng:          { type: Number, default: 0 },
    bedrooms:     { type: Number, default: 0 },
    bathrooms:    { type: Number, default: 0 },
    marla:        { type: Number, default: 0 },
    kanal:        { type: Number, default: 0 },
    price:        { type: Number, required: true },
    mainPhoto:        { type: String, default: '' },
    additionalPhotos: [{ type: String }],
    youtubeUrl:   { type: String, default: '' },
    description:  { type: String, default: '' },
    features:     [{ type: String }],
    nearbyPlaces: {
      schools:     { type: [NearbyItemSchema], default: [] },
      hospitals:   { type: [NearbyItemSchema], default: [] },
      restaurants: { type: [NearbyItemSchema], default: [] },
      shopping:    { type: [NearbyItemSchema], default: [] },
    },
    contactNumber:  { type: String, default: '' },
    whatsappNumber: { type: String, default: '' },
    seo: {
      metaTitle:       { type: String, default: '' },
      metaDescription: { type: String, default: '' },
    },
    status:   { type: String, enum: ['active', 'pending', 'rejected', 'expired'], default: 'pending' },
    featured: { type: Boolean, default: false },
    views:    { type: Number, default: 0 },
    owner:    { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

// ─── Auto-generate propertyId ─────────────────────────────
PropertySchema.pre('save', async function () {
  if (!this.propertyId) {
    const year  = new Date().getFullYear()
    const count = await (this.constructor as Model<IProperty>).countDocuments()
    const pad   = String(count + 1).padStart(5, '0')
    this.propertyId = `RG-${year}-${pad}`
  }
})

// ─── Indexes ──────────────────────────────────────────────
PropertySchema.index({ city: 1, area: 1 })
PropertySchema.index({ status: 1 })
PropertySchema.index({ price: 1 })
PropertySchema.index({ createdAt: -1 })

const Property: Model<IProperty> =
  mongoose.models.Property ||
  mongoose.model<IProperty>('Property', PropertySchema)

export default Property