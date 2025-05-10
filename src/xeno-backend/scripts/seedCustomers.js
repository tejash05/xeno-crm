import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Customer from '../models/Customer.js'

dotenv.config()

const seedData = [
  {
    name: 'Alice Sharma',
    email: 'alice@example.com',
    phone: '9123456780',
    location: 'Delhi',
    tags: ['high-value'],
    total_spend: 1500,
    visits: 25,
    last_active_days: 5
  },
  {
    name: 'Rahul Singh',
    email: 'rahul@example.com',
    phone: '9988776655',
    location: 'Mumbai',
    tags: ['email-subscribed'],
    total_spend: 450,
    visits: 10,
    last_active_days: 40
  },
  {
    name: 'Sneha Kapoor',
    email: 'sneha@example.com',
    phone: '8877665544',
    location: 'Bangalore',
    tags: ['inactive'],
    total_spend: 200,
    visits: 3,
    last_active_days: 90
  },
  {
    name: 'Mohit Jain',
    email: 'mohit@example.com',
    phone: '9012345678',
    location: 'Pune',
    tags: ['email-subscribed', 'high-value'],
    total_spend: 800,
    visits: 15,
    last_active_days: 15
  }
]

const runSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    await Customer.deleteMany({})
    await Customer.insertMany(seedData)
    console.log('✅ Seeded customer data successfully')
    process.exit(0)
  } catch (err) {
    console.error('❌ Error seeding customer data:', err)
    process.exit(1)
  }
}

runSeed()
