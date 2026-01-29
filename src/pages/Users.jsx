import { useState } from 'react'
import { useData } from '../App'
import { Users as UsersIcon, Plus, Search, Shield, Edit, Trash2, Mail, Key, UserCheck, UserX } from 'lucide-react'

const roles = [
  { id: 1, name: 'Super Admin', users: 2, permissions: 'Full access to all features' },
  { id: 2, name: 'Admin', users: 5, permissions: 'Manage servers, sites, and users' },
  { id: 3, name: 'Reseller', users: 12, permissions: 'Create and manage client accounts' },
  { id: 4, name: 'Client', users: 45, permissions: 'Manage own sites and services' },
]

export default function Users() {
  const { data } = useData()
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('users')
  const [filter, setFilter] = useState('all')

  const filteredUsers = data.users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
                         user.email.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || user.role.toLowerCase() === filter
    return matchesSearch && matchesFilter
  })

  const stats = {
    total: data.users.length,
    active: data.users.filter(u => u.status === 'active').length,
    admins: data.users.filter(u => u.role === 'Admin' || u.role === 'Super Admin').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Users</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage users and access control</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Users</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Active</p>
          <p className="text-2xl font-bold text-green-500">{stats.active}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Administrators</p>
          <p className="text-2xl font-bold text-primary-500">{stats.admins}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Roles</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{roles.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="flex gap-4">
          {['users', 'roles', 'activity'].map(tab => (
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

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="card">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input pl-10"
                />
              </div>
              <div className="flex gap-2">
                {['all', 'admin', 'reseller', 'client'].map(role => (
                  <button
                    key={role}
                    onClick={() => setFilter(role)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                      filter === role
                        ? 'bg-primary-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">User</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Role</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Sites</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Last Login</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Status</th>
                  <th className="text-right p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                          <span className="text-white font-medium">{user.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{user.name}</p>
                          <p className="text-sm text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`badge ${
                        user.role === 'Admin' || user.role === 'Super Admin' ? 'badge-info' :
                        user.role === 'Reseller' ? 'badge-warning' : 'badge-success'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-slate-600 dark:text-slate-300">{user.sites}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-slate-500">{user.lastLogin}</span>
                    </td>
                    <td className="p-4">
                      <span className={`badge ${user.status === 'active' ? 'badge-success' : 'badge-error'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700" title="Edit">
                          <Edit className="w-4 h-4 text-slate-500" />
                        </button>
                        <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700" title="Reset Password">
                          <Key className="w-4 h-4 text-slate-500" />
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

      {/* Roles Tab */}
      {activeTab === 'roles' && (
        <div className="card">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900 dark:text-white">User Roles</h3>
            <button className="btn-primary text-sm flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Role
            </button>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {roles.map(role => (
              <div key={role.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{role.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{role.permissions}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="badge badge-info">{role.users} users</span>
                    <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
                      <Edit className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="card">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {[
              { user: 'John Doe', action: 'Logged in', time: '2 minutes ago', icon: UserCheck },
              { user: 'Jane Smith', action: 'Created new site', time: '15 minutes ago', icon: Plus },
              { user: 'Mike Johnson', action: 'Updated SSL certificate', time: '1 hour ago', icon: Shield },
              { user: 'Sarah Wilson', action: 'Changed password', time: '2 hours ago', icon: Key },
              { user: 'Tom Brown', action: 'Logged out', time: '3 hours ago', icon: UserX },
            ].map((activity, index) => (
              <div key={index} className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  <activity.icon className="w-5 h-5 text-slate-500" />
                </div>
                <div className="flex-1">
                  <p className="text-slate-900 dark:text-white">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-sm text-slate-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
