import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { mockApis } from '../data/mock'

const ApiExplorer = () => {
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedApi, setSelectedApi] = useState(null)
  const navigate = useNavigate()

  const testApi = async (api) => {
    setSelectedApi(api)
    setLoading(true)
    setResponse(null)
    
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500))
    
    setResponse({
      method: api.method,
      path: api.path,
      status: 200,
      result: api.method === 'GET'
        ? [{ id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' }]
        : { message: 'Job created successfully', id: 'JOB-NEW-001', status: 'pending' }
    })
    setLoading(false)
  }

  const getMethodColor = (method) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
      case 'POST': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
      case 'PUT': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'DELETE': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
    }
  }

  return (
    <div className="flex w-full min-h-[calc(100vh-8rem)]">
      <aside className="w-full sm:w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Dashboard</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Data Platform</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            {[
              { path: '/dashboard', label: 'Data Upload', icon: '📁' },
              { path: '/dashboard/api', label: 'API Explorer', icon: '🔗', active: true }
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  item.active 
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <main className="flex-1 w-full bg-gray-50 dark:bg-gray-950">
        <div className="w-full px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-4 transition-colors duration-200"
            >
              <span>←</span>
              <span className="text-sm font-medium">Back to Data Upload</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              API Explorer
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Test and explore available API endpoints
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* API List */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Available Endpoints
              </h3>
              <div className="space-y-4">
                {mockApis.map((api) => (
                  <div key={api.name} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">{api.name}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getMethodColor(api.method)}`}>
                        {api.method}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-mono">
                      {api.path}
                    </p>
                    <button
                      onClick={() => testApi(api)}
                      disabled={loading}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium"
                    >
                      {loading && selectedApi === api ? 'Testing...' : 'Test API'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Response Panel */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Response
              </h3>
              
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-600 dark:text-gray-400">Testing API...</span>
                  </div>
                </div>
              ) : response ? (
                <div className="space-y-4">
                  {/* Response Status */}
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getMethodColor(response.method)}`}>
                      {response.method}
                    </span>
                    <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                      {response.path}
                    </span>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded">
                      {response.status} OK
                    </span>
                  </div>
                  
                  {/* Response Body */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <pre className="text-sm text-gray-900 dark:text-gray-100 overflow-auto">
                      {JSON.stringify(response.result, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl">🔗</span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                      Select an API endpoint to test
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* API Documentation */}
          <div className="mt-8 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              API Documentation
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Authentication',
                  description: 'All API requests require authentication headers',
                  icon: '🔐'
                },
                {
                  title: 'Rate Limits',
                  description: '100 requests per minute per API key',
                  icon: '⏱️'
                },
                {
                  title: 'Response Format',
                  description: 'All responses are in JSON format',
                  icon: '📄'
                }
              ].map((doc, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">{doc.icon}</span>
                    <h4 className="font-medium text-gray-900 dark:text-white">{doc.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{doc.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ApiExplorer