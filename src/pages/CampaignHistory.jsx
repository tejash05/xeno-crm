import { useEffect, useState } from 'react'
import { getCampaignHistory } from '../services/api'
import CampaignCard from '../components/CampaignCard'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function CampaignHistory() {
  const [campaigns, setCampaigns] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [filtered, setFiltered] = useState([])
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [aiSuggestions, setAiSuggestions] = useState([])
  const [loadingAI, setLoadingAI] = useState(false)
  const [customMessage, setCustomMessage] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCampaignHistory(status)
      setCampaigns(data)
      setFiltered(
        data.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
      )
    }
    fetchData()
  }, [status, search])

  const handleStatusChange = (e) => {
    setStatus(e.target.value)
    setSelectedCampaign(null)
    setAiSuggestions([])
    setCustomMessage('')
  }

  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  const handleSuggestMessages = async () => {
    if (!selectedCampaign) return

    setLoadingAI(true)
    setAiSuggestions([])

    try {
      const res = await axios.post('https://xeno-crm-r2jm.onrender.com/api/ai/suggest-messages', {
        objective: selectedCampaign.segmentName || selectedCampaign.name,
        audienceInfo: {
          total_spend: selectedCampaign.audienceSize || 0,
          last_active_days: 60,
          tags: selectedCampaign.rules?.map(r => r.field) || []
        }
      })

      setAiSuggestions(res.data.messages || [])
    } catch (err) {
      console.error(err)
      toast.error('Failed to generate AI messages')
    } finally {
      setLoadingAI(false)
    }
  }

  const handleSendMessage = async (msg) => {
    if (!msg.trim()) return toast.error('Message cannot be empty')
    try {
      await axios.patch(`https://xeno-crm-r2jm.onrender.com/api/campaigns/${selectedCampaign._id}`, {
        status: 'sent',
        message: msg
      })
      toast.success('Message sent and campaign marked as sent ')
      setCustomMessage('')
    } catch (err) {
      console.error(err)
      toast.error('Failed to send campaign')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg flex flex-col lg:flex-row" style={{ height: '700px', overflow: 'hidden' }}>

        {/* Sidebar with filters and selected campaign */}
        <div className="w-full lg:w-1/3 bg-gray-50 border-r px-6 py-8 space-y-6 overflow-y-auto" style={{ maxHeight: '700px' }}>
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Campaign Filters</h3>
            <label className="block text-sm text-gray-700 font-medium mb-1">Status</label>
            <select
              className="w-full border px-3 py-2 rounded-md"
              value={status}
              onChange={handleStatusChange}
            >
              <option value="all">All</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {selectedCampaign && (
            <div className="p-4 border rounded bg-white shadow space-y-2">
              <h4 className="font-semibold text-gray-800">{selectedCampaign.name}</h4>
              <p className="text-sm text-gray-500">
                Created: {new Date(selectedCampaign.createdAt).toLocaleString()}
              </p>
              <p className="text-sm">👥 Audience: {selectedCampaign.audienceSize}</p>
              <p className="text-sm">✅ Sent: {selectedCampaign.sent}</p>
              <p className="text-sm">❌ Failed: {selectedCampaign.failed}</p>
              <p className="text-sm">
                📊 Success Rate:{' '}
                <strong>
                  {selectedCampaign.audienceSize > 0
                    ? `${Math.round((selectedCampaign.sent / selectedCampaign.audienceSize) * 100)}%`
                    : 'N/A'}
                </strong>
              </p>

              {/* AI Message Suggestion Button */}
              <button
                onClick={handleSuggestMessages}
                disabled={loadingAI}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 mt-3 rounded-md text-sm"
              >
                {loadingAI ? 'Generating...' : ' ✨AI Assistant'}
              </button>

              {/* AI Suggestions */}
              {aiSuggestions.length > 0 && (
                <div className="mt-4 space-y-2 text-sm">
                  <p className="font-medium text-gray-700">AI Suggestions:</p>
                  {aiSuggestions.map((msg, i) => (
                    <button
                      key={i}
                      onClick={() => setCustomMessage(msg)}
                      className="block w-full text-left px-3 py-2 border border-gray-300 rounded hover:bg-gray-100"
                    >
                      {msg}
                    </button>
                  ))}
                </div>
              )}

              {/* Message Box */}
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-700 mb-1 block">✍️ Edit or Write Your Own Message</label>
                <textarea
                  rows={4}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Type a message or choose one above..."
                  className="w-full border px-3 py-2 rounded-md text-sm"
                />
                <button
                  onClick={() => handleSendMessage(customMessage)}
                  className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
                >
                  📤 Send This Message
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Campaign list with internal scroll */}
        <div className="w-full lg:w-2/3 p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Campaign History</h2>

          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="🔍 Search campaigns..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {filtered.length === 0 ? (
            <p className="text-gray-500">No matching campaigns found.</p>
          ) : (
            <div className="space-y-4">
              {filtered.map((c) => (
                <div key={c._id} onClick={() => {
                  setSelectedCampaign(c)
                  setAiSuggestions([])
                  setCustomMessage('')
                }}>
                  <CampaignCard campaign={c} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
