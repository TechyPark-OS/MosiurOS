import { useState } from 'react'
import { Flame, Plus, Search, Shield, Globe, Ban, CheckCircle, AlertTriangle, Trash2, Edit } from 'lucide-react'

const firewallRules = [
  { id: 1, type: 'allow', ip: '192.168.1.0/24', description: 'Local network', created: '2024-01-10' },
  { id: 2, type: 'deny', ip: '10.0.0.50', description: 'Blocked attacker', created: '2024-01-12' },
  { id: 3, type: 'allow', ip: '203.0.113.0/24', description: 'Office IP range', created: '2024-01-08' },
  { id: 4, type: 'deny', ip: '198.51.100.0/24', description: 'Known spam network', created: '2024-01-05' },
]

const blockedCountries = ['CN', 'RU', 'KP']

const recentBlocks = [
  { ip: '45.33.32.156', country: 'CN', reason: 'Brute force SSH', time: '2 min ago' },
  { ip: '185.220.101.34', country: 'RU', reason: 'Port scanning', time: '5 min ago' },
  { ip: '91.121.87.18', country: 'FR', reason: 'WAF rule triggered', time: '12 min ago' },
  { ip: '103.21.244.0', country: 'IN', reason: 'Rate limit exceeded', time: '18 min ago' },
]

export default function Firewall() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('rules')

  const filteredRules = firewallRules.filter(rule =>
    rule.ip.includes(search) || rule.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Firewall</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage firewall rules and security settings</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Rule
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Allow Rules</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {firewallRules.filter(r => r.type === 'allow').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <Ban className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Deny Rules</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {firewallRules.filter(r => r.type === 'deny').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <Globe className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Blocked Countries</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{blockedCountries.length}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Blocked Today</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">1,247</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="flex gap-4">
          {['rules', 'geofencing', 'rate-limits', 'fail2ban'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 border-b-2 transition-colors capitalize ${
                activeTab === tab
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </nav>
      </div>

      {/* Rules Tab */}
      {activeTab === 'rules' && (
        <div className="card">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search rules..."
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
                  <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Action</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">IP/Range</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Description</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Created</th>
                  <th className="text-right p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRules.map(rule => (
                  <tr key={rule.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-4">
                      <span className={`badge ${rule.type === 'allow' ? 'badge-success' : 'badge-error'}`}>
                        {rule.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-sm text-slate-900 dark:text-white">{rule.ip}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-slate-600 dark:text-slate-300">{rule.description}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-slate-500">{rule.created}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
                          <Edit className="w-4 h-4 text-slate-500" />
                        </button>
                        <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
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

      {/* Geofencing Tab */}
      {activeTab === 'geofencing' && (
        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Country Blocking</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4">Block traffic from specific countries</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {blockedCountries.map(country => (
              <span key={country} className="badge badge-error flex items-center gap-1">
                {country}
                <button className="ml-1 hover:text-red-800">×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <select className="input flex-1">
              <option>Select country to block...</option>
              <option value="AF">Afghanistan</option>
              <option value="AL">Albania</option>
              <option value="DZ">Algeria</option>
            </select>
            <button className="btn-primary">Add Country</button>
          </div>
        </div>
      )}

      {/* Rate Limits Tab */}
      {activeTab === 'rate-limits' && (
        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Rate Limiting</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-slate-900 dark:text-white">HTTP Requests</span>
                <span className="text-sm text-slate-500">100 req/min</span>
              </div>
              <input type="range" min="10" max="500" defaultValue="100" className="w-full" />
            </div>
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-slate-900 dark:text-white">API Requests</span>
                <span className="text-sm text-slate-500">60 req/min</span>
              </div>
              <input type="range" min="10" max="500" defaultValue="60" className="w-full" />
            </div>
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-slate-900 dark:text-white">Login Attempts</span>
                <span className="text-sm text-slate-500">5 attempts/5min</span>
              </div>
              <input type="range" min="1" max="20" defaultValue="5" className="w-full" />
            </div>
            <button className="btn-primary">Save Settings</button>
          </div>
        </div>
      )}

      {/* Fail2Ban Tab */}
      {activeTab === 'fail2ban' && (
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Fail2Ban Status</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                <p className="text-sm text-green-600 dark:text-green-400">SSH Protection</p>
                <p className="text-lg font-semibold text-green-700 dark:text-green-300">Active</p>
              </div>
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                <p className="text-sm text-green-600 dark:text-green-400">Mail Protection</p>
                <p className="text-lg font-semibold text-green-700 dark:text-green-300">Active</p>
              </div>
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                <p className="text-sm text-green-600 dark:text-green-400">Web Protection</p>
                <p className="text-lg font-semibold text-green-700 dark:text-green-300">Active</p>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Recently Blocked IPs</h3>
            <div className="space-y-2">
              {recentBlocks.map((block, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm text-slate-900 dark:text-white">{block.ip}</span>
                    <span className="badge badge-info">{block.country}</span>
                    <span className="text-sm text-slate-500">{block.reason}</span>
                  </div>
                  <span className="text-xs text-slate-400">{block.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
