import React, { useState, useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const DataComparison = ({ legacyData, modernData, legacyMetadata, modernMetadata }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [highlightDifferences, setHighlightDifferences] = useState(true)

  // Calculate comparison statistics
  const comparisonStats = useMemo(() => {
    if (!legacyData || !modernData) return null

    const legacyFields = legacyData.length > 0 ? Object.keys(legacyData[0]) : []
    const modernFields = modernData.length > 0 ? Object.keys(modernData[0]) : []
    
    // Count differences
    let differences = 0
    const minLength = Math.min(legacyData.length, modernData.length)
    
    for (let i = 0; i < minLength; i++) {
      legacyFields.forEach(field => {
        if (legacyData[i][field] !== modernData[i][field]) {
          differences++
        }
      })
    }

    // Field mapping analysis
    const fieldMapping = legacyFields.map(legacyField => {
      const modernField = modernFields.find(mf => 
        mf.toLowerCase().includes(legacyField.toLowerCase()) ||
        legacyField.toLowerCase().includes(mf.toLowerCase())
      )
      return {
        legacy: legacyField,
        modern: modernField || 'No mapping',
        mapped: !!modernField
      }
    })

    return {
      legacyRecordCount: legacyData.length,
      modernRecordCount: modernData.length,
      legacyFieldCount: legacyFields.length,
      modernFieldCount: modernFields.length,
      differences,
      fieldMapping,
      totalComparisons: minLength * legacyFields.length,
      matchRate: ((minLength * legacyFields.length - differences) / (minLength * legacyFields.length)) * 100
    }
  }, [legacyData, modernData])

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!comparisonStats) return null

    // Record count comparison
    const recordCountData = {
      labels: ['Legacy Data', 'Modern Data'],
      datasets: [
        {
          label: 'Record Count',
          data: [comparisonStats.legacyRecordCount, comparisonStats.modernRecordCount],
          backgroundColor: ['rgba(249, 115, 22, 0.8)', 'rgba(59, 130, 246, 0.8)'],
          borderColor: ['rgba(249, 115, 22, 1)', 'rgba(59, 130, 246, 1)'],
          borderWidth: 1,
        },
      ],
    }

    // Field mapping pie chart
    const mappedFields = comparisonStats.fieldMapping.filter(f => f.mapped).length
    const unmappedFields = comparisonStats.fieldMapping.length - mappedFields

    const fieldMappingData = {
      labels: ['Mapped Fields', 'Unmapped Fields'],
      datasets: [
        {
          data: [mappedFields, unmappedFields],
          backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(239, 68, 68, 0.8)'],
          borderColor: ['rgba(16, 185, 129, 1)', 'rgba(239, 68, 68, 1)'],
          borderWidth: 2,
        },
      ],
    }

    return { recordCountData, fieldMappingData }
  }, [comparisonStats])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#1f2937'
        }
      },
      title: {
        color: '#1f2937',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6b7280'
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: '#6b7280'
        }
      },
    },
  }

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#1f2937',
          padding: 20,
          usePointStyle: true
        }
      },
      title: {
        color: '#1f2937',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((sum, val) => sum + val, 0)
            const percentage = ((context.parsed / total) * 100).toFixed(1)
            return `${context.label}: ${context.parsed} (${percentage}%)`
          }
        }
      }
    },
  }

  if (!legacyData || !modernData || !comparisonStats) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">📊</span>
        </div>
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Data to Compare</h4>
        <p className="text-gray-600 dark:text-gray-400">
          Upload and convert files to see data comparison.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            Data Comparison Analysis
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Compare legacy and modern data formats side by side
          </p>
        </div>
        
        {/* Tabs */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'tables', label: 'Tables', icon: '📋' },
            { id: 'charts', label: 'Charts', icon: '📈' },
            { id: 'mapping', label: 'Field Mapping', icon: '🔗' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {comparisonStats.legacyRecordCount}
            </div>
            <div className="text-sm text-orange-700 dark:text-orange-300">Legacy Records</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {comparisonStats.modernRecordCount}
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Modern Records</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {comparisonStats.matchRate.toFixed(1)}%
            </div>
            <div className="text-sm text-green-700 dark:text-green-300">Match Rate</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {comparisonStats.differences}
            </div>
            <div className="text-sm text-red-700 dark:text-red-300">Differences</div>
          </div>
        </div>
      )}

      {/* Tables Tab */}
      {activeTab === 'tables' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Legacy Data Table */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="bg-orange-50 dark:bg-orange-900/20 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-orange-600 dark:text-orange-400">📊</span>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Legacy Data</h4>
                </div>
                <span className="px-2 py-1 text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded">
                  {comparisonStats.legacyRecordCount} records
                </span>
              </div>
            </div>
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                  <tr>
                    {legacyData.length > 0 && Object.keys(legacyData[0]).map(field => (
                      <th key={field} className="px-3 py-2 text-left font-medium text-gray-900 dark:text-white">
                        {field}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {legacyData.slice(0, 10).map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      {Object.values(record).map((value, cellIndex) => (
                        <td key={cellIndex} className="px-3 py-2 text-gray-900 dark:text-white">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modern Data Table */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 dark:text-blue-400">⚡</span>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Modern Data</h4>
                </div>
                <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                  {comparisonStats.modernRecordCount} records
                </span>
              </div>
            </div>
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                  <tr>
                    {modernData.length > 0 && Object.keys(modernData[0]).map(field => (
                      <th key={field} className="px-3 py-2 text-left font-medium text-gray-900 dark:text-white">
                        {field}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {modernData.slice(0, 10).map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      {Object.values(record).map((value, cellIndex) => (
                        <td key={cellIndex} className="px-3 py-2 text-gray-900 dark:text-white">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Charts Tab */}
      {activeTab === 'charts' && chartData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Record Count Bar Chart */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <div className="h-80">
              <Bar data={chartData.recordCountData} options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    ...chartOptions.plugins.title,
                    text: 'Record Count Comparison'
                  }
                }
              }} />
            </div>
          </div>

          {/* Field Mapping Pie Chart */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <div className="h-80">
              <Pie data={chartData.fieldMappingData} options={{
                ...pieChartOptions,
                plugins: {
                  ...pieChartOptions.plugins,
                  title: {
                    ...pieChartOptions.plugins.title,
                    text: 'Field Mapping Status'
                  }
                }
              }} />
            </div>
          </div>
        </div>
      )}

      {/* Field Mapping Tab */}
      {activeTab === 'mapping' && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Field Mapping Analysis
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-white">
                    Legacy Field
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-white">
                    Modern Field
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-gray-900 dark:text-white">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {comparisonStats.fieldMapping.map((mapping, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">
                      {mapping.legacy}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">
                      {mapping.modern}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        mapping.mapped
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                      }`}>
                        {mapping.mapped ? '✓ Mapped' : '✗ Unmapped'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataComparison
