import { OAuth2Client } from 'google-auth-library'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js' // Ensure you have a User model

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'
// 🔐 Google OAuth2
export const verifyGoogleToken = async (req, res) => {
  const { token } = req.body
  if (!token) return res.status(400).json({ error: 'Token missing' })

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    })

    const payload = ticket.getPayload()
    const { sub, email, name, picture } = payload

    // Optional: check if user exists, else create one
    let user = await User.findOne({ email })
    if (!user) {
      user = await User.create({ name, email, picture, authProvider: 'google' })
    }

    res.json({ id: user._id, email: user.email, name: user.name, picture: user.picture })
  } catch (err) {
    console.error('❌ Google verification error:', err.message)
    res.status(401).json({ error: 'Invalid token' })
  }
}

// 📝 Local Signup
export const handleSignup = async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({ name, email, password: hashedPassword })
    await newUser.save()

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.status(201).json({ token, user: { id: newUser._id, name: newUser.name, email: newUser.email } })
  } catch (err) {
    console.error('❌ Signup error:', err)
    res.status(500).json({ error: 'Signup failed' })
  }
}

// POST /api/auth/login
export const handleLogin = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })

    if (!user) return res.status(404).json({ error: 'User not found' })

    if (!user.password) {
      return res.status(400).json({ error: 'This user signed up with Google. Use Google login.' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(401).json({ error: 'Invalid password' })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    res.json({ token, name: user.name, email: user.email })
  } catch (err) {
    console.error('❌ Login error:', err)
    res.status(500).json({ error: 'Login failed' })
  }
}