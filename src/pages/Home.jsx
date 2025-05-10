import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* 🖼 Banner with overlayed content */}
      <div className="relative w-full h-[500px]">
        <img
          src="/img4.jpeg"
          alt="CRM Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Text + buttons overlay */}
        <div className="relative z-10 h-full w-full flex flex-col justify-center items-center text-center px-4 bg-black/30">
          <h1 className="text-white text-4xl font-bold mb-2 drop-shadow-lg">
            We Build CRM Experiences
          </h1>
          <p className="text-white text-lg mb-6 drop-shadow-sm">
            Simplifying your customer journeys with automation
          </p>
          <div className="flex gap-4">
          <Link to="/about"
                className="bg-white text-gray-900 font-semibold px-5 py-2 rounded-full hover:bg-gray-200 transition"
              >
                About
              </Link>
              <a href="mailto:youremail@example.com"
              className="bg-teal-500 text-white font-semibold px-5 py-2 rounded-full hover:bg-teal-600 transition"
>
              Contact
            </a>

          </div>
        </div>
      </div>

      {/* 📊 Feature Section */}
      <section className="mt-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
          {/* Column 1 */}
          <div className="text-left">
            <h2 className="text-xl font-semibold text-teal-600 mb-2">Innovate</h2>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
            At XenoCRM, innovation drives everything we build. We empower businesses to craft unique customer journeys, adapt faster to market changes, and explore data-driven strategies with agility and precision.
            </p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✔️ Customer Experience</li>
              <li>✔️ Product Management</li>
              <li>✔️ Proof of Concept</li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="text-left">
            <h2 className="text-xl font-semibold text-teal-600 mb-2">Create</h2>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
            We help you create impactful customer experiences—from intuitive web design to tailored campaign workflows. Build segments, design journeys, and bring your brand vision to life with precision.
            </p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✔️ Web Design</li>
              <li>✔️ Branding</li>
              <li>✔️ Web & App Development</li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="text-left">
            <h2 className="text-xl font-semibold text-teal-600 mb-2">Scale</h2>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
            Accelerate your growth with data-driven campaigns. Reach wider audiences through social media, paid promotions, and smart automation—engineered to maximize ROI and engagement.
            </p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✔️ Social Media</li>
              <li>✔️ Paid Campaigns</li>
              <li>✔️ Marketing & SEO</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
