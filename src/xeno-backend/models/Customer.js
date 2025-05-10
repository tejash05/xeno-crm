import mongoose from 'mongoose'
const customerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  location: String,
  tags: [String],
  total_spend: Number,
  visits: Number,
  last_active_days: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model('Customer', customerSchema)
