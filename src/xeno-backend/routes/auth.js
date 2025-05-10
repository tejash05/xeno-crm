import express from 'express'
import { verifyGoogleToken, handleSignup, handleLogin } from '../controllers/authController.js'

const router = express.Router()

// Local Auth
router.post('/signup', handleSignup)
router.post('/login', handleLogin)

// Google Auth
router.post('/google-login', verifyGoogleToken)

export default router
