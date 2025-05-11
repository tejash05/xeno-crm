import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import ingestRoutes from './routes/ingest.js'
import segmentRoutes from './routes/segments.js'
import campaignRoutes from './routes/campaigns.js'
import aiRoutes from './routes/ai.js'
import authRoutes from './routes/auth.js'

dotenv.config();
const app = express();



//  CORS configuration
app.use(cors({
  origin: 'https://xeno-frontend-3qja.onrender.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH' ,  'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,          // important: false means Express handles the preflight
  optionsSuccessStatus: 204          // avoid browser CORS errors on OPTIONS
}))

app.use(express.json());

app.use('/api/ai', aiRoutes)

app.use('/api/auth', authRoutes)

app.use('/api', ingestRoutes)
app.use('/api/segments', segmentRoutes)
app.use('/api/campaigns', campaignRoutes)

app.all('/{*any}', (req, res) => {
  res.status(404).json({ error: 'Not found' })
})

const PORT = process.env.PORT || 5050

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`))
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err))
