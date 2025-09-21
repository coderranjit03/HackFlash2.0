// Backend conversion service

const API_BASE_URL = 'http://localhost:3001/api' // Adjust based on your backend

// Send file to backend for conversion
export const convertFile = async (file, sourceFormat, targetFormat) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('sourceFormat', sourceFormat)
    formData.append('targetFormat', targetFormat)
    
    const response = await fetch(`${API_BASE_URL}/convert`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const result = await response.json()
    return {
      success: true,
      data: result
    }
  } catch (error) {
    console.error('Conversion error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Fetch converted data from backend
export const getConvertedData = async (conversionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/converted/${conversionId}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const result = await response.json()
    return {
      success: true,
      data: result
    }
  } catch (error) {
    console.error('Fetch converted data error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Mock conversion service (for development/testing)
export const mockConvertFile = async (file, sourceFormat, targetFormat, parsedData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  try {
    let convertedData = null
    
    // Mock conversion based on source and target formats
    if (sourceFormat === 'csv' && targetFormat === 'json') {
      // CSV to JSON conversion
      convertedData = parsedData.data.map(item => ({
        id: `M-${item.id || Math.random().toString(36).substr(2, 9)}`,
        fullName: item.name ? `${item.name} (Modern)` : item.fullName || 'Unknown User',
        total: parseFloat(item.amount) ? parseFloat(item.amount) * 1.1 : 0,
        timestamp: new Date().toISOString(),
        userStatus: item.status || 'active',
        team: item.department || 'general',
        processed: true
      }))
    } 
    else if (sourceFormat === 'excel' && targetFormat === 'json') {
      // Excel to JSON conversion
      convertedData = parsedData.data.map(item => ({
        id: `E-${item.id || Math.random().toString(36).substr(2, 9)}`,
        fullName: item.name ? `${item.name} (Excel)` : item.fullName || 'Unknown User',
        total: parseFloat(item.amount) ? parseFloat(item.amount) * 1.05 : 0,
        timestamp: new Date().toISOString(),
        userStatus: item.status || 'active',
        team: item.department || 'general',
        processed: true
      }))
    }
    else if (sourceFormat === 'sql_db2' && targetFormat === 'modern_sql') {
      // DB2 to Modern SQL conversion
      convertedData = {
        schema: `-- Converted from DB2 to PostgreSQL
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
);`,
        tables: [
          { name: 'users', columns: ['id', 'name', 'email', 'created_at'] },
          { name: 'orders', columns: ['id', 'user_id', 'amount', 'status', 'order_date'] }
        ]
      }
    }
    else if (sourceFormat === 'csv' && targetFormat === 'rest_api') {
      // CSV to REST API spec
      convertedData = {
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
    else if (sourceFormat === 'csv' && targetFormat === 'graphql') {
      // CSV to GraphQL schema
      convertedData = {
        schema: `type User {
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
}`,
        types: ['User', 'Query', 'Mutation', 'CreateUserInput', 'UpdateUserInput']
      }
    }
    else {
      // Default conversion - just structure the data
      convertedData = parsedData.data.map((item, index) => ({
        id: `CONVERTED-${index + 1}`,
        originalData: item,
        convertedAt: new Date().toISOString(),
        sourceFormat: sourceFormat,
        targetFormat: targetFormat
      }))
    }
    
    return {
      success: true,
      data: {
        convertedData,
        metadata: {
          sourceFormat,
          targetFormat,
          originalRecordCount: parsedData.metadata.recordCount,
          convertedRecordCount: Array.isArray(convertedData) ? convertedData.length : 1,
          conversionTimestamp: new Date().toISOString(),
          fileName: parsedData.metadata.fileName
        }
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// Store converted data in localStorage
export const storeConvertedData = (conversionResult, legacyStorageKey) => {
  const storageKey = `converted_data_${Date.now()}`
  const dataToStore = {
    ...conversionResult,
    legacyStorageKey,
    timestamp: new Date().toISOString(),
    id: storageKey
  }
  
  localStorage.setItem(storageKey, JSON.stringify(dataToStore))
  
  // Also update the list of conversions
  const conversions = JSON.parse(localStorage.getItem('conversions') || '[]')
  conversions.push({
    id: storageKey,
    legacyStorageKey,
    sourceFormat: conversionResult.data.metadata.sourceFormat,
    targetFormat: conversionResult.data.metadata.targetFormat,
    timestamp: dataToStore.timestamp,
    fileName: conversionResult.data.metadata.fileName
  })
  
  localStorage.setItem('conversions', JSON.stringify(conversions))
  
  return storageKey
}

// Get conversion history
export const getConversionHistory = () => {
  const conversions = localStorage.getItem('conversions')
  return conversions ? JSON.parse(conversions) : []
}

// Get converted data by ID
export const getConvertedDataById = (conversionId) => {
  const data = localStorage.getItem(conversionId)
  return data ? JSON.parse(data) : null
}
