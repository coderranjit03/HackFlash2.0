// File parsing utilities for different formats

// Parse CSV content
export const parseCSV = (content) => {
  const lines = content.split('\n').filter(line => line.trim())
  if (lines.length === 0) return []
  
  const headers = lines[0].split(',').map(h => h.trim())
  const data = lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim())
    return headers.reduce((obj, header, index) => {
      obj[header] = values[index] || ''
      return obj
    }, {})
  })
  
  return data
}

// Parse TXT content (pipe-delimited)
export const parseTXT = (content) => {
  const lines = content.split('\n').filter(line => line.trim())
  if (lines.length === 0) return []
  
  // Try to detect delimiter
  const firstLine = lines[0]
  let delimiter = '|'
  
  if (firstLine.includes('\t')) delimiter = '\t'
  else if (firstLine.includes(',')) delimiter = ','
  else if (firstLine.includes(';')) delimiter = ';'
  
  const headers = firstLine.split(delimiter).map(h => h.trim())
  const data = lines.slice(1).map(line => {
    const values = line.split(delimiter).map(v => v.trim())
    return headers.reduce((obj, header, index) => {
      obj[header] = values[index] || ''
      return obj
    }, {})
  })
  
  return data
}

// Parse SQL content (extract table structure)
export const parseSQL = (content) => {
  // Extract CREATE TABLE statements and convert to structured data
  const createTableRegex = /CREATE TABLE\s+(\w+)\s*\(([\s\S]*?)\)/gi
  const tables = []
  
  let match
  while ((match = createTableRegex.exec(content)) !== null) {
    const tableName = match[1]
    const columns = match[2]
    
    // Parse columns
    const columnLines = columns.split(',').map(line => line.trim())
    const tableData = columnLines.map((line, index) => {
      const parts = line.trim().split(/\s+/)
      const columnName = parts[0]
      const columnType = parts[1] || 'VARCHAR'
      
      return {
        id: `${tableName}_${index + 1}`,
        table_name: tableName,
        column_name: columnName,
        column_type: columnType,
        position: index + 1
      }
    })
    
    tables.push(...tableData)
  }
  
  return tables
}

// Parse Excel content (mock implementation - in real app, use a library like xlsx)
export const parseExcel = (content) => {
  // Mock Excel parsing - in real implementation, use xlsx library
  return [
    { id: 'E-001', name: 'Excel User 1', amount: 1500, date: '2023-07-01', status: 'active', department: 'sales' },
    { id: 'E-002', name: 'Excel User 2', amount: 800, date: '2023-07-02', status: 'inactive', department: 'marketing' },
    { id: 'E-003', name: 'Excel User 3', amount: 2200, date: '2023-07-03', status: 'active', department: 'sales' },
    { id: 'E-004', name: 'Excel User 4', amount: 1200, date: '2023-07-04', status: 'pending', department: 'support' },
    { id: 'E-005', name: 'Excel User 5', amount: 1800, date: '2023-07-05', status: 'active', department: 'sales' }
  ]
}

// Parse JSON content
export const parseJSON = (content) => {
  try {
    const parsed = JSON.parse(content)
    return Array.isArray(parsed) ? parsed : [parsed]
  } catch (error) {
    console.error('JSON parsing error:', error)
    return []
  }
}

// Main parser function
export const parseFile = async (file, format) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const content = e.target.result
        let parsedData = []
        
        switch (format) {
          case 'csv':
            parsedData = parseCSV(content)
            break
          case 'txt':
            parsedData = parseTXT(content)
            break
          case 'sql_db2':
            parsedData = parseSQL(content)
            break
          case 'txt_as400':
            parsedData = parseTXT(content)
            break
          case 'excel':
            parsedData = parseExcel(content)
            break
          case 'json':
            parsedData = parseJSON(content)
            break
          default:
            parsedData = parseCSV(content) // Default to CSV
        }
        
        resolve({
          success: true,
          data: parsedData,
          metadata: {
            fileName: file.name,
            fileSize: file.size,
            format: format,
            recordCount: parsedData.length,
            fields: parsedData.length > 0 ? Object.keys(parsedData[0]) : []
          }
        })
      } catch (error) {
        reject({
          success: false,
          error: error.message
        })
      }
    }
    
    reader.onerror = () => {
      reject({
        success: false,
        error: 'Failed to read file'
      })
    }
    
    reader.readAsText(file)
  })
}

// Store parsed data in localStorage
export const storeParsedData = (parsedResult) => {
  const storageKey = `legacy_data_${Date.now()}`
  const dataToStore = {
    ...parsedResult,
    timestamp: new Date().toISOString(),
    id: storageKey
  }
  
  localStorage.setItem(storageKey, JSON.stringify(dataToStore))
  
  // Also update the list of stored files
  const storedFiles = JSON.parse(localStorage.getItem('stored_legacy_files') || '[]')
  storedFiles.push({
    id: storageKey,
    fileName: parsedResult.metadata.fileName,
    format: parsedResult.metadata.format,
    recordCount: parsedResult.metadata.recordCount,
    timestamp: dataToStore.timestamp
  })
  
  localStorage.setItem('stored_legacy_files', JSON.stringify(storedFiles))
  
  return storageKey
}

// Retrieve parsed data from localStorage
export const getParsedData = (storageKey) => {
  const data = localStorage.getItem(storageKey)
  return data ? JSON.parse(data) : null
}

// Get all stored legacy files
export const getStoredLegacyFiles = () => {
  const files = localStorage.getItem('stored_legacy_files')
  return files ? JSON.parse(files) : []
}
