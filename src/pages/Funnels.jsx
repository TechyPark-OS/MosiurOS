import { useState } from 'react'
import {
  GitBranch, Plus, Search, Filter, MoreVertical, Eye, Edit, Copy, Trash2,
  BarChart3, ArrowRight, Clock, CheckCircle, Pause, ChevronRight, Zap,
  TrendingUp, Users, DollarSign, MousePointer, Target, Layers, ArrowUpRight
} from 'lucide-react'

const funnelTemplates = [
  { id: 't1', name: 'Lead Generation', desc: 'Capture leads with opt-in page', steps: 3, category: 'Lead Gen', color: 'blue' },
  { id: 't2', name: 'Product Launch', desc: 'Launch a new product with hype', steps: 5, category: 'Sales', color: 'purple' },
  { id: 't3', name: 'Webinar Registration', desc: 'Register attendees for webinars', steps: 4, category: 'Webinar', color: 'green' },
  { id: 't4', name: 'Tripwire Funnel', desc: 'Low-ticket offer to acquire customers', steps: 4, category: 'Sales', color: 'orange' },
  { id: 't5', name: 'Membership Funnel', desc: 'Sell access to membership site', steps: 5, category: 'Membership', color: 'pink' },
  { id: 't6', name: 'Survey Funnel', desc: 'Qualify leads through surveys', steps: 4, category: 'Lead Gen', color: 'cyan' },
]

const funnels = [
  { id: 1, name: 'Product Launch Funnel', status: 'active', steps: 5, visitors: 12450, optIns: 3200, sales: 480, revenue: 47520, conversion: 3.86, lastEdited: '2 hours ago', thumbnail: '🚀' },
  { id: 2, name: 'Lead Magnet Funnel', status: 'active', steps: 3, visitors: 8900, optIns: 4200, sales: 0, revenue: 0, conversion: 47.19, lastEdited: '1 day ago', thumbnail: '🧲' },
  { id: 3, name: 'Webinar Registration', status: 'active', steps: 4, visitors: 5600, optIns: 1890, sales: 156, revenue: 23400, conversion: 2.79, lastEdited: '3 days ago', thumbnail: '🎥' },
  { id: 4, name: 'Black Friday Sale', status: 'paused', steps: 6, visitors: 25000, optIns: 8500, sales: 2100, revenue: 189000, conversion: 8.4, lastEdited: '2 weeks ago', thumbnail: '🏷️' },
  { id: 5, name: 'Free Trial Funnel', status: 'draft', steps: 4, visitors: 0, optIns: 0, sales: 0, revenue: 0, conversion: 0, lastEdited: '5 days ago', thumbnail: '🆓' },
  { id: 6, name: 'Upsell Sequence', status: 'active', steps: 3, visitors: 3200, optIns: 0, sales: 640, revenue: 32000, conversion: 20, lastEdited: '1 week ago', thumbnail: '⬆️' },
]

