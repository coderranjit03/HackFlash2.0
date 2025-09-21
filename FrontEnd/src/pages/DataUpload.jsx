import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FileUpload from '../components/FileUpload'
import FormatCard from '../components/FormatCard'
import FormatCompatibility from '../components/FormatCompatibility'
import DataComparison from '../components/DataComparison'
import { parseFile, storeParsedData } from '../utils/fileParser'
import { mockConvertFile, storeConvertedData } from '../services/conversionService'
import {
  legacyFormats,
  modernFormats,
  formatCompatibility,
  getCompatibleFormats,
  conversionStats
} from '../data/formatDefinitions'

const DataUpload = () => {
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [isParsing, setIsParsing] = useState(false)
  const [selectedLegacyFormat, setSelectedLegacyFormat] = useState(null)
  const [selectedModernFormat, setSelectedModernFormat] = useState(null)
  const [parsedData, setParsedData] = useState(null)
  const [legacyStorageKey, setLegacyStorageKey] = useState(null)
  const [convertedData, setConvertedData] = useState(null)
  const [conversionStorageKey, setConversionStorageKey] = useState(null)
  const [showComparison, setShowComparison] = useState(false)
  const [showCompatibility, setShowCompatibility] = useState(false)
  
  const navigate = useNavigate()

  // Mock data conversion function with enhanced format support
  const convertData = (data, fromFormat, toFormat) => {
    const formatId = fromFormat.id
    
    if (formatId === 'csv' && toFormat.id === 'json') {
      // Convert CSV to JSON
      const lines = data.split('\n')
      const headers = lines[0].split(',')
      const jsonData = lines.slice(1).map(line => {
        const values = line.split(',')
        return headers.reduce((obj, header, index) => {
          obj[header.trim()] = values[index]?.trim() || ''
          return obj
        }, {})
      })
      return jsonData
    } 
    else if (formatId === 'excel' && toFormat.id === 'json') {
      // Mock Excel to JSON conversion
      return [
        { id: 'E-001', name: 'Excel User 1', amount: 1500, date: '2023-07-01', status: 'active', department: 'sales' },
        { id: 'E-002', name: 'Excel User 2', amount: 800, date: '2023-07-02', status: 'inactive', department: 'marketing' },
        { id: 'E-003', name: 'Excel User 3', amount: 2200, date: '2023-07-03', status: 'active', department: 'sales' }
      ]
    }
    else if (formatId === 'txt' && toFormat.id === 'json') {
      // Mock TXT to JSON conversion
      return [
        { id: 'T-001', name: 'TXT User 1', amount: 1200, date: '2023-07-01', status: 'active', department: 'support' },
        { id: 'T-002', name: 'TXT User 2', amount: 900, date: '2023-07-02', status: 'pending', department: 'sales' }
      ]
    }
    else if (formatId === 'sql_db2' && toFormat.id === 'modern_sql') {
      // Mock DB2 to Modern SQL conversion
      return `-- Converted from DB2 to PostgreSQL
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    amount DECIMAL(10,2),
    status VARCHAR(50),
    order_date TIMESTAMP
);`
    }
    else if (formatId === 'csv' && toFormat.id === 'rest_api') {
      // Mock CSV to REST API spec
      return {
        openapi: "3.0.0",
        info: {
          title: "Data API",
          version: "1.0.0",
          description: "API generated from CSV data"
        },
        paths: {
          "/users": {
            get: {
              summary: "Get all users",
              responses: {
                "200": {
                  description: "List of users",
                  content: {
                    "application/json": {
                      schema: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "string" },
                            name: { type: "string" },
                            amount: { type: "number" }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    else if (formatId === 'csv' && toFormat.id === 'graphql') {
      // Mock CSV to GraphQL schema
      return `type User {
  id: ID!
  name: String!
  amount: Float!
  date: String!
  status: String!
  department: String!
}

type Query {
  users: [User!]!
  user(id: ID!): User
}

type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
}

input CreateUserInput {
  name: String!
  amount: Float!
  date: String!
  status: String!
  department: String!
}

input UpdateUserInput {
  name: String
  amount: Float
  date: String
  status: String
  department: String
}`
    }
    
    return data
  }

  const handleFileSelect = async (selectedFile) => {
    setFile(selectedFile)
    setMessage('')
    setParsedData(null)
    setConvertedData(null)
    setShowComparison(false)
    setLegacyStorageKey(null)
    setConversionStorageKey(null)
    
    if (selectedFile) {
      setIsParsing(true)
      setMessage('Parsing file...')
      
      try {
        // Auto-detect format based on file extension
        const extension = selectedFile.name.split('.').pop()?.toLowerCase()
        const formatMap = {
          'csv': 'csv',
          'txt': 'txt',
          'sql': 'sql_db2',
          'db2': 'sql_db2',
          'cmd': 'txt_as400',
          'cl': 'txt_as400',
          'xls': 'excel',
          'xlsx': 'excel'
        }
        
        const detectedFormatId = formatMap[extension] || 'csv'
        const detectedFormat = legacyFormats.find(f => f.id === detectedFormatId)
        
        if (detectedFormat) {
          setSelectedLegacyFormat(detectedFormat)
          
          // Parse the file
          const parseResult = await parseFile(selectedFile, detectedFormatId)
          
          if (parseResult.success) {
            // Store parsed data in localStorage
            const storageKey = storeParsedData(parseResult)
            setParsedData(parseResult)
            setLegacyStorageKey(storageKey)
            setMessage(`File parsed successfully! Found ${parseResult.metadata.recordCount} records.`)
          } else {
            setMessage(`Error parsing file: ${parseResult.error}`)
          }
        } else {
          setMessage('Unsupported file format')
        }
      } catch (error) {
        setMessage(`Error processing file: ${error.message}`)
      } finally {
        setIsParsing(false)
      }
    } else {
      setSelectedLegacyFormat(null)
      setSelectedModernFormat(null)
    }
  }

  const handleLegacyFormatSelect = (format) => {
    setSelectedLegacyFormat(format)
    setSelectedModernFormat(null) // Reset modern format selection
  }

  const handleModernFormatSelect = (format) => {
    setSelectedModernFormat(format)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!file || !selectedLegacyFormat || !selectedModernFormat || !parsedData) {
      setMessage('Please upload and parse a file, then select both source and target formats')
      return
    }

    // Check compatibility
    const compatibleFormats = getCompatibleFormats(selectedLegacyFormat.id)
    if (!compatibleFormats.includes(selectedModernFormat.id)) {
      setMessage(`Cannot convert ${selectedLegacyFormat.name} to ${selectedModernFormat.name}. Please select compatible formats.`)
      return
    }

    setIsUploading(true)
    setMessage('Converting data...')

    try {
      // Send file to backend for conversion (using mock service for now)
      const conversionResult = await mockConvertFile(
        file, 
        selectedLegacyFormat.id, 
        selectedModernFormat.id, 
        parsedData
      )
      
      if (conversionResult.success) {
        // Store converted data in localStorage
        const conversionStorageKey = storeConvertedData(conversionResult, legacyStorageKey)
        setConvertedData(conversionResult.data)
        setConversionStorageKey(conversionStorageKey)
        setShowComparison(true)
        setMessage('Data converted successfully!')
      } else {
        setMessage(`Conversion failed: ${conversionResult.error}`)
      }
      
    } catch (error) {
      setMessage('Error converting data: ' + error.message)
    } finally {
      setIsUploading(false)
    }
  }

  const resetForm = () => {
    setFile(null)
    setSelectedLegacyFormat(null)
    setSelectedModernFormat(null)
    setParsedData(null)
    setConvertedData(null)
    setShowComparison(false)
    setLegacyStorageKey(null)
    setConversionStorageKey(null)
    setMessage('')
  }

  // Get compatible modern formats for selected legacy format
  const compatibleModernFormats = selectedLegacyFormat 
    ? modernFormats.filter(format => 
        formatCompatibility[selectedLegacyFormat.id]?.includes(format.id)
      )
    : modernFormats

  return (
    <div className="flex w-full min-h-[calc(100vh-8rem)]">
      {/* Sidebar */}
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
              { path: '/dashboard', label: 'Data Upload', icon: '📁', active: true },
              { path: '/dashboard/api', label: 'API Explorer', icon: '🔗' }
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
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-4 transition-colors duration-200"
            >
              <span>←</span>
              <span className="text-sm font-medium">Back to Home</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Data Upload & Conversion
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Upload legacy files and convert them to modern formats with visual analysis
            </p>
          </div>

          {/* File Upload Section */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Upload Legacy File
            </h2>
            <FileUpload 
              onFileSelect={handleFileSelect}
              selectedFile={file}
              isUploading={isUploading || isParsing}
            />
          </div>

          {/* Parsed Data Information */}
          {parsedData && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 p-6 shadow-sm mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">✅</span>
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                  File Parsed Successfully
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {parsedData.metadata.recordCount}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">Records Found</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {parsedData.metadata.fields.length}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">Fields</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {parsedData.metadata.format}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">Format</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {(parsedData.metadata.fileSize / 1024).toFixed(1)}KB
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">File Size</div>
                </div>
              </div>
            </div>
          )}

          {/* Format Selection Section */}
          {file && parsedData && (
            <div className="space-y-8">
              {/* Legacy Format Selection */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Select Source Format (Legacy)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {legacyFormats.map(format => (
                    <FormatCard
                      key={format.id}
                      format={format}
                      type="legacy"
                      isSelected={selectedLegacyFormat?.id === format.id}
                      onClick={handleLegacyFormatSelect}
                    />
                  ))}
                </div>
              </div>

              {/* Modern Format Selection */}
              {selectedLegacyFormat && (
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Select Target Format (Modern)
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {modernFormats.map(format => {
                      const isCompatible = formatCompatibility[selectedLegacyFormat.id]?.includes(format.id)
                      return (
                        <FormatCard
                          key={format.id}
                          format={format}
                          type="modern"
                          isSelected={selectedModernFormat?.id === format.id}
                          isCompatible={isCompatible}
                          onClick={isCompatible ? handleModernFormatSelect : null}
                        />
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Conversion Button */}
              {selectedLegacyFormat && selectedModernFormat && (
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <span className="text-lg">{selectedLegacyFormat.icon}</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {selectedLegacyFormat.name}
                        </span>
                      </div>
                      <span className="text-2xl text-gray-400">→</span>
                      <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <span className="text-lg">{selectedModernFormat.icon}</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {selectedModernFormat.name}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleSubmit}
                      disabled={isUploading}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                    >
                      {isUploading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Converting...
                        </div>
                      ) : (
                        'Convert & Upload File'
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Message Display */}
              {message && (
                <div className={`p-4 rounded-lg ${
                  message.includes('successfully') 
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
                    : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                }`}>
                  {message}
                </div>
              )}
            </div>
          )}

          {/* Format Compatibility Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Format Compatibility & Statistics
              </h2>
              <button
                onClick={() => setShowCompatibility(!showCompatibility)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <span>{showCompatibility ? '▼' : '▶'}</span>
                <span>{showCompatibility ? 'Hide' : 'Show'} Compatibility</span>
              </button>
            </div>
            
            {showCompatibility && (
              <FormatCompatibility
                legacyFormats={legacyFormats}
                modernFormats={modernFormats}
                formatCompatibility={formatCompatibility}
                conversionStats={conversionStats}
              />
            )}
          </div>

          {/* Data Comparison Visualization */}
          {showComparison && parsedData && convertedData && (
            <div className="mt-8 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
              <DataComparison
                legacyData={parsedData.data}
                modernData={Array.isArray(convertedData.convertedData) ? convertedData.convertedData : [convertedData.convertedData]}
                legacyMetadata={parsedData.metadata}
                modernMetadata={convertedData.metadata}
              />
            </div>
          )}

          {/* Upload History
          <div className="mt-8 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Conversions
            </h3>
            <div className="space-y-3">
              {[
                { name: 'sales_data.csv', format: 'CSV → JSON', date: '2 hours ago', status: 'completed' },
                { name: 'user_profiles.xlsx', format: 'Excel → REST API', date: '1 day ago', status: 'completed' },
                { name: 'db_schema.sql', format: 'DB2 → Modern SQL', date: '3 days ago', status: 'completed' }
              ].map((conversion, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📄</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{conversion.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{conversion.format} • {conversion.date}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                    {conversion.status}
                  </span>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </main>
    </div>
  )
}

export default DataUpload