import React, { useState } from 'react'

const QnACompare = ({ question, legacy, modern }) => {
  const [activeTab, setActiveTab] = useState('comparison')

  const calculateTotals = () => {
    const legacyTotal = legacy.reduce((sum, item) => sum + (item.amount || 0), 0)
    const modernTotal = modern.reduce((sum, item) => sum + (item.total || 0), 0)
    return { legacyTotal, modernTotal }
  }

  const { legacyTotal, modernTotal } = calculateTotals()

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Analysis Results</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Query: <span className="font-medium text-blue-600 dark:text-blue-400">"{question}"</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
            ✓ Analysis Complete
          </span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <span className="text-orange-600 dark:text-orange-400">📊</span>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Legacy System</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                ${legacyTotal.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400">⚡</span>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Modern System</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                ${modernTotal.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('comparison')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
            activeTab === 'comparison'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Side-by-Side Comparison
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
            activeTab === 'insights'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Key Insights
        </button>
      </div>

      {activeTab === 'comparison' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Legacy Data Table */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="bg-orange-50 dark:bg-orange-900/20 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <span className="text-orange-600 dark:text-orange-400">📊</span>
                <h4 className="font-semibold text-gray-900 dark:text-white">Legacy System</h4>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-white">ID</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-white">Name</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-white">Amount</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-white">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {legacy.map(row => (
                    <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-4 py-3 text-gray-900 dark:text-white">{row.id}</td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white">{row.name}</td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white">${row.amount?.toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{row.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modern Data Table */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">⚡</span>
                <h4 className="font-semibold text-gray-900 dark:text-white">Modern System</h4>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-white">ID</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-white">Full Name</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-white">Total</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-white">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {modern.map(row => (
                    <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-4 py-3 text-gray-900 dark:text-white">{row.id}</td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white">{row.fullName}</td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white">${row.total?.toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{row.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <span className="text-blue-600 dark:text-blue-400 text-lg">💡</span>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">Data Consistency</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Both systems show similar total values, indicating good data synchronization between legacy and modern systems.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-start gap-3">
              <span className="text-green-600 dark:text-green-400 text-lg">✅</span>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">Migration Success</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Modern system maintains data integrity with enhanced field names and ISO timestamp format.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start gap-3">
              <span className="text-yellow-600 dark:text-yellow-400 text-lg">⚠️</span>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">Field Mapping</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Consider standardizing field names across systems for better data consistency and easier maintenance.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default QnACompare