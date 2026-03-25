import mongoose, { Schema, Document } from 'mongoose'

export interface IUserSubscription extends Document {
  userId:    mongoose.Types.ObjectId
  planId:    mongoose.Types.ObjectId
  status:    'active' | 'cancelled' | 'expired'
  startDate: Date
  endDate:   Date | null
  createdAt: Date
  updatedAt: Date
}

const UserSubscriptionSchema = new Schema<IUserSubscription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: 'Plan',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired'],
      default: 'active',
    },
    startDate: { type: Date, default: Date.now },
    endDate:   { type: Date, default: null },
  },
  { timestamps: true }
)

// Ek user ka sirf ek active subscription ho
UserSubscriptionSchema.index({ userId: 1, status: 1 })

export default mongoose.models.UserSubscription ||
  mongoose.model<IUserSubscription>('UserSubscription', UserSubscriptionSchema)