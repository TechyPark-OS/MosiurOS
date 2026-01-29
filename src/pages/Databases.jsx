import { useState } from 'react'
import { Database, Plus, Search, Users, Trash2, Edit, ExternalLink, Copy, Eye, EyeOff } from 'lucide-react'

const databases = [
  { id: 1, name: 'techypark_wp', size: '245 MB', tables: 42, user: 'techypark_user', created: '2024-01-05' },
  { id: 2, name: 'techypark_api', size: '128 MB', tables: 28, user: 'api_user', created: '2024-01-08' },
  { id: 3, name: 'techypark_crm', size: '512 MB', tables: 65, user: 'crm_user', created: '2024-01-10' },
  { id: 4, name: 'staging_db', size: '89 MB', tables: 35, user: 'staging_user', created: '2024-01-12' },
]

const dbUsers = [
  { id: 1, name: 'techypark_user', databases: ['techypark_wp'], host: 'localhost', created: '2024-01-05' },
  { id: 2, name: 'api_user', databases: ['techypark_api'], host: '%', created: '2024-01-08' },
  { id: 3, name: 'crm_user', databases: ['techypark_crm'], host: 'localhost', created: '2024-01-10' },
  { id: 4, name: 'staging_user', databases: ['staging_db'], host: 'localhost', created: '2024-01-12' },
]

export default function Databases() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('databases')
  const [showPassword, setShowPassword] = useState(false)

  const filteredDatabases = databases.filter(db =>
    db.name.toLowerCase().includes(search.toLowerCase())
  )

  const filteredUsers = dbUsers.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Database Manager</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage MySQL/MariaDB databases</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center gap-2">
            <ExternalLink className="w-4 h-4" /> phpMyAdmin
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Database
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Databases</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{databases.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Database Users</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{dbUsers.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Size</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">974 MB</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Tables</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">170</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="flex gap-4">
          {['databases', 'users'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 border-b-2 transition-colors capitalize ${
                activeTab === tab
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Databases Tab */}
      {activeTab === 'databases' && (
        <div className="card">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search databases..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Database</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Size</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Tables</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">User</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Created</th>
                  <th className="text-right p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDatabases.map(db => (
                  <tr key={db.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Database className="w-5 h-5 text-primary-500" />
                        <span className="font-medium text-slate-900 dark:text-white">{db.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-slate-600 dark:text-slate-300">{db.size}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-slate-600 dark:text-slate-300">{db.tables}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-sm text-slate-500">{db.user}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-slate-500">{db.created}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700" title="phpMyAdmin">
                          <ExternalLink className="w-4 h-4 text-slate-500" />
                        </button>
                        <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700" title="Edit">
                          <Edit className="w-4 h-4 text-slate-500" />
                        </button>
                        <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700" title="Delete">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="card">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-10"
              />
            </div>
            <button className="btn-primary text-sm flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add User
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Username</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Databases</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Host</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Created</th>
                  <th className="text-right p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-purple-500" />
                        <span className="font-mono text-slate-900 dark:text-white">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {user.databases.map(db => (
                          <span key={db} className="badge badge-info">{db}</span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-sm text-slate-500">{user.host}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-slate-500">{user.created}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700" title="Edit">
                          <Edit className="w-4 h-4 text-slate-500" />
                        </button>
                        <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700" title="Delete">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Connection Info */}
      <div className="card p-4">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Connection Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Host</p>
            <div className="flex items-center gap-2">
              <span className="font-mono text-slate-900 dark:text-white">localhost</span>
              <button className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600">
                <Copy className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Port</p>
            <div className="flex items-center gap-2">
              <span className="font-mono text-slate-900 dark:text-white">3306</span>
              <button className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600">
                <Copy className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
