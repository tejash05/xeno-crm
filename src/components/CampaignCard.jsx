import { updateCampaignStatus } from '../services/api'
import toast from 'react-hot-toast'
import { useState } from 'react'

export default function CampaignCard({ campaign, onSelect }) {
  const [status, setStatus] = useState(campaign.status)

  const handleMarkAsSent = async () => {
    try {
      const updated = await updateCampaignStatus(campaign._id, 'sent')
      setStatus(updated.status)
      toast.success('Marked as Sent ')
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  const handleMarkAsFailed = async () => {
    try {
      const updated = await updateCampaignStatus(campaign._id, 'failed')
      setStatus(updated.status)
      toast.success('Marked as Failed ')
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  const statusClasses = {
    draft: 'bg-yellow-100 text-yellow-700',
    sent: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700'
  }

  return (
    <div
      className="p-4 border rounded shadow-sm mb-4 bg-white cursor-pointer"
      onClick={onSelect}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold">{campaign.name}</h3>
          <p className="text-sm text-gray-500">
            {new Date(campaign.createdAt).toLocaleString()}
          </p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusClasses[status]}`}>
          {status.toUpperCase()}
        </span>
      </div>

      <div className="mt-3 flex gap-6 text-sm">
        <span>👥 Audience: <strong>{campaign.audienceSize}</strong></span>
        <span>✅ Sent: <strong>{campaign.sent}</strong></span>
        <span>❌ Failed: <strong>{campaign.failed}</strong></span>
      </div>

      {status === 'draft' && (
        <div className="flex gap-3 mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleMarkAsSent()
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
          >
            📤 Mark as Sent
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleMarkAsFailed()
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
          >
            ❌ Mark as Failed
          </button>
        </div>
      )}
    </div>
  )
}
