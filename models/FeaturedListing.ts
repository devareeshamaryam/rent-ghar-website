// models/FeaturedListing.ts
import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IFeaturedListing extends Document {
  property: Types.ObjectId
  isActive: boolean
  startDate: Date
  endDate: Date
  priority: number          // sorting ke liye (higher = zyada upar)
  createdAt: Date
  updatedAt: Date
}

const FeaturedListingSchema = new Schema<IFeaturedListing>(
  {
    property: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    priority: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

// Ek property ek baar se zyada active featured na ho
FeaturedListingSchema.index({ property: 1, isActive: 1 })

const FeaturedListing =
  mongoose.models.FeaturedListing ||
  mongoose.model<IFeaturedListing>('FeaturedListing', FeaturedListingSchema)

export default FeaturedListing