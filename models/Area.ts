import mongoose, { Schema, Document, Model, Types } from 'mongoose'

export interface IArea extends Document {
  name:     string
  slug:     string
  city:     Types.ObjectId   // ref → City
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const AreaSchema = new Schema<IArea>(
  {
    name:     { type: String, required: true, trim: true },
    slug:     { type: String, required: true, trim: true, lowercase: true },
    city:     { type: Schema.Types.ObjectId, ref: 'City', required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

// One area name can exist in multiple cities but not twice in the same city
AreaSchema.index({ slug: 1, city: 1 }, { unique: true })

const Area: Model<IArea> =
  mongoose.models.Area || mongoose.model<IArea>('Area', AreaSchema)

export default Area