import { useState } from 'react'
import { useData } from '../App'
import { Shield, Plus, Search, RefreshCw, AlertTriangle, CheckCircle, Clock, Upload, Download } from 'lucide-react'

export default function SSL() {
  const { data } = useData()
  const [search, setSearch] = useState('')

  const filteredCerts = data.certificates.filter(cert =>
    cert.domain.toLowerCase().includes(search.toLowerCase())
  )

  const statusColors = {
    valid: 'badge-success',
    expiring: 'badge-warning',
    expired: 'badge-error',
  }

  const statusIcons = {
    valid: CheckCircle,
    expiring: Clock,
    expired: AlertTriangle,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">SSL Certificates</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage SSL/TLS certificates for your domains</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center gap-2">
            <Upload className="w-4 h-4" /> Import
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Issue Certificate
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Certificates</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{data.certificates.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Valid</p>
          <p className="text-2xl font-bold text-green-500">
            {data.certificates.filter(c => c.status === 'valid').length}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Expiring Soon</p>
          <p className="text-2xl font-bold text-yellow-500">
            {data.certificates.filter(c => c.status === 'expiring').length}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Auto-Renewal</p>
          <p className="text-2xl font-bold text-primary-500">
            {data.certificates.filter(c => c.autoRenew).length}
          </p>
        </div>
      </div>

      {/* Let's Encrypt Quick Issue */}
      <div className="card p-4">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Quick Issue - Let's Encrypt</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Enter domain (e.g., example.com)"
            className="input flex-1"
          />
          <div className="flex gap-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-slate-300" />
              <span className="text-sm text-slate-600 dark:text-slate-300">Include www</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-slate-300" />
              <span className="text-sm text-slate-600 dark:text-slate-300">Wildcard</span>
            </label>
          </div>
          <button className="btn-primary">Issue SSL</button>
        </div>
      </div>

      {/* Certificates List */}
      <div className="card">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search certificates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {filteredCerts.map(cert => {
            const StatusIcon = statusIcons[cert.status]
            return (
              <div key={cert.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      cert.status === 'valid' ? 'bg-green-100 dark:bg-green-900/30' :
                      cert.status === 'expiring' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                      'bg-red-100 dark:bg-red-900/30'
                    }`}>
                      <Shield className={`w-5 h-5 ${
                        cert.status === 'valid' ? 'text-green-500' :
                        cert.status === 'expiring' ? 'text-yellow-500' : 'text-red-500'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{cert.domain}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {cert.type} • Expires {cert.expires}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`badge ${statusColors[cert.status]} flex items-center gap-1`}>
                      <StatusIcon className="w-3 h-3" />
                      {cert.status}
                    </span>
                    {cert.autoRenew && (
                      <span className="badge badge-info flex items-center gap-1">
                        <RefreshCw className="w-3 h-3" /> Auto-renew
                      </span>
                    )}
                    <div className="flex items-center gap-1">
                      <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700" title="Renew">
                        <RefreshCw className="w-4 h-4 text-slate-500" />
                      </button>
                      <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700" title="Download">
                        <Download className="w-4 h-4 text-slate-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* SSL Settings */}
      <div className="card p-4">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Global SSL Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Force HTTPS</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Redirect all HTTP traffic to HTTPS</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary-500"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">HSTS</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">HTTP Strict Transport Security</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary-500"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Auto-Renewal</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Automatically renew Let's Encrypt certificates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary-500"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
