import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IPropertyType extends Document {
  name:     string
  slug:     string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const PropertyTypeSchema = new Schema<IPropertyType>(
  {
    name:     { type: String, required: true, trim: true, unique: true },
    slug:     { type: String, required: true, trim: true, unique: true, lowercase: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const PropertyType: Model<IPropertyType> =
  mongoose.models.PropertyType ||
  mongoose.model<IPropertyType>('PropertyType', PropertyTypeSchema)

export default PropertyType