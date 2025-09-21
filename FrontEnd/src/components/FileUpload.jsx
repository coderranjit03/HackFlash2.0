import React, { useState } from 'react'

const FileUpload = ({ onFileSelect, selectedFile, isUploading }) => {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0])
    }
  }

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    const iconMap = {
      'csv': '📄',
      'txt': '📝',
      'sql': '🗄️',
      'db2': '🗄️',
      'cmd': '🖥️',
      'cl': '🖥️',
      'xls': '📊',
      'xlsx': '📊',
      'json': '🔗',
      'yaml': '🌐',
      'yml': '🌐',
      'graphql': '🔍',
      'gql': '🔍'
    }
    return iconMap[extension] || '📁'
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-4">
      {/* Drag and Drop Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          dragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : selectedFile
            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        } ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isUploading && document.getElementById('file-input').click()}
      >
        <input
          id="file-input"
          type="file"
          className="hidden"
          onChange={handleFileInput}
          accept=".csv,.txt,.sql,.db2,.cmd,.cl,.xls,.xlsx,.json,.yaml,.yml,.graphql,.gql"
          disabled={isUploading}
        />
        
        {isUploading ? (
          <div className="space-y-4">
            <div className="w-12 h-12 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                Processing File...
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Please wait while we analyze your file
              </p>
            </div>
          </div>
        ) : selectedFile ? (
          <div className="space-y-4">
            <div className="w-12 h-12 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <span className="text-2xl">{getFileIcon(selectedFile.name)}</span>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                File Selected
              </h3>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onFileSelect(null)
              }}
              className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              Remove file
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-12 h-12 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                Upload your legacy file
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Drag and drop your file here, or click to browse
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">CSV</span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">TXT</span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">SQL</span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">Excel</span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">JSON</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* File Requirements */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
          Supported File Types
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <span>📄</span>
            <span>CSV (.csv)</span>
          </div>
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <span>📝</span>
            <span>TXT (.txt)</span>
          </div>
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <span>🗄️</span>
            <span>SQL (.sql)</span>
          </div>
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <span>📊</span>
            <span>Excel (.xls/.xlsx)</span>
          </div>
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <span>🔗</span>
            <span>JSON (.json)</span>
          </div>
        </div>
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
          Maximum file size: 10MB
        </p>
      </div>
    </div>
  )
}

export default FileUpload
