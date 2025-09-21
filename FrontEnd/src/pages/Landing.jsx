import React from 'react'
import { Link } from 'react-router-dom'

const Landing = () => {
  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="w-full px-4 py-16 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
            <span className="text-2xl">⚡</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              HackFlash
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            A modern data platform to bridge legacy systems with clean APIs and visual insights. 
            Transform your data workflow with intelligent automation.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/signup"
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
          >
            Get Started Free
          </Link>
          <Link
            to="/signin"
            className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 font-semibold"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to modernize your data infrastructure
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              icon: '⚡', 
              title: 'Fast Onboarding', 
              desc: 'Upload CSV/JSON and start querying instantly. No complex setup required.',
              color: 'from-yellow-400 to-orange-500'
            },
            { 
              icon: '🔗', 
              title: 'Simple APIs', 
              desc: 'Test endpoints directly in the UI with our built-in API explorer.',
              color: 'from-blue-400 to-blue-600'
            },
            { 
              icon: '📊', 
              title: 'Visual Insights', 
              desc: 'Compare legacy vs modern data side-by-side with beautiful visualizations.',
              color: 'from-purple-400 to-purple-600'
            }
          ].map((feature, i) => (
            <div key={i} className="group p-8 border rounded-2xl bg-white dark:bg-gray-900 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-2xl text-white">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="w-full px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-blue-100">Data Sources Connected</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-blue-100">Uptime Guarantee</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Support Available</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Landing