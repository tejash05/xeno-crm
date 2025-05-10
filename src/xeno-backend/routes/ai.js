import express from 'express'
import OpenAI from 'openai'


import dotenv from 'dotenv'
dotenv.config()

const router = express.Router()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
  
})

router.post('/suggest-messages', async (req, res) => {
  const { objective, audienceInfo } = req.body

  if (!objective) {
    return res.status(400).json({ error: 'Campaign objective is required' })
  }

  const prompt = `
  You are a smart campaign message generator.
  
  Generate 3 short, engaging SMS messages based on this campaign goal and audience traits:
  
  📌 Campaign Goal:
  "${objective}"
  
  👥 Audience Info:
  - Spent: ₹${audienceInfo?.total_spend ?? 'unknown'}
  - Last Active: ${audienceInfo?.last_active_days ?? 'unknown'} days ago
  - Tags: ${Array.isArray(audienceInfo?.tags) ? audienceInfo.tags.join(', ') : 'none'}
  
  💡 Instructions:
  - Make messages sound human and natural
  - Use tone that fits the audience (e.g., re-engage, reward, welcome)
  - Do NOT show raw data like "last_active_days > 60"
  - Format output as:
  1. ...
  2. ...
  3. ...
  `
  



  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    })

    const content = response.choices[0].message.content
    const messages = content
      .split('\n')
      .filter(line => line.match(/^\d+\./))
      .map(line => line.replace(/^\d+\.\s*/, ''))

    res.json({ messages })
  } catch (err) {
    console.error('❌ OpenAI error:', err)
    res.status(500).json({ error: 'Failed to generate message suggestions' })
  }
})

export default router
