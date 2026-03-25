import mongoose, { Schema, Document } from 'mongoose'

export interface IPlanLimits {
  maxProperties: number
  maxImages: number
  featuredListings: boolean
  prioritySupport: boolean
  analytics: boolean
}

export interface IPlan extends Document {
  name: string
  description: string
  price: number
  billingCycle: 'monthly' | 'yearly' | 'one-time'
  features: string[]
  limits: IPlanLimits
  isActive: boolean
  isPopular: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

const PlanSchema = new Schema<IPlan>(
  {
    name: {
      type: String,
      required: [true, 'Plan name is required'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly', 'one-time'],
      default: 'monthly',
    },
    features: [{ type: String, trim: true }],
    limits: {
      maxProperties: { type: Number, default: 3 },
      maxImages:     { type: Number, default: 5 },
      featuredListings: { type: Boolean, default: false },
      prioritySupport:  { type: Boolean, default: false },
      analytics:        { type: Boolean, default: false },
    },
    isActive:   { type: Boolean, default: true },
    isPopular:  { type: Boolean, default: false },
    sortOrder:  { type: Number,  default: 0 },
  },
  { timestamps: true }
)

export default mongoose.models.Plan ||
  mongoose.model<IPlan>('Plan', PlanSchema)