// src/data/mock.js

export const mockStatus = [
  { label: 'Jobs Completed', value: 128, color: 'bg-green-500' },
  { label: 'Jobs Running', value: 4, color: 'bg-blue-500' },
  { label: 'Jobs Failed', value: 7, color: 'bg-red-500' }
]

export const mockLegacyData = [
  { id: 'L-001', name: 'Alice Johnson', amount: 1200, date: '2023-06-01', status: 'active', department: 'sales' },
  { id: 'L-002', name: 'Bob Smith', amount: 450, date: '2023-06-02', status: 'inactive', department: 'marketing' },
  { id: 'L-003', name: 'Carol Davis', amount: 2100, date: '2023-06-03', status: 'active', department: 'sales' },
  { id: 'L-004', name: 'David Wilson', amount: 890, date: '2023-06-04', status: 'pending', department: 'support' },
  { id: 'L-005', name: 'Eva Brown', amount: 1650, date: '2023-06-05', status: 'active', department: 'sales' }
]

export const mockModernData = [
  { id: 'M-001', fullName: 'Alice A. Johnson', total: 1225, timestamp: '2023-06-01T10:45:00Z', userStatus: 'active', team: 'sales', processed: true },
  { id: 'M-002', fullName: 'Bob B. Smith', total: 470, timestamp: '2023-06-02T08:15:00Z', userStatus: 'inactive', team: 'marketing', processed: false },
  { id: 'M-003', fullName: 'Carol C. Davis', total: 2150, timestamp: '2023-06-03T14:30:00Z', userStatus: 'active', team: 'sales', processed: true },
  { id: 'M-004', fullName: 'David D. Wilson', total: 890, timestamp: '2023-06-04T09:20:00Z', userStatus: 'pending', team: 'support', processed: false },
  { id: 'M-005', fullName: 'Eva E. Brown', total: 1650, timestamp: '2023-06-05T16:45:00Z', userStatus: 'active', team: 'sales', processed: true }
]

export const mockLogs = [
  { id: 'JOB-1001', status: 'Completed', date: '2025-09-18 14:22', details: 'Daily sync' },
  { id: 'JOB-1002', status: 'Failed', date: '2025-09-19 03:10', details: 'API timeout' },
  { id: 'JOB-1003', status: 'Completed', date: '2025-09-19 21:05', details: 'Backfill' }
]

export const mockApis = [
  { name: 'List Users', method: 'GET', path: '/api/users' },
  { name: 'Create Job', method: 'POST', path: '/api/jobs' },
  { name: 'Get Job', method: 'GET', path: '/api/jobs/:id' }
]