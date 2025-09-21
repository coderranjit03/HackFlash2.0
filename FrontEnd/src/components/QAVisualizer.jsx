import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from 'chart.js'
import { Bar, Pie, Line } from 'react-chartjs-2'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
)

const QAVisualizer = ({ legacyData = [], modernData = [] }) => {
  const [visualizationType, setVisualizationType] = useState('table')
  const [highlightDifferences, setHighlightDifferences] = useState(true)
  const [userQuestion, setUserQuestion] = useState('')
  const [showQuestion, setShowQuestion] = useState(false)

  // Get all unique fields from both datasets
  const allFields = useMemo(() => {
    const legacyFields = legacyData.length > 0 ? Object.keys(legacyData[0]) : []
    const modernFields = modernData.length > 0 ? Object.keys(modernData[0]) : []
    return [...new Set([...legacyFields, ...modernFields])]
  }, [legacyData, modernData])

  // Calculate statistics for charts
  const statistics = useMemo(() => {
    const legacyCount = legacyData.length
    const modernCount = modernData.length
    
    // Count differences in key fields
    let differences = 0
    const minLength = Math.min(legacyCount, modernCount)
    
    for (let i = 0; i < minLength; i++) {
      const legacyRecord = legacyData[i]
      const modernRecord = modernData[i]
      
      // Compare common fields
      allFields.forEach(field => {
        if (legacyRecord[field] !== modernRecord[field]) {
          differences++
        }
      })
    }

    // Analyze data types
    const numericFields = allFields.filter(field => {
      const legacyValue = legacyData[0]?.[field]
      const modernValue = modernData[0]?.[field]
      return !isNaN(parseFloat(legacyValue)) || !isNaN(parseFloat(modernValue))
    })

    const categoricalFields = allFields.filter(field => {
      const legacyValue = legacyData[0]?.[field]
      const modernValue = modernData[0]?.[field]
      return isNaN(parseFloat(legacyValue)) && isNaN(parseFloat(modernValue)) && 
             typeof legacyValue === 'string' && typeof modernValue === 'string'
    })

    return {
      legacyCount,
      modernCount,
      differences,
      totalRecords: Math.max(legacyCount, modernCount),
      numericFields,
      categoricalFields
    }
  }, [legacyData, modernData, allFields])

  // Check if two values are different
  const isValueDifferent = (legacyValue, modernValue) => {
    return legacyValue !== modernValue
  }

  // Table configuration using TanStack Table
  const columnHelper = createColumnHelper()

  const legacyColumns = useMemo(() => {
    return allFields.map(field =>
      columnHelper.accessor(field, {
        id: field,
        header: () => (
          <span className="font-medium text-gray-900 dark:text-white capitalize">
            {field.replace(/([A-Z])/g, ' $1').trim()}
          </span>
        ),
        cell: ({ getValue, row }) => {
          const value = getValue() || '-'
          const modernValue = modernData[row.index]?.[field]
          const isDifferent = highlightDifferences && isValueDifferent(value, modernValue)
          
          return (
            <div 
              className={`px-2 py-1 rounded ${
                isDifferent ? 'bg-yellow-100 dark:bg-yellow-900/30 border-l-2 border-yellow-400' : ''
              }`}
            >
              {value}
            </div>
          )
        },
      })
    )
  }, [allFields, modernData, highlightDifferences])

  const modernColumns = useMemo(() => {
    return allFields.map(field =>
      columnHelper.accessor(field, {
        id: field,
        header: () => (
          <span className="font-medium text-gray-900 dark:text-white capitalize">
            {field.replace(/([A-Z])/g, ' $1').trim()}
          </span>
        ),
        cell: ({ getValue, row }) => {
          const value = getValue() || '-'
          const legacyValue = legacyData[row.index]?.[field]
          const isDifferent = highlightDifferences && isValueDifferent(value, legacyValue)
          
          return (
            <div 
              className={`px-2 py-1 rounded ${
                isDifferent ? 'bg-yellow-100 dark:bg-yellow-900/30 border-l-2 border-yellow-400' : ''
              }`}
            >
              {value}
            </div>
          )
        },
      })
    )
  }, [allFields, legacyData, highlightDifferences])

  const legacyTable = useReactTable({
    data: legacyData,
    columns: legacyColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const modernTable = useReactTable({
    data: modernData,
    columns: modernColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  // Render table visualization
  const renderTableVisualization = () => {
    return (
      <div className="space-y-6">
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
                  {statistics.legacyCount} records
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  {legacyTable.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th key={header.id} className="px-4 py-3 text-left">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {legacyTable.getRowModel().rows.map(row => (
                    <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="px-4 py-3 text-gray-900 dark:text-white">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
                  {statistics.modernCount} records
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  {modernTable.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th key={header.id} className="px-4 py-3 text-left">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {modernTable.getRowModel().rows.map(row => (
                    <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="px-4 py-3 text-gray-900 dark:text-white">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render bar chart visualization
  const renderBarChart = () => {
    // Analyze numeric fields for comparison
    const numericData = statistics.numericFields.map(field => {
      const legacyTotal = legacyData.reduce((sum, record) => {
        const value = parseFloat(record[field]) || 0
        return sum + value
      }, 0)
      
      const modernTotal = modernData.reduce((sum, record) => {
        const value = parseFloat(record[field]) || 0
        return sum + value
      }, 0)

      return {
        field: field.replace(/([A-Z])/g, ' $1').trim(),
        legacy: legacyTotal,
        modern: modernTotal
      }
    })

    // Analyze categorical fields
    const categoricalData = statistics.categoricalFields.map(field => {
      const legacyCategories = {}
      const modernCategories = {}

      legacyData.forEach(record => {
        const value = record[field] || 'Unknown'
        legacyCategories[value] = (legacyCategories[value] || 0) + 1
      })

      modernData.forEach(record => {
        const value = record[field] || 'Unknown'
        modernCategories[value] = (modernCategories[value] || 0) + 1
      })

      return {
        field: field.replace(/([A-Z])/g, ' $1').trim(),
        legacyCategories,
        modernCategories
      }
    })

    const barChartData = {
      labels: numericData.map(d => d.field),
      datasets: [
        {
          label: 'Legacy Data',
          data: numericData.map(d => d.legacy),
          backgroundColor: 'rgba(249, 115, 22, 0.8)',
          borderColor: 'rgba(249, 115, 22, 1)',
          borderWidth: 1,
        },
        {
          label: 'Modern Data',
          data: numericData.map(d => d.modern),
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
        },
      ],
    }

    const barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Numeric Fields Comparison',
          font: {
            size: 16,
            weight: 'bold'
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}`
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
      },
    }

    return (
      <div className="space-y-6">
        {/* Numeric Fields Bar Chart */}
        {numericData.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <div className="h-96">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </div>
        )}

        {/* Categorical Fields Comparison */}
        {categoricalData.map(({ field, legacyCategories, modernCategories }) => {
          const allCategories = [...new Set([...Object.keys(legacyCategories), ...Object.keys(modernCategories)])]
          
          const categoryChartData = {
            labels: allCategories,
            datasets: [
              {
                label: 'Legacy Data',
                data: allCategories.map(cat => legacyCategories[cat] || 0),
                backgroundColor: 'rgba(249, 115, 22, 0.8)',
                borderColor: 'rgba(249, 115, 22, 1)',
                borderWidth: 1,
              },
              {
                label: 'Modern Data',
                data: allCategories.map(cat => modernCategories[cat] || 0),
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
              },
            ],
          }

          const categoryChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: `${field} Distribution`,
                font: {
                  size: 16,
                  weight: 'bold'
                }
              }
            },
            scales: {
              x: {
                grid: {
                  display: false
                }
              },
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1
                }
              },
            },
          }

          return (
            <div key={field} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
              <div className="h-80">
                <Bar data={categoryChartData} options={categoryChartOptions} />
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // Render pie chart visualization
  const renderPieChart = () => {
    // Find primary categorical field
    const primaryField = statistics.categoricalFields.find(field => 
      field.toLowerCase().includes('status') || 
      field.toLowerCase().includes('department') || 
      field.toLowerCase().includes('team') ||
      field.toLowerCase().includes('type')
    ) || statistics.categoricalFields[0]

    if (!primaryField) {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">🥧</span>
          </div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Categorical Data</h4>
          <p className="text-gray-600 dark:text-gray-400">
            No categorical fields found for pie chart visualization.
          </p>
        </div>
      )
    }

    // Calculate distributions
    const legacyDistribution = {}
    const modernDistribution = {}

    legacyData.forEach(record => {
      const value = record[primaryField] || 'Unknown'
      legacyDistribution[value] = (legacyDistribution[value] || 0) + 1
    })

    modernData.forEach(record => {
      const value = record[primaryField] || 'Unknown'
      modernDistribution[value] = (modernDistribution[value] || 0) + 1
    })

    const colors = [
      'rgba(16, 185, 129, 0.8)',   // green
      'rgba(59, 130, 246, 0.8)',   // blue
      'rgba(245, 158, 11, 0.8)',   // yellow
      'rgba(239, 68, 68, 0.8)',    // red
      'rgba(139, 92, 246, 0.8)',   // purple
      'rgba(6, 182, 212, 0.8)',    // cyan
    ]

    const legacyChartData = {
      labels: Object.keys(legacyDistribution),
      datasets: [
        {
          data: Object.values(legacyDistribution),
          backgroundColor: colors.slice(0, Object.keys(legacyDistribution).length),
          borderColor: colors.slice(0, Object.keys(legacyDistribution).length).map(color => color.replace('0.8', '1')),
          borderWidth: 2,
        },
      ],
    }

    const modernChartData = {
      labels: Object.keys(modernDistribution),
      datasets: [
        {
          data: Object.values(modernDistribution),
          backgroundColor: colors.slice(0, Object.keys(modernDistribution).length),
          borderColor: colors.slice(0, Object.keys(modernDistribution).length).map(color => color.replace('0.8', '1')),
          borderWidth: 2,
        },
      ],
    }

    const pieChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
        },
        title: {
          display: true,
          text: `${primaryField.charAt(0).toUpperCase() + primaryField.slice(1)} Distribution`,
          font: {
            size: 16,
            weight: 'bold'
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || ''
              const value = context.parsed
              const total = context.dataset.data.reduce((sum, val) => sum + val, 0)
              const percentage = ((value / total) * 100).toFixed(1)
              return `${label}: ${value} (${percentage}%)`
            }
          }
        }
      },
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Legacy Data Pie Chart */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <div className="text-center mb-4">
              <h4 className="text-lg font-semibold text-orange-600 dark:text-orange-400">Legacy Data</h4>
            </div>
            <div className="h-80">
              <Pie data={legacyChartData} options={pieChartOptions} />
            </div>
          </div>

          {/* Modern Data Pie Chart */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <div className="text-center mb-4">
              <h4 className="text-lg font-semibold text-blue-600 dark:text-blue-400">Modern Data</h4>
            </div>
            <div className="h-80">
              <Pie data={modernChartData} options={pieChartOptions} />
            </div>
          </div>
        </div>

        {/* Data Quality Metrics */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Data Quality Metrics
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {statistics.legacyCount + statistics.modernCount}
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">Total Records</div>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {allFields.length}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">Total Fields</div>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {statistics.differences}
              </div>
              <div className="text-sm text-orange-700 dark:text-orange-300">Differences</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {statistics.categoricalFields.length}
              </div>
              <div className="text-sm text-purple-700 dark:text-purple-300">Categories</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render line chart visualization (if date fields exist)
  const renderLineChart = () => {
    // Find date fields
    const dateFields = allFields.filter(field => {
      const legacyValue = legacyData[0]?.[field]
      const modernValue = modernData[0]?.[field]
      return !isNaN(Date.parse(legacyValue)) || !isNaN(Date.parse(modernValue))
    })

    if (dateFields.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">📈</span>
          </div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Date Fields</h4>
          <p className="text-gray-600 dark:text-gray-400">
            No date fields found for line chart visualization.
          </p>
        </div>
      )
    }

    // Create time series data
    const dateField = dateFields[0]
    const numericField = statistics.numericFields[0]

    if (!numericField) {
      return (
        <div className="text-center py-12">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Numeric Data</h4>
          <p className="text-gray-600 dark:text-gray-400">
            No numeric fields found to plot against time.
          </p>
        </div>
      )
    }

    // Sort data by date and prepare chart data
    const legacySorted = [...legacyData].sort((a, b) => new Date(a[dateField]) - new Date(b[dateField]))
    const modernSorted = [...modernData].sort((a, b) => new Date(a[dateField]) - new Date(b[dateField]))

    const lineChartData = {
      labels: legacySorted.map(record => new Date(record[dateField]).toLocaleDateString()),
      datasets: [
        {
          label: 'Legacy Data',
          data: legacySorted.map(record => parseFloat(record[numericField]) || 0),
          borderColor: 'rgba(249, 115, 22, 1)',
          backgroundColor: 'rgba(249, 115, 22, 0.2)',
          tension: 0.1,
        },
        {
          label: 'Modern Data',
          data: modernSorted.map(record => parseFloat(record[numericField]) || 0),
          borderColor: 'rgba(59, 130, 246, 1)',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          tension: 0.1,
        },
      ],
    }

    const lineChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: `${numericField} Over Time`,
          font: {
            size: 16,
            weight: 'bold'
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        }
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Date'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: numericField.charAt(0).toUpperCase() + numericField.slice(1)
          }
        },
      },
    }

    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
        <div className="h-96">
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
      </div>
    )
  }

  // Render heatmap visualization
  const renderHeatmap = () => {
    const maxRecords = Math.max(legacyData.length, modernData.length)
    const fields = allFields.slice(0, 10) // Limit to 10 fields for readability

    // Create heatmap data
    const heatmapData = fields.map(field => {
      const row = []
      for (let i = 0; i < maxRecords; i++) {
        const legacyValue = legacyData[i]?.[field] || ''
        const modernValue = modernData[i]?.[field] || ''
        const isDifferent = legacyValue !== modernValue
        row.push({
          value: legacyValue,
          modernValue: modernValue,
          isDifferent,
          intensity: isDifferent ? 1 : 0
        })
      }
      return { field, data: row }
    })

    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Data Differences Heatmap
        </h4>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-1 gap-4">
            {/* Legend */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-200 dark:bg-green-800 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300">Matching Values</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-200 dark:bg-red-800 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300">Different Values</span>
              </div>
            </div>

            {/* Heatmap Grid */}
            <div className="grid gap-2" style={{ gridTemplateColumns: `200px repeat(${maxRecords}, 1fr)` }}>
              {/* Header row */}
              <div className="font-medium text-gray-900 dark:text-white p-2 bg-gray-100 dark:bg-gray-800 rounded">
                Field
              </div>
              {Array.from({ length: maxRecords }, (_, i) => (
                <div key={i} className="font-medium text-gray-900 dark:text-white p-2 bg-gray-100 dark:bg-gray-800 rounded text-center">
                  R{i + 1}
                </div>
              ))}

              {/* Data rows */}
              {heatmapData.map(({ field, data }) => (
                <React.Fragment key={field}>
                  <div className="font-medium text-gray-900 dark:text-white p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    {field.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  {data.map((cell, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded text-xs text-center ${
                        cell.isDifferent
                          ? 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200'
                          : 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200'
                      }`}
                      title={`Legacy: ${cell.value}, Modern: ${cell.modernValue}`}
                    >
                      {cell.isDifferent ? '✗' : '✓'}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render the selected visualization
  const renderVisualization = () => {
    switch (visualizationType) {
      case 'table':
        return renderTableVisualization()
      case 'bar':
        return renderBarChart()
      case 'pie':
        return renderPieChart()
      case 'line':
        return renderLineChart()
      case 'heatmap':
        return renderHeatmap()
      default:
        return renderTableVisualization()
    }
  }

  // Animation variants
  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  return (
    <motion.div 
      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={fadeInVariants}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Data Quality Visualization
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Compare legacy and modern data formats with interactive visualizations
          </p>
        </div>
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={visualizationType}
            onChange={(e) => setVisualizationType(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="table">📊 Table View</option>
            <option value="bar">📈 Bar Chart</option>
            <option value="pie">🥧 Pie Chart</option>
            <option value="line">📈 Line Chart</option>
            <option value="heatmap">🔥 Heatmap</option>
          </select>
          
          {visualizationType === 'table' && (
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={highlightDifferences}
                onChange={(e) => setHighlightDifferences(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Highlight Differences
            </label>
          )}
        </div>
      </div>

      {/* User Question Input */}
      <div className="mb-6">
        <button
          onClick={() => setShowQuestion(!showQuestion)}
          className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
        >
          <span>{showQuestion ? '▼' : '▶'}</span>
          Ask a question about your data
        </button>
        
        <AnimatePresence>
          {showQuestion && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3"
            >
              <div className="flex gap-3">
                <input
                  type="text"
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  placeholder="e.g., What are the main differences between legacy and modern data?"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">
                  Analyze
                </button>
              </div>
              {userQuestion && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Analysis:</strong> Based on your data, I can see {statistics.differences} differences 
                    between {statistics.legacyCount} legacy records and {statistics.modernCount} modern records. 
                    The main categorical field is {statistics.categoricalFields[0] || 'N/A'} with {allFields.length} total fields.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Data Status */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{statistics.legacyCount}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Legacy Records</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{statistics.modernCount}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Modern Records</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{allFields.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Fields</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{statistics.differences}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Differences</div>
          </div>
        </div>
      </div>

      {/* Visualization Content */}
      <AnimatePresence mode="wait">
        {legacyData.length === 0 && modernData.length === 0 ? (
          <motion.div 
            className="text-center py-12"
            key="empty"
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Data Available</h4>
            <p className="text-gray-600 dark:text-gray-400">
              Upload and convert some data to see visualizations here.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={visualizationType}
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            {renderVisualization()}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default QAVisualizer