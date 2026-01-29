import { useState } from 'react'
import { Building2, Plus, Search, Users, Globe, Settings, ChevronRight, Edit, Trash2 } from 'lucide-react'

const organizations = [
  { id: 1, name: 'Acme Corporation', plan: 'Enterprise', users: 25, sites: 50, status: 'active', created: '2022-01-15' },
  { id: 2, name: 'TechStart Inc', plan: 'Business', users: 10, sites: 15, status: 'active', created: '2023-03-20' },
  { id: 3, name: 'Global Media Group', plan: 'Enterprise', users: 45, sites: 120, status: 'active', created: '2021-08-10' },
  { id: 4, name: 'Local Business LLC', plan: 'Starter', users: 3, sites: 5, status: 'active', created: '2024-01-05' },
  { id: 5, name: 'DevAgency Co', plan: 'Business', users: 8, sites: 25, status: 'suspended', created: '2022-11-30' },
]

export default function Organizations() {
  const [search, setSearch] = useState('')

  const filteredOrgs = organizations.filter(org =>
    org.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Organizations</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage multi-tenant organizations</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Organization
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Organizations</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{organizations.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Active</p>
          <p className="text-2xl font-bold text-green-500">{organizations.filter(o => o.status === 'active').length}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Users</p>
          <p className="text-2xl font-bold text-primary-500">{organizations.reduce((sum, o) => sum + o.users, 0)}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Sites</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{organizations.reduce((sum, o) => sum + o.sites, 0)}</p>
        </div>
      </div>

      {/* Organizations List */}
      <div className="card">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search organizations..."
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
                <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Organization</th>
                <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Plan</th>
                <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Users</th>
                <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Sites</th>
                <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Status</th>
                <th className="text-right p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrgs.map(org => (
                <tr key={org.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{org.name}</p>
                        <p className="text-sm text-slate-500">Created {org.created}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`badge ${
                      org.plan === 'Enterprise' ? 'badge-info' :
                      org.plan === 'Business' ? 'badge-warning' : 'badge-success'
                    }`}>
                      {org.plan}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600 dark:text-slate-300">{org.users}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Globe className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600 dark:text-slate-300">{org.sites}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`badge ${org.status === 'active' ? 'badge-success' : 'badge-error'}`}>
                      {org.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700" title="Settings">
                        <Settings className="w-4 h-4 text-slate-500" />
                      </button>
                      <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700" title="Edit">
                        <Edit className="w-4 h-4 text-slate-500" />
                      </button>
                      <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700" title="View">
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
