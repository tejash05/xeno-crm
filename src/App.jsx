import { Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import CreateSegment from './pages/CreateSegment'
import CampaignHistory from './pages/CampaignHistory'
import AuthPage from './pages/AuthPage'
import { Toaster } from 'react-hot-toast'
import { useState } from 'react'
import About from './pages/About'

export default function App() {
  const user = JSON.parse(localStorage.getItem('user'))
  const location = useLocation()
  const navigate = useNavigate()
  const isAuthPage = location.pathname === '/auth'
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/auth')
  }

  return (
    <div className="bg-gray-100 min-h-screen font-sans">

      {/* navbar only if NOT on /auth */}
      {!isAuthPage && (
        <nav className="bg-gray-900 px-6 py-4 flex justify-between items-center shadow-md">
          <div className="text-white text-xl font-bold tracking-wide">
            XenoCRM
          </div>
          <div className="flex gap-6 items-center text-sm font-medium">
            <Link to="/" className="text-gray-300 hover:text-white transition">Home</Link>
            <Link to="/create-segment" className="text-gray-300 hover:text-white transition">Create Segment</Link>
            <Link to="/history" className="text-gray-300 hover:text-white transition">Campaigns</Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="bg-teal-600 text-white px-4 py-1.5 rounded-full hover:bg-teal-700 transition"
                >
                  {user.name || 'User'}
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg py-2 w-36 z-50">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      🔓 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth" className="bg-cyan-600 text-white px-4 py-1.5 rounded-full hover:bg-cyan-700 transition">Login</Link>
            )}
          </div>
        </nav>
      )}

      <div className="p-6">
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/"
            element={user ? <Home /> : <Navigate to="/auth" />}
          />
          <Route
            path="/create-segment"
            element={user ? <CreateSegment /> : <Navigate to="/auth" />}
          />
          <Route
            path="/history"
            element={user ? <CampaignHistory /> : <Navigate to="/auth" />}
          />
          <Route path="/about" element={<About />} />
        </Routes>
        
      </div>
    </div>
  )
}
