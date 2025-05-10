import express from 'express'
import { createCustomer, createOrder } from '../controllers/ingestController.js'

const router = express.Router()

// These now work correctly with /api base
router.post('/customers', createCustomer)
router.post('/orders', createOrder)

export default router
