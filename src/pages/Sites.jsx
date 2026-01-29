import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useData } from '../App'
import {
  Globe, Plus, Search, Lock, Unlock, Server, Eye, Settings,
  MoreVertical, ExternalLink, ChevronRight, Activity
} from 'lucide-react'

function SiteCard({ site }) {
  const statusColors = {
    active: 'badge-success',
    maintenance: 'badge-warning',
    suspended: 'badge-error',
  }

  return (
    <NavLink
      to={`/sites/${site.id}`}
      className="card p-4 hover:shadow-md transition-all hover:border-primary-500 dark:hover:border-primary-500"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              {site.ssl ? (
                <Lock className="w-4 h-4 text-green-500" />
              ) : (
                <LockOpen className="w-4 h-4 text-red-500" />
              )}
              <h3 className="font-semibold text-slate-900 dark:text-white">{site.domain}</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{site.type} {site.php && `• PHP ${site.php}`}</p>
          </div>
        </div>
        <span className={`badge ${statusColors[site.status]}`}>{site.status}</span>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-3">
        <span className="flex items-center gap-1">
          <Server className="w-4 h-4" /> {site.server}
        </span>
        <span>{site.storage}</span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-1 text-sm">
          <Activity className="w-4 h-4 text-green-500" />
          <span className="text-slate-600 dark:text-slate-300">{site.visits.toLocaleString()} visits/day</span>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-400" />
      </div>
    </NavLink>
  )
}

export default function Sites() {
  const { data } = useData()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filteredSites = data.sites.filter(site => {
    const matchesSearch = site.domain.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || site.status === filter
    return matchesSearch && matchesFilter
  })

  const stats = {
    total: data.sites.length,
    active: data.sites.filter(s => s.status === 'active').length,
    ssl: data.sites.filter(s => s.ssl).length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sites</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your websites and applications</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Site
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Sites</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Active</p>
          <p className="text-2xl font-bold text-green-500">{stats.active}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">SSL Secured</p>
          <p className="text-2xl font-bold text-primary-500">{stats.ssl}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search sites..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'maintenance', 'suspended'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === status 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Sites Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredSites.map(site => (
          <SiteCard key={site.id} site={site} />
        ))}
      </div>

      {filteredSites.length === 0 && (
        <div className="card p-12 text-center">
          <Globe className="w-12 h-12 mx-auto mb-4 text-slate-400" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No sites found</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            {search ? 'Try adjusting your search' : 'Get started by creating your first site'}
          </p>
          <button className="btn-primary">
            <Plus className="w-4 h-4 mr-2" /> Create Site
          </button>
        </div>
      )}
    </div>
  )
}
