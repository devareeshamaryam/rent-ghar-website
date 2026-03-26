import mongoose, { Schema, Document } from "mongoose";

export interface ISubscriptionRequest extends Document {
  userId: mongoose.Types.ObjectId;
  userName: string;
  userEmail: string;
  planId: mongoose.Types.ObjectId;
  planName: string;
  planPrice: number;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionRequestSchema = new Schema<ISubscriptionRequest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
    planName: {
      type: String,
      required: true,
    },
    planPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const SubscriptionRequest =
  mongoose.models.SubscriptionRequest ||
  mongoose.model<ISubscriptionRequest>(
    "SubscriptionRequest",
    SubscriptionRequestSchema
  );

export default SubscriptionRequest;