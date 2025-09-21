import React from 'react'

const StatusCard = ({ label, value, color, icon, trend, trendValue }) => {
  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return 'text-green-600 dark:text-green-400'
      case 'down': return 'text-red-600 dark:text-red-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return '↗️'
      case 'down': return '↘️'
      default: return '➡️'
    }
  }

  return (
    <div className="group p-6 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <span className="text-lg">{icon}</span>
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{value}</h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${color} shadow-sm`} />
          {trend && (
            <div className={`flex items-center gap-1 text-sm ${getTrendColor(trend)}`}>
              <span>{getTrendIcon(trend)}</span>
              <span className="font-medium">{trendValue}%</span>
            </div>
          )}
        </div>
      </div>
      
      {trend && (
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {trend === 'up' ? 'Increased' : trend === 'down' ? 'Decreased' : 'No change'} from last week
          </p>
        </div>
      )}
    </div>
  )
}

export default StatusCard