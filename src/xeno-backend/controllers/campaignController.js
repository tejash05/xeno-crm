import Campaign from '../models/Campaign.js'
import CommunicationLog from '../models/CommunicationLog.js'
import axios from 'axios'
import Customer from '../models/Customer.js'
import { parseRulesToQuery } from '../utils/ruleParser.js'

// GET /api/campaigns
export const getCampaignHistory = async (req, res) => {
  try {
    const { status } = req.query
    const filter = status && status !== 'all' ? { status } : {}
    const campaigns = await Campaign.find(filter).sort({ createdAt: -1 })
    res.json(campaigns)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch campaigns' })
  }
}


// POST /api/campaigns
export const createCampaign = async (req, res) => {
  try {
    const newCampaign = new Campaign(req.body)
    await newCampaign.save()
    res.status(201).json({ message: 'Campaign created successfully' })
  } catch (err) {
    console.error('❌ Error saving campaign:', err)
    res.status(500).json({ error: 'Failed to save campaign' })
  }
}

// POST /api/delivery-receipt
export const handleDeliveryReceipt = async (req, res) => {
  const { messageId, status } = req.body
  if (!messageId || !status) {
    return res.status(400).json({ error: 'messageId and status are required' })
  }

  try {
    await CommunicationLog.findOneAndUpdate(
      { messageId },
      { status, updatedAt: new Date() }
    )
    res.json({ message: 'Status updated successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' })
  }
}

// PATCH /api/campaigns/:id

export const updateCampaignStatus = async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  if (!status || !['sent', 'failed'].includes(status)) {
    return res.status(400).json({ error: 'Valid status is required (sent or failed)' })
  }

  try {
    const campaign = await Campaign.findById(id)
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' })

    const customerQuery = parseRulesToQuery(campaign.rules)
    const customers = await Customer.find(customerQuery)

    const logs = customers.map((customer, i) => ({
      campaignId: id,
      messageId: `${id}-${i}`,
      customerId: customer._id,
      status,
      sentAt: new Date()
    }))

    await CommunicationLog.insertMany(logs)

    const updated = await Campaign.findByIdAndUpdate(
      id,
      {
        status,
        sent: status === 'sent' ? customers.length : 0,
        failed: status === 'failed' ? customers.length : 0
      },
      { new: true }
    )

    res.json(updated)
  } catch (err) {
    console.error('❌ Error updating campaign status:', err)
    res.status(500).json({ error: 'Failed to update status' })
  }
}

export const simulateCampaignDelivery = async (campaign) => {
  try {
    const rules = campaign.rules
    const query = {
      $and: rules.map(rule => ({
        [rule.field]: { [rule.operator]: parseFloat(rule.value) }
      }))
    }

    const customers = await Customer.find(query)
    let sent = 0, failed = 0

    for (const customer of customers) {
      const messageId = `${campaign._id}-${customer._id}`
      const isSuccess = Math.random() < 0.9
      const status = isSuccess ? 'sent' : 'failed'

      await CommunicationLog.create({
        campaignId: campaign._id,
        customerId: customer._id,
        messageId,
        status
      })

      await axios.post('https://xeno-crm-r2jm.onrender.com/api/campaigns/delivery-receipt', {
        messageId,
        status
      })

      isSuccess ? sent++ : failed++
    }

    await Campaign.findByIdAndUpdate(campaign._id, { sent, failed })
  } catch (err) {
    console.error('❌ Error during simulated delivery:', err)
  }
}


