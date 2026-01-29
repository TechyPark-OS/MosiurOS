import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useData } from '../App'
import {
  Server, Plus, Search, Filter, MoreVertical, Cpu, MemoryStick,
  HardDrive, Globe, Container, RefreshCw, Power, Terminal, ChevronRight
} from 'lucide-react'

function ServerCard({ server }) {
  const statusColors = {
    online: 'bg-green-500',
    warning: 'bg-yellow-500',
    offline: 'bg-red-500',
  }

  const getProgressColor = (value) => {
    if (value >= 80) return 'bg-red-500'
    if (value >= 60) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <NavLink
      to={`/servers/${server.id}`}
      className="card p-4 hover:shadow-md transition-all hover:border-primary-500 dark:hover:border-primary-500"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
            <Server className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900 dark:text-white">{server.name}</h3>
              <span className={`w-2 h-2 rounded-full ${statusColors[server.status]}`}></span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{server.ip} • {server.os}</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-400" />
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Cpu className="w-4 h-4" /> CPU
            </span>
            <span className="font-medium text-slate-900 dark:text-white">{server.cpu}%</span>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className={`h-full ${getProgressColor(server.cpu)} transition-all`} style={{ width: `${server.cpu}%` }}></div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <MemoryStick className="w-4 h-4" /> RAM
            </span>
            <span className="font-medium text-slate-900 dark:text-white">{server.ram}%</span>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className={`h-full ${getProgressColor(server.ram)} transition-all`} style={{ width: `${server.ram}%` }}></div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <HardDrive className="w-4 h-4" /> Disk
            </span>
            <span className="font-medium text-slate-900 dark:text-white">{server.disk}%</span>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className={`h-full ${getProgressColor(server.disk)} transition-all`} style={{ width: `${server.disk}%` }}></div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Globe className="w-4 h-4" /> {server.sites} sites
          </span>
          <span className="flex items-center gap-1">
            <Container className="w-4 h-4" /> {server.containers} containers
          </span>
        </div>
        <span className="text-xs text-slate-400">Uptime: {server.uptime}</span>
      </div>
    </NavLink>
  )
}

export default function Servers() {
  const { data } = useData()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filteredServers = data.servers.filter(server => {
    const matchesFilter = filter === 'all' || server.status === filter
    const matchesSearch = server.name.toLowerCase().includes(search.toLowerCase()) ||
                         server.ip.includes(search)
    return matchesFilter && matchesSearch
  })

  const stats = {
    total: data.servers.length,
    online: data.servers.filter(s => s.status === 'online').length,
    warning: data.servers.filter(s => s.status === 'warning').length,
    offline: data.servers.filter(s => s.status === 'offline').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Servers</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your server infrastructure</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Server
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Servers</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Online</p>
          <p className="text-2xl font-bold text-green-500">{stats.online}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Warning</p>
          <p className="text-2xl font-bold text-yellow-500">{stats.warning}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Offline</p>
          <p className="text-2xl font-bold text-red-500">{stats.offline}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search servers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-primary-500 text-white' 
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('online')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'online' 
                ? 'bg-green-500 text-white' 
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            Online
          </button>
          <button
            onClick={() => setFilter('warning')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'warning' 
                ? 'bg-yellow-500 text-white' 
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            Warning
          </button>
          <button
            onClick={() => setFilter('offline')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'offline' 
                ? 'bg-red-500 text-white' 
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            Offline
          </button>
        </div>
      </div>

      {/* Server Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredServers.map(server => (
          <ServerCard key={server.id} server={server} />
        ))}
      </div>

      {filteredServers.length === 0 && (
        <div className="card p-12 text-center">
          <Server className="w-12 h-12 mx-auto mb-4 text-slate-400" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No servers found</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            {search ? 'Try adjusting your search or filters' : 'Get started by adding your first server'}
          </p>
          <button className="btn-primary">
            <Plus className="w-4 h-4 mr-2" /> Add Server
          </button>
        </div>
      )}
    </div>
  )
}
