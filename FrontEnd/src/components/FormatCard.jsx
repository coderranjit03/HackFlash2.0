import React from 'react'

const FormatCard = ({ format, isSelected = false, isCompatible = true, onClick, type = 'legacy' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
    orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800',
    pink: 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800'
  }

  const textColorClasses = {
    blue: 'text-blue-700 dark:text-blue-300',
    green: 'text-green-700 dark:text-green-300',
    purple: 'text-purple-700 dark:text-purple-300',
    orange: 'text-orange-700 dark:text-orange-300',
    emerald: 'text-emerald-700 dark:text-emerald-300',
    pink: 'text-pink-700 dark:text-pink-300'
  }

  const selectedClasses = isSelected 
    ? 'ring-2 ring-blue-500 dark:ring-blue-400 shadow-lg scale-105' 
    : 'hover:shadow-md hover:scale-102'

  const disabledClasses = !isCompatible 
    ? 'opacity-50 cursor-not-allowed' 
    : 'cursor-pointer'

  return (
    <div
      className={`
        relative p-4 rounded-xl border-2 transition-all duration-200 
        ${colorClasses[format.color]}
        ${selectedClasses}
        ${disabledClasses}
        ${!isCompatible ? 'hover:shadow-none hover:scale-100' : ''}
      `}
      onClick={() => isCompatible && onClick && onClick(format)}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 dark:bg-blue-400 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">✓</span>
        </div>
      )}

      {/* Format icon and name */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{format.icon}</span>
        <div>
          <h3 className={`font-bold text-lg ${textColorClasses[format.color]}`}>
            {format.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {type === 'legacy' ? 'Legacy Format' : 'Modern Format'}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
        {format.description}
      </p>

      {/* Extensions */}
      <div className="mb-3">
        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          Extensions:
        </p>
        <div className="flex flex-wrap gap-1">
          {format.extensions.map((ext, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-white dark:bg-gray-800 rounded text-xs font-mono text-gray-700 dark:text-gray-300"
            >
              {ext}
            </span>
          ))}
        </div>
      </div>

      {/* Examples */}
      <div>
        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          Examples:
        </p>
        <div className="space-y-1">
          {format.examples.slice(0, 2).map((example, index) => (
            <p key={index} className="text-xs text-gray-600 dark:text-gray-400 font-mono">
              {example}
            </p>
          ))}
          {format.examples.length > 2 && (
            <p className="text-xs text-gray-500 dark:text-gray-500">
              +{format.examples.length - 2} more...
            </p>
          )}
        </div>
      </div>

      {/* Compatibility indicator */}
      {!isCompatible && (
        <div className="absolute inset-0 bg-gray-900/20 dark:bg-gray-100/20 rounded-xl flex items-center justify-center">
          <div className="bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
            Not Compatible
          </div>
        </div>
      )}
    </div>
  )
}

export default FormatCard
