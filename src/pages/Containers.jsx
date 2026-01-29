import { useState } from 'react'
import { useData } from '../App'
import { Container, Plus, Search, Play, Square, RotateCcw, Trash2, Terminal, Settings, Cpu, MemoryStick } from 'lucide-react'

export default function Containers() {
  const { data } = useData()
  const [search, setSearch] = useState('')

  const filteredContainers = data.containers.filter(container =>
    container.name.toLowerCase().includes(search.toLowerCase()) ||
    container.image.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total: data.containers.length,
    running: data.containers.filter(c => c.status === 'running').length,
    stopped: data.containers.filter(c => c.status === 'stopped').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Containers</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage Docker containers</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Deploy Container
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Containers</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Running</p>
          <p className="text-2xl font-bold text-green-500">{stats.running}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Stopped</p>
          <p className="text-2xl font-bold text-slate-500">{stats.stopped}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Memory</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">896 MB</p>
        </div>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search containers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Container Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredContainers.map(container => (
          <div key={container.id} className="card p-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  container.status === 'running' 
                    ? 'bg-green-100 dark:bg-green-900/30' 
                    : 'bg-slate-100 dark:bg-slate-700'
                }`}>
                  <Container className={`w-5 h-5 ${
                    container.status === 'running' ? 'text-green-500' : 'text-slate-500'
                  }`} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{container.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{container.image}</p>
                </div>
              </div>
              <span className={`badge ${container.status === 'running' ? 'badge-success' : 'badge-error'}`}>
                {container.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-1">
                  <Cpu className="w-4 h-4" /> CPU
                </div>
                <p className="font-semibold text-slate-900 dark:text-white">{container.cpu}%</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-1">
                  <MemoryStick className="w-4 h-4" /> Memory
                </div>
                <p className="font-semibold text-slate-900 dark:text-white">{container.ram} MB</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-4">
              <span>Ports: {container.ports}</span>
              <span>Server: {container.server}</span>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
              {container.status === 'running' ? (
                <button className="btn-secondary text-sm flex-1 flex items-center justify-center gap-1">
                  <Square className="w-4 h-4" /> Stop
                </button>
              ) : (
                <button className="btn-primary text-sm flex-1 flex items-center justify-center gap-1">
                  <Play className="w-4 h-4" /> Start
                </button>
              )}
              <button className="btn-secondary text-sm flex-1 flex items-center justify-center gap-1">
                <RotateCcw className="w-4 h-4" /> Restart
              </button>
              <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                <Terminal className="w-4 h-4 text-slate-500" />
              </button>
              <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                <Settings className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredContainers.length === 0 && (
        <div className="card p-12 text-center">
          <Container className="w-12 h-12 mx-auto mb-4 text-slate-400" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No containers found</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            {search ? 'Try adjusting your search' : 'Deploy your first container'}
          </p>
          <button className="btn-primary">
            <Plus className="w-4 h-4 mr-2" /> Deploy Container
          </button>
        </div>
      )}
    </div>
  )
}
