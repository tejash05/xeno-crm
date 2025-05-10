import express from 'express'
import {
  getCampaignHistory,
  createCampaign,
  handleDeliveryReceipt,
  updateCampaignStatus
} from '../controllers/campaignController.js'

const router = express.Router()

router.get('/', getCampaignHistory)
router.post('/', createCampaign) // ← required for saving
router.post('/delivery-receipt', handleDeliveryReceipt)
router.patch('/:id', updateCampaignStatus)

export default router
