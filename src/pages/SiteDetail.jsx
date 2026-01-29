import { useState } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import { useData } from '../App'
import {
  Globe, ArrowLeft, Lock, Server, Settings, FolderOpen, Database,
  Shield, Activity, ExternalLink, RefreshCw, Trash2, Copy, Code
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const trafficData = [
  { day: 'Mon', visits: 2400 }, { day: 'Tue', visits: 3200 },
  { day: 'Wed', visits: 2800 }, { day: 'Thu', visits: 3600 },
  { day: 'Fri', visits: 4100 }, { day: 'Sat', visits: 2900 },
  { day: 'Sun', visits: 2100 },
]

const tabs = [
  { id: 'overview', name: 'Overview', icon: Activity },
  { id: 'files', name: 'Files', icon: FolderOpen },
  { id: 'database', name: 'Database', icon: Database },
  { id: 'ssl', name: 'SSL', icon: Shield },
  { id: 'settings', name: 'Settings', icon: Settings },
]

export default function SiteDetail() {
  const { id } = useParams()
  const { data } = useData()
  const [activeTab, setActiveTab] = useState('overview')
  const site = data.sites.find(s => s.id === parseInt(id))

  if (!site) {
    return (
      <div className="card p-12 text-center">
        <Globe className="w-12 h-12 mx-auto mb-4 text-slate-400" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Site not found</h3>
        <NavLink to="/sites" className="btn-primary">Back to Sites</NavLink>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <NavLink to="/sites" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </NavLink>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                {site.ssl && <Lock className="w-4 h-4 text-green-500" />}
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{site.domain}</h1>
              </div>
              <p className="text-slate-500 dark:text-slate-400">{site.type} • {site.server}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <a 
            href={`https://${site.domain}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-secondary flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" /> Visit Site
          </a>
          <button className="btn-primary flex items-center gap-2">
            <Settings className="w-4 h-4" /> Manage
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="flex gap-4 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="card p-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">Daily Visits</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{site.visits.toLocaleString()}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">Storage Used</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{site.storage}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">PHP Version</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{site.php || 'N/A'}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">SSL Status</p>
              <p className="text-2xl font-bold text-green-500">{site.ssl ? 'Active' : 'None'}</p>
            </div>
          </div>

          {/* Traffic Chart */}
          <div className="card p-4">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Traffic Overview</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                  <Line type="monotone" dataKey="visits" stroke="#0066FF" strokeWidth={2} dot={{ fill: '#0066FF' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-4">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button className="flex flex-col items-center gap-2 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <FolderOpen className="w-6 h-6 text-primary-500" />
                <span className="text-sm text-slate-700 dark:text-slate-300">File Manager</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <Database className="w-6 h-6 text-purple-500" />
                <span className="text-sm text-slate-700 dark:text-slate-300">phpMyAdmin</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <RefreshCw className="w-6 h-6 text-green-500" />
                <span className="text-sm text-slate-700 dark:text-slate-300">Clear Cache</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <Copy className="w-6 h-6 text-blue-500" />
                <span className="text-sm text-slate-700 dark:text-slate-300">Clone Site</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'files' && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">File Manager</h3>
            <button className="btn-secondary text-sm">Open Full Manager</button>
          </div>
          <div className="space-y-2">
            {['public_html', 'wp-content', 'wp-includes', 'wp-admin', '.htaccess', 'wp-config.php'].map((file, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                <div className="flex items-center gap-3">
                  <FolderOpen className="w-5 h-5 text-primary-500" />
                  <span className="text-slate-900 dark:text-white">{file}</span>
                </div>
                <span className="text-sm text-slate-500">drwxr-xr-x</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'database' && (
        <div className="card p-4">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Database</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
              <p className="text-sm text-slate-500 dark:text-slate-400">Database Name</p>
              <p className="font-mono text-slate-900 dark:text-white">techypark_wp</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
              <p className="text-sm text-slate-500 dark:text-slate-400">Database User</p>
              <p className="font-mono text-slate-900 dark:text-white">techypark_user</p>
            </div>
          </div>
          <button className="btn-primary">Open phpMyAdmin</button>
        </div>
      )}

      {activeTab === 'ssl' && (
        <div className="card p-4">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">SSL Certificate</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
              <Shield className="w-8 h-8 text-green-500" />
              <div>
                <p className="font-medium text-green-700 dark:text-green-400">SSL Certificate Active</p>
                <p className="text-sm text-green-600 dark:text-green-500">Let's Encrypt • Expires Mar 15, 2024</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary">Renew Certificate</button>
              <button className="btn-secondary">Force HTTPS</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="card p-4">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Site Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">PHP Version</label>
              <select className="input">
                <option>PHP 8.2</option>
                <option>PHP 8.1</option>
                <option>PHP 8.0</option>
                <option>PHP 7.4</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Document Root</label>
              <input type="text" className="input" value="/home/techypark/public_html" readOnly />
            </div>
            <div className="flex gap-2">
              <button className="btn-primary">Save Changes</button>
              <button className="btn-secondary text-red-500 hover:text-red-600">Delete Site</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
