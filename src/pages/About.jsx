import { Link } from 'react-router-dom'
import { FaGithub, FaLinkedin } from 'react-icons/fa'

export default function About() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-900 text-white text-center py-6 px-4">
          <h1 className="text-3xl font-bold">About XenoCRM</h1>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            XenoCRM is a modern customer relationship platform that helps businesses
            segment their audience, launch targeted campaigns, and gain insights—
            all powered with AI-assisted messaging and performance tracking.
          </p>

          {/* Links */}
          <div className="flex justify-center gap-6 mb-6">
            <a
              href="https://github.com/tejash05"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-black text-2xl"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/tejashtarunofficial/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-2xl"
            >
              <FaLinkedin />
            </a>
          </div>

          {/* Back button */}
          <Link
            to="/"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-md transition"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
