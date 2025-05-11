import Customer from '../models/Customer.js'
import { parseRulesToQuery } from '../utils/ruleParser.js'

export const previewAudienceSize = async (req, res) => {
  try {
    console.log('📥 Incoming request body:', req.body)  

    const { rules } = req.body
    const mongoQuery = parseRulesToQuery(rules)

    console.log('🧠 Converted MongoDB query:', mongoQuery)

    const size = await Customer.countDocuments(mongoQuery)
    res.json({ size })
  } catch (err) {
    console.error('Preview error:', err.message)
    res.status(500).json({ error: 'Failed to preview audience' })
  }
}
export const saveSegment = async (req, res) => {
  try {
    const { name, rules, audienceSize } = req.body
    const segment = new Segment({ name, rules, audienceSize })
    await segment.save()
    res.status(201).json({ message: 'Segment saved successfully' })
  } catch (err) {
    console.error('Error saving segment:', err)
    res.status(500).json({ error: 'Failed to save segment' })
  }
}

