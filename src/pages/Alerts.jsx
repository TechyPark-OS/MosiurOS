import { useState } from 'react'
import { useData } from '../App'
import { Bell, Plus, Search, CheckCircle, AlertTriangle, XCircle, Clock, Settings, Trash2, Info } from 'lucide-react'

const alertRules = [
  { id: 1, name: 'High CPU Usage', condition: 'CPU > 90%', duration: '5 min', action: 'Email + Slack', enabled: true },
  { id: 2, name: 'Low Disk Space', condition: 'Disk > 85%', duration: '1 min', action: 'Email', enabled: true },
  { id: 3, name: 'Memory Warning', condition: 'RAM > 80%', duration: '10 min', action: 'Slack', enabled: true },
  { id: 4, name: 'SSL Expiring', condition: 'Days < 14', duration: 'Instant', action: 'Email', enabled: true },
  { id: 5, name: 'Site Down', condition: 'HTTP != 200', duration: '1 min', action: 'Email + SMS', enabled: true },
]

export default function Alerts() {
  const { data } = useData()
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('alerts')
  const [filter, setFilter] = useState('all')

  const filteredAlerts = data.alerts.filter(alert => {
    const matchesSearch = alert.message.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || alert.type === filter
    return matchesSearch && matchesFilter
  })

  const typeColors = {
    error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  }

  const typeIcons = {
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
    success: CheckCircle,
  }

  const stats = {
    total: data.alerts.length,
    error: data.alerts.filter(a => a.type === 'error').length,
    warning: data.alerts.filter(a => a.type === 'warning').length,
    resolved: data.alerts.filter(a => a.read === true).length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Alerts</h1>
          <p className="text-slate-500 dark:text-slate-400">Monitor and manage system alerts</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Rule
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Alerts</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Critical</p>
          <p className="text-2xl font-bold text-red-500">{stats.error}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Warnings</p>
          <p className="text-2xl font-bold text-yellow-500">{stats.warning}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Resolved</p>
          <p className="text-2xl font-bold text-green-500">{stats.resolved}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="flex gap-4">
          {['alerts', 'rules', 'channels'].map(tab => (
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

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="card">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search alerts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input pl-10"
                />
              </div>
              <div className="flex gap-2">
                {['all', 'error', 'warning', 'info'].map(type => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                      filter === type
                        ? 'bg-primary-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredAlerts.map(alert => {
              const TypeIcon = typeIcons[alert.type] || Bell
              return (
                <div key={alert.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        alert.type === 'error' ? 'bg-red-100 dark:bg-red-900/30' :
                        alert.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                        alert.type === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
                        'bg-blue-100 dark:bg-blue-900/30'
                      }`}>
                        <TypeIcon className={`w-5 h-5 ${
                          alert.type === 'error' ? 'text-red-500' :
                          alert.type === 'warning' ? 'text-yellow-500' :
                          alert.type === 'success' ? 'text-green-500' : 'text-blue-500'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{alert.title}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{alert.message}</p>
                        <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mt-1">
                          {alert.server && <span>{alert.server}</span>}
                          {alert.server && <span>•</span>}
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {alert.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[alert.type]}`}>
                        {alert.type}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        alert.read 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {alert.read ? 'read' : 'unread'}
                      </span>
                      {!alert.read && (
                        <button className="btn-secondary text-sm">Acknowledge</button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Rules Tab */}
      {activeTab === 'rules' && (
        <div className="card">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900 dark:text-white">Alert Rules</h3>
            <button className="btn-primary text-sm flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Rule
            </button>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {alertRules.map(rule => (
              <div key={rule.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{rule.name}</p>
                    <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mt-1">
                      <span className="font-mono">{rule.condition}</span>
                      <span>•</span>
                      <span>Duration: {rule.duration}</span>
                      <span>•</span>
                      <span>Action: {rule.action}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={rule.enabled} />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary-500"></div>
                    </label>
                    <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
                      <Settings className="w-4 h-4 text-slate-500" />
                    </button>
                    <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Channels Tab */}
      {activeTab === 'channels' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="card p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xl">
                📧
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Email</p>
                <p className="text-sm text-green-500">Connected</p>
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">admin@techypark.com</p>
            <button className="btn-secondary text-sm mt-4 w-full">Configure</button>
          </div>

          <div className="card p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-xl">
                💬
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Slack</p>
                <p className="text-sm text-green-500">Connected</p>
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">#alerts channel</p>
            <button className="btn-secondary text-sm mt-4 w-full">Configure</button>
          </div>

          <div className="card p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-xl">
                📱
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">SMS</p>
                <p className="text-sm text-green-500">Connected</p>
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">+1 (555) 123-4567</p>
            <button className="btn-secondary text-sm mt-4 w-full">Configure</button>
          </div>

          <div className="card p-4 border-dashed">
            <div className="flex flex-col items-center justify-center py-4">
              <Plus className="w-8 h-8 text-slate-400 mb-2" />
              <p className="font-medium text-slate-900 dark:text-white">Add Channel</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Webhook, PagerDuty, etc.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
