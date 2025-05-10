import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  amount: Number,
  status: String,
  items: [String],
  date: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model('Order', orderSchema)