const statusColors = { active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', paused: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', draft: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400' }
const statusIcons = { active: CheckCircle, paused: Pause, draft: Clock }

export default function Funnels() {
  const [tab, setTab] = useState('funnels')
  const [showCreate, setShowCreate] = useState(false)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedFunnel, setSelectedFunnel] = useState(null)

  const filtered = funnels.filter(f => {
    if (filterStatus !== 'all' && f.status !== filterStatus) return false
    if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const totalRevenue = funnels.reduce((s, f) => s + f.revenue, 0)
  const totalVisitors = funnels.reduce((s, f) => s + f.visitors, 0)
  const totalSales = funnels.reduce((s, f) => s + f.sales, 0)
  const avgConversion = funnels.filter(f => f.visitors > 0).reduce((s, f) => s + f.conversion, 0) / funnels.filter(f => f.visitors > 0).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Funnels</h1>
          <p className="text-slate-500 dark:text-slate-400">Build and manage your sales funnels</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Funnel
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `$${(totalRevenue/1000).toFixed(1)}K`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Total Visitors', value: totalVisitors.toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Total Sales', value: totalSales.toLocaleString(), icon: Target, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
          { label: 'Avg Conversion', value: `${avgConversion.toFixed(1)}%`, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
        ].map((s, i) => (
          <div key={i} className="card p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
        {['funnels', 'templates', 'analytics'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${tab === t ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'funnels' && (
        <>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search funnels..." value={search} onChange={e => setSearch(e.target.value)} className="input pl-10 w-full" />
            </div>
            <div className="flex gap-2">
              {['all', 'active', 'paused', 'draft'].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-2 text-sm rounded-lg capitalize ${filterStatus === s ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {filtered.map(funnel => {
              const StatusIcon = statusIcons[funnel.status]
              return (
                <div key={funnel.id} className="card p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedFunnel(selectedFunnel === funnel.id ? null : funnel.id)}>
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-2xl flex-shrink-0">
                      {funnel.thumbnail}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white">{funnel.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${statusColors[funnel.status]}`}>
                          <StatusIcon className="w-3 h-3" /> {funnel.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5" /> {funnel.steps} steps</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {funnel.lastEdited}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                        <div><p className="text-xs text-slate-400">Visitors</p><p className="font-semibold text-slate-900 dark:text-white">{funnel.visitors.toLocaleString()}</p></div>
                        <div><p className="text-xs text-slate-400">Opt-ins</p><p className="font-semibold text-slate-900 dark:text-white">{funnel.optIns.toLocaleString()}</p></div>
                        <div><p className="text-xs text-slate-400">Sales</p><p className="font-semibold text-slate-900 dark:text-white">{funnel.sales.toLocaleString()}</p></div>
                        <div><p className="text-xs text-slate-400">Revenue</p><p className="font-semibold text-green-600">${funnel.revenue.toLocaleString()}</p></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Eye className="w-4 h-4 text-slate-400" /></button>
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Edit className="w-4 h-4 text-slate-400" /></button>
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><BarChart3 className="w-4 h-4 text-slate-400" /></button>
                    </div>
                  </div>

                  {selectedFunnel === funnel.id && (
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Funnel Steps</h4>
                      <div className="flex items-center gap-2 overflow-x-auto pb-2">
                        {['Opt-in Page', 'Thank You', 'Sales Page', 'Checkout', 'Upsell'].slice(0, funnel.steps).map((step, i) => (
                          <div key={i} className="flex items-center gap-2 flex-shrink-0">
                            <div className="px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                              {step}
                            </div>
                            {i < funnel.steps - 1 && <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button className="btn-primary text-sm flex items-center gap-1"><Edit className="w-3.5 h-3.5" /> Edit Funnel</button>
                        <button className="btn-secondary text-sm flex items-center gap-1"><Copy className="w-3.5 h-3.5" /> Duplicate</button>
                        <button className="btn-secondary text-sm flex items-center gap-1"><BarChart3 className="w-3.5 h-3.5" /> Analytics</button>
                        <button className="text-sm px-3 py-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}

      {tab === 'templates' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {funnelTemplates.map(t => (
            <div key={t.id} className="card p-5 hover:shadow-md transition-shadow cursor-pointer group">
              <div className={`w-12 h-12 rounded-xl bg-${t.color}-100 dark:bg-${t.color}-900/30 flex items-center justify-center mb-3`}>
                <GitBranch className={`w-6 h-6 text-${t.color}-600`} />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{t.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{t.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{t.steps} steps • {t.category}</span>
                <button className="text-sm text-primary-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Use Template <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'analytics' && (
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Funnel Performance Overview</h3>
            <div className="space-y-4">
              {funnels.filter(f => f.status === 'active').map(f => (
                <div key={f.id} className="flex items-center gap-4">
                  <div className="w-32 text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{f.name}</div>
                  <div className="flex-1">
                    <div className="h-6 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full flex items-center justify-end pr-2" style={{ width: `${Math.min(f.conversion * 5, 100)}%` }}>
                        <span className="text-xs font-medium text-white">{f.conversion}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-green-600 w-24 text-right">${f.revenue.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="card p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Top Converting Funnels</h3>
              {funnels.sort((a, b) => b.conversion - a.conversion).slice(0, 3).map((f, i) => (
                <div key={f.id} className="flex items-center gap-3 py-2">
                  <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <span className="flex-1 text-sm text-slate-700 dark:text-slate-300">{f.name}</span>
                  <span className="text-sm font-semibold text-primary-600">{f.conversion}%</span>
                </div>
              ))}
            </div>
            <div className="card p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Revenue by Funnel</h3>
              {funnels.sort((a, b) => b.revenue - a.revenue).slice(0, 3).map((f, i) => (
                <div key={f.id} className="flex items-center gap-3 py-2">
                  <span className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <span className="flex-1 text-sm text-slate-700 dark:text-slate-300">{f.name}</span>
                  <span className="text-sm font-semibold text-green-600">${f.revenue.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Funnel Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create New Funnel</h2>
                <button onClick={() => setShowCreate(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Funnel Name</label>
                <input type="text" placeholder="My Awesome Funnel" className="input w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Choose a Template</label>
                <div className="grid grid-cols-2 gap-3">
                  {funnelTemplates.slice(0, 4).map(t => (
                    <div key={t.id} className="p-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl cursor-pointer hover:border-primary-500 transition-colors">
                      <h4 className="font-medium text-sm text-slate-900 dark:text-white">{t.name}</h4>
                      <p className="text-xs text-slate-500 mt-1">{t.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreate(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={() => setShowCreate(false)} className="btn-primary flex-1">Create Funnel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
