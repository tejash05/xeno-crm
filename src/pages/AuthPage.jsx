import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import toast from 'react-hot-toast'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const vantaRef = useRef(null)
  const vantaEffect = useRef(null)

  useEffect(() => {
    const loadVanta = async () => {
      const VANTA = await import('vanta/dist/vanta.net.min.js')
      if (!vantaEffect.current) {
        vantaEffect.current = VANTA.default({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0xff3f81,
          backgroundColor: 0x23153c,
        })
      }
    }

    loadVanta()
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy()
        vantaEffect.current = null
      }
    }
  }, [])

  const handleLocalSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password || (!isLogin && !name)) {
      toast.error('Please fill all fields')
      return
    }

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup'
      const payload = isLogin ? { email, password } : { name, email, password }

      const res = await fetch(`https://xeno-crm-r2jm.onrender.com${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Auth failed')

      toast.success(`${isLogin ? 'Login' : 'Signup'} successful!`)
      localStorage.setItem('user', JSON.stringify(data))
      window.location.href = '/'
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
<div
  ref={vantaRef}
  className="fixed inset-0 flex items-center justify-center z-0"
>      <div className="flex w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden z-10">
        {/* Left Side */}
        <div className="w-1/2 bg-indigo-600 text-white flex flex-col justify-center items-center p-10">
          <h1 className="text-3xl font-bold mb-4">Welcome to XenoCRM</h1>
          <p className="text-center text-sm">Manage segments, launch campaigns, and get insights.</p>
        </div>

        {/* Right Side (Form) */}
        <div className="w-1/2 p-10 bg-white">
        <h2 className="text-2xl font-semibold mb-6">{isLogin ? 'Sign In' : 'Sign Up'}</h2>

          <form className="space-y-4" onSubmit={handleLocalSubmit}>
            {!isLogin && (
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border px-4 py-2 rounded-md"
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-4 py-2 rounded-md"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-4 py-2 rounded-md"
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                className="text-indigo-600 font-medium hover:underline"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          <div className="mt-6">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const res = await fetch('https://xeno-crm-r2jm.onrender.com/api/auth/google-login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: credentialResponse.credential })
                  })
                  const user = await res.json()
                  localStorage.setItem('user', JSON.stringify(user))
                  window.location.href = '/'
                } catch (error) {
                  toast.error('❌ Google login failed')
                }
              }}
              onError={() => {
                toast.error('Google Login Failed')
              }}
              theme="outline"
              width="100%"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
