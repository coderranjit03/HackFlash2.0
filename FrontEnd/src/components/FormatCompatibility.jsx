import React from 'react'
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

const FormatCompatibility = ({ legacyFormats, modernFormats, formatCompatibility, conversionStats }) => {
  // Prepare data for format usage bar chart
  const formatUsageData = {
    labels: legacyFormats.map(f => f.name),
    datasets: [
      {
        label: 'Usage Count',
        data: legacyFormats.map(f => conversionStats.formatUsage[f.id] || 0),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(16, 185, 129, 0.8)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(16, 185, 129, 1)'
        ],
        borderWidth: 1,
      },
    ],
  }

  const formatUsageOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Legacy Format Usage Statistics',
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

  // Prepare data for modern format usage pie chart
  const modernFormatData = {
    labels: modernFormats.map(f => f.name),
    datasets: [
      {
        data: modernFormats.map(f => conversionStats.modernFormatUsage[f.id] || 0),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(236, 72, 153, 1)'
        ],
        borderWidth: 2,
      },
    ],
  }

  const modernFormatOptions = {
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
        display: true,
        text: 'Modern Format Distribution',
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

  return (
    <div className="space-y-6">
      {/* Compatibility Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Format Compatibility Matrix
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Legacy Format
                </th>
                {modernFormats.map(format => (
                  <th key={format.id} className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
                    {format.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {legacyFormats.map(legacyFormat => (
                <tr key={legacyFormat.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{legacyFormat.icon}</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {legacyFormat.name}
                      </span>
                    </div>
                  </td>
                  {modernFormats.map(modernFormat => {
                    const isCompatible = formatCompatibility[legacyFormat.id]?.includes(modernFormat.id)
                    return (
                      <td key={modernFormat.id} className="text-center py-3 px-4">
                        <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                          isCompatible 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                            : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                        }`}>
                          {isCompatible ? '✓' : '✗'}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Legacy Format Usage Bar Chart */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
          <div className="h-80">
            <Bar data={formatUsageData} options={formatUsageOptions} />
          </div>
        </div>

        {/* Modern Format Distribution Pie Chart */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
          <div className="h-80">
            <Pie data={modernFormatData} options={modernFormatOptions} />
          </div>
        </div>
      </div>

      {/* Common Conversion Paths */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Most Common Conversion Paths
        </h3>
        <div className="space-y-3">
          {conversionStats.commonConversions.map((conversion, index) => {
            const legacyFormat = legacyFormats.find(f => f.id === conversion.from)
            const modernFormat = modernFormats.find(f => f.id === conversion.to)
            
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{legacyFormat?.icon}</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {legacyFormat?.name}
                  </span>
                  <span className="text-gray-400">→</span>
                  <span className="text-lg">{modernFormat?.icon}</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {modernFormat?.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(conversion.count / 250) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                    {conversion.count}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {conversionStats.totalConversions.toLocaleString()}
          </div>
          <div className="text-sm text-blue-700 dark:text-blue-300">Total Conversions</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {legacyFormats.length}
          </div>
          <div className="text-sm text-green-700 dark:text-green-300">Legacy Formats</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {modernFormats.length}
          </div>
          <div className="text-sm text-purple-700 dark:text-purple-300">Modern Formats</div>
        </div>
      </div>
    </div>
  )
}

export default FormatCompatibility
