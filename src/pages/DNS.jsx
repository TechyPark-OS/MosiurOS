import { useState } from 'react'
import { useData } from '../App'
import { Globe, Plus, Search, Settings, Trash2, Edit, CheckCircle, Clock } from 'lucide-react'

const dnsRecords = [
  { id: 1, type: 'A', name: '@', value: '192.168.1.10', ttl: 3600, status: 'active' },
  { id: 2, type: 'A', name: 'www', value: '192.168.1.10', ttl: 3600, status: 'active' },
  { id: 3, type: 'CNAME', name: 'api', value: 'techypark.com', ttl: 3600, status: 'active' },
  { id: 4, type: 'MX', name: '@', value: 'mail.techypark.com', ttl: 3600, priority: 10, status: 'active' },
  { id: 5, type: 'TXT', name: '@', value: 'v=spf1 include:_spf.techypark.com ~all', ttl: 3600, status: 'active' },
  { id: 6, type: 'TXT', name: '_dmarc', value: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@techypark.com', ttl: 3600, status: 'active' },
]

export default function DNS() {
  const { data } = useData()
  const [selectedZone, setSelectedZone] = useState(data.dnsZones[0])
  const [search, setSearch] = useState('')
  const [showAddRecord, setShowAddRecord] = useState(false)

  const filteredRecords = dnsRecords.filter(record =>
    record.name.toLowerCase().includes(search.toLowerCase()) ||
    record.value.toLowerCase().includes(search.toLowerCase())
  )

  const typeColors = {
    A: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    AAAA: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    CNAME: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    MX: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    TXT: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
    SRV: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">DNS Manager</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage DNS zones and records</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Zone
        </button>
      </div>

      {/* Zone Selector */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select Zone</label>
            <select 
              className="input"
              value={selectedZone?.id}
              onChange={(e) => setSelectedZone(data.dnsZones.find(z => z.id === parseInt(e.target.value)))}
            >
              {data.dnsZones.map(zone => (
                <option key={zone.id} value={zone.id}>{zone.domain}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button className="btn-secondary flex items-center gap-2">
              <Settings className="w-4 h-4" /> Zone Settings
            </button>
          </div>
        </div>
      </div>

      {/* Zone Info */}
      {selectedZone && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="card p-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">Domain</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">{selectedZone.domain}</p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">Records</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">{selectedZone.records}</p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">Provider</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">{selectedZone.provider}</p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">Status</p>
            <p className="text-lg font-semibold text-green-500 capitalize">{selectedZone.status}</p>
          </div>
        </div>
      )}

      {/* Records Table */}
      <div className="card">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search records..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-10"
              />
            </div>
            <button 
              onClick={() => setShowAddRecord(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Record
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Type</th>
                <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Name</th>
                <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Value</th>
                <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">TTL</th>
                <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Status</th>
                <th className="text-right p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map(record => (
                <tr key={record.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-4">
                    <span className={`badge ${typeColors[record.type]}`}>{record.type}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-sm text-slate-900 dark:text-white">{record.name}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-sm text-slate-600 dark:text-slate-300 truncate max-w-xs block">
                      {record.priority && <span className="text-slate-400 mr-1">{record.priority}</span>}
                      {record.value}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-slate-500">{record.ttl}s</span>
                  </td>
                  <td className="p-4">
                    <span className="flex items-center gap-1 text-green-500 text-sm">
                      <CheckCircle className="w-4 h-4" /> Active
                    </span>
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

      {/* Add Record Modal */}
      {showAddRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Add DNS Record</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
                <select className="input">
                  <option>A</option>
                  <option>AAAA</option>
                  <option>CNAME</option>
                  <option>MX</option>
                  <option>TXT</option>
                  <option>SRV</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
                <input type="text" className="input" placeholder="@ or subdomain" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Value</label>
                <input type="text" className="input" placeholder="IP address or hostname" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">TTL</label>
                <select className="input">
                  <option value="300">5 minutes</option>
                  <option value="3600">1 hour</option>
                  <option value="86400">1 day</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <button onClick={() => setShowAddRecord(false)} className="btn-secondary flex-1">Cancel</button>
                <button className="btn-primary flex-1">Add Record</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
