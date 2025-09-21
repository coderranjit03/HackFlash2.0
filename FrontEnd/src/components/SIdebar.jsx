import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  const navItems = [
    { path: '/dashboard', label: 'Data Upload', icon: '📁' },
    { path: '/dashboard/api', label: 'API Explorer', icon: '🔗' }
  ]

  const linkStyle = 'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 group'
  const activeStyle = ({ isActive }) => 
    `${linkStyle} ${isActive ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600' : 'text-gray-700 dark:text-gray-300'}`

  return (
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
          {navItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={activeStyle}
              end={item.path === '/dashboard'}
            >
              <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Quick Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200">
              <span>⚡</span>
              <span>Quick Sync</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200">
              <span>📈</span>
              <span>View Reports</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar