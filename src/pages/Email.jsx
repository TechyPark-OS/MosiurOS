import { useState } from 'react'
import { useData } from '../App'
import { Mail, Plus, Search, Settings, Trash2, Edit, Shield, Send, Inbox, Users } from 'lucide-react'

const aliases = [
  { id: 1, alias: 'info@techypark.com', destination: 'admin@techypark.com' },
  { id: 2, alias: 'contact@techypark.com', destination: 'support@techypark.com' },
]

export default function Email() {
  const { data } = useData()
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('mailboxes')

  const filteredMailboxes = data.mailboxes.filter(m =>
    m.email.toLowerCase().includes(search.toLowerCase())
  )

  const getStoragePercent = (used, quota) => {
    const usedGB = parseFloat(used)
    const quotaGB = parseFloat(quota)
    return Math.round((usedGB / quotaGB) * 100)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Email Manager</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage mailboxes, aliases, and email settings</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Mailbox
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Mailboxes</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{data.mailboxes.length}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Users className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Aliases</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{aliases.length}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Send className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Sent Today</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">1,245</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Inbox className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Received Today</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">3,892</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="flex gap-4">
          {['mailboxes', 'aliases', 'spam', 'dkim'].map(tab => (
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

      {/* Mailboxes Tab */}
      {activeTab === 'mailboxes' && (
        <div className="card">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search mailboxes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredMailboxes.map(mailbox => (
              <div key={mailbox.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {mailbox.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{mailbox.email}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {mailbox.storage} / {mailbox.quota}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 hidden sm:block">
                      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary-500" 
                          style={{ width: `${getStoragePercent(mailbox.storage, mailbox.quota)}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className={`badge ${mailbox.status === 'active' ? 'badge-success' : 'badge-error'}`}>
                      {mailbox.status}
                    </span>
                    <div className="flex items-center gap-1">
                      <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
                        <Edit className="w-4 h-4 text-slate-500" />
                      </button>
                      <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Aliases Tab */}
      {activeTab === 'aliases' && (
        <div className="card">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900 dark:text-white">Email Aliases</h3>
            <button className="btn-primary text-sm flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Alias
            </button>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {aliases.map(alias => (
              <div key={alias.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{alias.alias}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">→ {alias.destination}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
                    <Edit className="w-4 h-4 text-slate-500" />
                  </button>
                  <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Spam Tab */}
      {activeTab === 'spam' && (
        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Spam Protection</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Rspamd Spam Filter</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Advanced spam filtering with machine learning</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Greylisting</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Temporarily reject unknown senders</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary-500"></div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* DKIM Tab */}
      {activeTab === 'dkim' && (
        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Email Authentication</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center gap-4">
              <Shield className="w-8 h-8 text-green-500" />
              <div>
                <p className="font-medium text-green-700 dark:text-green-400">DKIM Configured</p>
                <p className="text-sm text-green-600 dark:text-green-500">All outgoing emails are signed</p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center gap-4">
              <Shield className="w-8 h-8 text-green-500" />
              <div>
                <p className="font-medium text-green-700 dark:text-green-400">SPF Record Active</p>
                <p className="text-sm text-green-600 dark:text-green-500">Authorized senders are defined</p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center gap-4">
              <Shield className="w-8 h-8 text-green-500" />
              <div>
                <p className="font-medium text-green-700 dark:text-green-400">DMARC Policy Set</p>
                <p className="text-sm text-green-600 dark:text-green-500">Policy: quarantine</p>
              </div>
            </div>
            <button className="btn-secondary">Regenerate DKIM Keys</button>
          </div>
        </div>
      )}
    </div>
  )
}
