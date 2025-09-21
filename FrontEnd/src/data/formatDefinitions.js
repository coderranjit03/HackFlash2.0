// Legacy format definitions
export const legacyFormats = [
  {
    id: 'csv',
    name: 'CSV',
    description: 'Comma-separated values flat file',
    icon: '📄',
    color: 'blue',
    extensions: ['.csv'],
    examples: [
      'customer_data.csv',
      'sales_records.csv',
      'user_profiles.csv'
    ]
  },
  {
    id: 'txt',
    name: 'TXT',
    description: 'Fixed-width or pipe-delimited flat files',
    icon: '📝',
    color: 'green',
    extensions: ['.txt', '.dat'],
    examples: [
      'customer_data.txt',
      'sales_pipe.txt',
      'fixed_width.dat'
    ]
  },
  {
    id: 'sql_db2',
    name: 'SQL (DB2)',
    description: 'DB2 schema dumps and SQL scripts',
    icon: '🗄️',
    color: 'purple',
    extensions: ['.sql', '.db2'],
    examples: [
      'schema_dump.sql',
      'db2_export.sql',
      'table_structure.sql'
    ]
  },
  {
    id: 'txt_as400',
    name: 'TXT (AS/400)',
    description: 'AS/400 command scripts and data files',
    icon: '🖥️',
    color: 'orange',
    extensions: ['.txt', '.cmd', '.cl'],
    examples: [
      'as400_commands.txt',
      'system_scripts.cmd',
      'data_export.cl'
    ]
  },
  {
    id: 'excel',
    name: 'Excel',
    description: 'Microsoft Excel spreadsheets (XLS/XLSX)',
    icon: '📊',
    color: 'emerald',
    extensions: ['.xls', '.xlsx'],
    examples: [
      'financial_data.xlsx',
      'reports.xls',
      'analytics.xlsx'
    ]
  }
]

// Modern format definitions
export const modernFormats = [
  {
    id: 'json',
    name: 'JSON',
    description: 'JavaScript Object Notation',
    icon: '🔗',
    color: 'blue',
    extensions: ['.json'],
    examples: [
      'api_response.json',
      'configuration.json',
      'data_export.json'
    ]
  },
  {
    id: 'rest_api',
    name: 'REST API',
    description: 'OpenAPI/Swagger specification (YAML/JSON)',
    icon: '🌐',
    color: 'green',
    extensions: ['.yaml', '.yml', '.json'],
    examples: [
      'api_spec.yaml',
      'swagger.json',
      'openapi.yml'
    ]
  },
  {
    id: 'modern_sql',
    name: 'Modern SQL',
    description: 'PostgreSQL/MySQL schema',
    icon: '🗃️',
    color: 'purple',
    extensions: ['.sql', '.pgsql', '.mysql'],
    examples: [
      'postgres_schema.sql',
      'mysql_tables.sql',
      'modern_db.sql'
    ]
  },
  {
    id: 'graphql',
    name: 'GraphQL',
    description: 'GraphQL schema definition',
    icon: '🔍',
    color: 'pink',
    extensions: ['.graphql', '.gql'],
    examples: [
      'schema.graphql',
      'api_schema.gql',
      'types.graphql'
    ]
  }
]

// Format compatibility matrix
export const formatCompatibility = {
  'csv': ['json', 'rest_api', 'modern_sql', 'graphql'],
  'txt': ['json', 'rest_api', 'modern_sql'],
  'sql_db2': ['modern_sql', 'rest_api', 'graphql'],
  'txt_as400': ['json', 'modern_sql'],
  'excel': ['json', 'rest_api', 'modern_sql']
}

// Get compatible modern formats for a legacy format
export const getCompatibleFormats = (legacyFormatId) => {
  return formatCompatibility[legacyFormatId] || []
}

// Get all legacy formats compatible with a modern format
export const getCompatibleLegacyFormats = (modernFormatId) => {
  return Object.keys(formatCompatibility).filter(legacyId => 
    formatCompatibility[legacyId].includes(modernFormatId)
  )
}

// Conversion statistics (mock data for visualization)
export const conversionStats = {
  totalConversions: 1247,
  formatUsage: {
    'csv': 456,
    'txt': 234,
    'sql_db2': 189,
    'txt_as400': 156,
    'excel': 212
  },
  modernFormatUsage: {
    'json': 567,
    'rest_api': 298,
    'modern_sql': 234,
    'graphql': 148
  },
  commonConversions: [
    { from: 'csv', to: 'json', count: 234 },
    { from: 'excel', to: 'json', count: 189 },
    { from: 'csv', to: 'rest_api', count: 156 },
    { from: 'sql_db2', to: 'modern_sql', count: 134 },
    { from: 'txt', to: 'json', count: 123 }
  ]
}
