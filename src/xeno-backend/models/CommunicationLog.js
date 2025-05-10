import mongoose from 'mongoose'

const logSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign'
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  messageId: String,
  status: {
    type: String,
    enum: ['sent', 'failed']
  },
  sentAt: Date,
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('CommunicationLog', logSchema)
