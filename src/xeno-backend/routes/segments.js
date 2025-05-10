import express from 'express'
import { previewAudienceSize, saveSegment } from '../controllers/segmentController.js'

const router = express.Router()

// POST /api/segments/preview
router.post('/preview', previewAudienceSize)
router.post('/save', saveSegment) 

export default router
