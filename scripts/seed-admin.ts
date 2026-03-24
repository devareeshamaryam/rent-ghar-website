// scripts/seed-admin.ts
// Production-level admin seeder
// Chalaao: npx ts-node --project tsconfig.seed.json scripts/seed-admin.ts

import mongoose, { Schema, Document, Model } from 'mongoose'
import bcrypt from 'bcryptjs'

// ── Inline User model (import issues avoid karne ke liye) ──
interface IUser extends Document {
  name:     string
  email:    string
  password: string
  role:     'user' | 'admin'
  phone:    string
  isActive: boolean
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

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  const salt    = await bcrypt.genSalt(12) // production: 12 rounds
  this.password = await bcrypt.hash(this.password, salt)
})

const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>('User', UserSchema)

// ── Admin Config — sirf yahan change karo ──────────────────
const ADMIN = {
  name:     'Super Admin',
  email:    'admin@rentghars.com',
  password: 'Admin@RentGhars2025!',   // strong password
  phone:    '+92-300-0000000',
  role:     'admin' as const,
  isActive: true,
}
// ───────────────────────────────────────────────────────────

async function seedAdmin() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rentghars'

  console.log('\n🔗 MongoDB se connect ho raha hai...')
  await mongoose.connect(MONGODB_URI)
  console.log('✅ Connected!\n')

  // Check — pehle se admin exist karta hai?
  const existing = await User.findOne({ email: ADMIN.email })

  if (existing) {
    if (existing.role !== 'admin') {
      // User hai but admin nahi — role upgrade karo
      existing.role     = 'admin'
      existing.isActive = true
      await existing.save()
      console.log(`⚠️  User already tha — role upgrade kar diya: ${ADMIN.email}`)
    } else {
      console.log(`ℹ️  Admin already exist karta hai: ${ADMIN.email}`)
      console.log('   Kuch change nahi kiya.\n')
    }
  } else {
    // Naya admin banao
    const admin = new User(ADMIN)
    await admin.save()
    console.log('🎉 Admin successfully create ho gaya!\n')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`   📧 Email   : ${ADMIN.email}`)
    console.log(`   🔑 Password: ${ADMIN.password}`)
    console.log(`   👤 Role    : ${ADMIN.role}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  }

  await mongoose.disconnect()
  console.log('🔌 Disconnected. Done!\n')
  process.exit(0)
}

seedAdmin().catch(err => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})