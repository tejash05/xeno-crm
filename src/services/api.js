import axios from 'axios'

// Point to your backend server (localhost or deployed)
const API_BASE = 'https://xeno-crm-r2jm.onrender.com/api'

export const getAudienceCount = async (rules) => {
  const res = await axios.post(`${API_BASE}/segments/preview`, { rules }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return res.data
}


export const getCampaignHistory = async (status = 'all') => {
  const res = await axios.get(`${API_BASE}/campaigns`, {
    params: { status }
  })
  return res.data
}


export const createCampaign = async (data) => {
  const res = await axios.post(`${API_BASE}/campaigns`, data)
  return res.data
}
// services/api.js
export const updateCampaignStatus = async (id, status) => {
  const res = await axios.patch(`${API_BASE}/campaigns/${id}`, { status })
  return res.data
}



