 // File: models/User.ts

import mongoose, { Schema, Document, Model } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  name:      string
  email:     string
  password:  string
  role:      'user' | 'admin'
  phone:     string
  isActive:  boolean
  createdAt: Date
  updatedAt: Date
  comparePassword(candidate: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role:     { type: String, enum: ['user', 'admin'], default: 'user' },
    phone:    { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

// Hash password before save
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  const salt    = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Compare password method
UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password)
}

// ✅ Safe model registration — no delete, no cache issue
const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>('User', UserSchema)

export default User