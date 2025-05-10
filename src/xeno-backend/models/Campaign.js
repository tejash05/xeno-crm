import mongoose from 'mongoose'

const campaignSchema = new mongoose.Schema({
  name: String,
  segmentName: String,
  audienceSize: Number,
  rules: Array,
  sent: {
    type: Number,
    default: 0
  },
  failed: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'failed'],
    default: 'draft'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Campaign', campaignSchema)
