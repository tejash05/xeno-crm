import { useState } from 'react'
import RuleBuilder from '../components/RuleBuilder'
import { getAudienceCount, createCampaign } from '../services/api'
import toast from 'react-hot-toast'

export default function CreateSegment() {
  const [segmentName, setSegmentName] = useState('')
  const [rules, setRules] = useState([{ field: 'total_spend', operator: '>', value: '' }])
  const [audienceSize, setAudienceSize] = useState(null)
  const [loading, setLoading] = useState(false)

  const handlePreview = async () => {
    setLoading(true)
    try {
      const res = await getAudienceCount(rules)
      setAudienceSize(res.size)
    } catch (err) {
      toast.error('Failed to preview audience size')
    }
    setLoading(false)
  }

  const handleSubmit = async () => {
    if (!segmentName.trim()) {
      toast.error('Please enter a segment name')
      return
    }

    if (!audienceSize) {
      toast.error('Preview audience size first')
      return
    }

    const payload = {
      name: `${segmentName} Campaign`,
      segmentName,
      audienceSize,
      rules
    }

    try {
      await createCampaign(payload)
      toast.success('Campaign created successfully!')
    } catch (err) {
      console.error(err)
      toast.error('Failed to save campaign')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="flex flex-col lg:flex-row items-center gap-10 max-w-6xl w-full">
        
        {/* 📝 Form Card */}
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gray-900 text-white px-6 py-4">
            <h2 className="text-lg font-semibold">Create Audience Segment</h2>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            {/* Segment Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Segment Name
              </label>
              <input
                type="text"
                placeholder="Enter Segment Name"
                value={segmentName}
                onChange={(e) => setSegmentName(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* RuleBuilder component */}
            <RuleBuilder rules={rules} setRules={setRules} />

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 justify-between pt-2">
              <button
                onClick={handlePreview}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition font-medium w-full sm:w-auto"
              >
                🔍 Preview Audience Size
              </button>
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition font-medium w-full sm:w-auto"
              >
                💾 Save Segment
              </button>
            </div>

            {/* Audience Size / Loading */}
            {loading && (
              <p className="text-sm text-blue-500 animate-pulse text-center">
                Calculating audience size...
              </p>
            )}

            {audienceSize !== null && !loading && (
              <p className="text-center text-lg text-gray-800">
                🔢 Estimated Audience Size: <strong>{audienceSize}</strong>
              </p>
            )}
          </div>
        </div>

        {/* 🎨 Illustration / Sticker */}
        <div className="w-full sm:w-[300px] lg:w-[400px] xl:w-[500px] -mt-8 lg:-mt-20 lg:-ml-40 flex justify-center">
          <img
            src="/detective.png"
            alt="Sticker"
            className="w-full max-h-[400px] object-contain"
          />
        </div>
      </div>
    </div>
  )
}
