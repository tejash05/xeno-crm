import mongoose from 'mongoose'

const segmentSchema = new mongoose.Schema({
  name: String,
  rules: [Object],
  audienceSize: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Segment', segmentSchema)
