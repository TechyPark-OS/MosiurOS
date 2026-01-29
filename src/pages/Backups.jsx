import { useState } from 'react'
import { useData } from '../App'
import { Archive, Plus, Search, Download, RotateCcw, Trash2, Clock, CheckCircle, AlertCircle, Cloud, HardDrive, Server } from 'lucide-react'

const schedules = [
  { id: 1, name: 'Daily Full Backup', type: 'full', schedule: '0 2 * * *', target: 'S3', retention: '7 days', enabled: true },
  { id: 2, name: 'Hourly Database', type: 'database', schedule: '0 * * * *', target: 'Local', retention: '24 hours', enabled: true },
  { id: 3, name: 'Weekly Archive', type: 'full', schedule: '0 3 * * 0', target: 'Google Drive', retention: '30 days', enabled: true },
]

export default function Backups() {
  const { data } = useData()
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('backups')

  const filteredBackups = data.backups.filter(backup =>
    backup.name.toLowerCase().includes(search.toLowerCase())
  )

  const statusColors = {
    completed: 'badge-success',
    in_progress: 'badge-warning',
    failed: 'badge-error',
  }

  const statusIcons = {
    completed: CheckCircle,
    in_progress: Clock,
    failed: AlertCircle,
  }

  const targetIcons = {
    S3: Cloud,
    Local: HardDrive,
    'Google Drive': Cloud,
    SFTP: Server,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Backup Center</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage backups and restore points</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Backup
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Backups</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{data.backups.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Storage Used</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">19.2 GB</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Scheduled Jobs</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{schedules.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Last Backup</p>
          <p className="text-2xl font-bold text-green-500">2h ago</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="flex gap-4">
          {['backups', 'schedules', 'targets'].map(tab => (
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

      {/* Backups Tab */}
      {activeTab === 'backups' && (
        <div className="card">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search backups..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredBackups.map(backup => {
              const StatusIcon = statusIcons[backup.status]
              const TargetIcon = targetIcons[backup.target] || Cloud
              return (
                <div key={backup.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                        <Archive className="w-5 h-5 text-primary-500" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{backup.name}</p>
                        <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                          <span>{backup.date}</span>
                          <span>•</span>
                          <span>{backup.size}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <TargetIcon className="w-3 h-3" /> {backup.target}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`badge ${statusColors[backup.status]} flex items-center gap-1`}>
                        <StatusIcon className="w-3 h-3" />
                        {backup.status.replace('_', ' ')}
                      </span>
                      <div className="flex items-center gap-1">
                        <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700" title="Download">
                          <Download className="w-4 h-4 text-slate-500" />
                        </button>
                        <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700" title="Restore">
                          <RotateCcw className="w-4 h-4 text-slate-500" />
                        </button>
                        <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700" title="Delete">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Schedules Tab */}
      {activeTab === 'schedules' && (
        <div className="card">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900 dark:text-white">Backup Schedules</h3>
            <button className="btn-primary text-sm flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Schedule
            </button>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {schedules.map(schedule => (
              <div key={schedule.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{schedule.name}</p>
                    <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mt-1">
                      <span className="badge badge-info">{schedule.type}</span>
                      <span className="font-mono">{schedule.schedule}</span>
                      <span>→ {schedule.target}</span>
                      <span>• Retention: {schedule.retention}</span>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={schedule.enabled} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary-500"></div>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Targets Tab */}
      {activeTab === 'targets' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="card p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Cloud className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Amazon S3</p>
                <p className="text-sm text-green-500">Connected</p>
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Bucket: techypark-backups</p>
            <button className="btn-secondary text-sm mt-4 w-full">Configure</button>
          </div>

          <div className="card p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Cloud className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Google Drive</p>
                <p className="text-sm text-green-500">Connected</p>
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Folder: /Backups</p>
            <button className="btn-secondary text-sm mt-4 w-full">Configure</button>
          </div>

          <div className="card p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                <HardDrive className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Local Storage</p>
                <p className="text-sm text-green-500">Available</p>
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Path: /var/backups</p>
            <button className="btn-secondary text-sm mt-4 w-full">Configure</button>
          </div>

          <div className="card p-4 border-dashed">
            <div className="flex flex-col items-center justify-center py-4">
              <Plus className="w-8 h-8 text-slate-400 mb-2" />
              <p className="font-medium text-slate-900 dark:text-white">Add Target</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">SFTP, Dropbox, etc.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
