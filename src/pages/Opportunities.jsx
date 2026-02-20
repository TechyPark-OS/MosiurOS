import { useState } from 'react'
import { Plus, Search, DollarSign, TrendingUp, Users, Target, Clock, CheckCircle, XCircle, Edit, Phone, Mail, Calendar, ArrowRight, MoreVertical, Filter } from 'lucide-react'

const stages = [
  { name: 'New Lead', color: 'bg-blue-500', count: 8, value: 45000 },
  { name: 'Qualified', color: 'bg-purple-500', count: 5, value: 85000 },
  { name: 'Proposal', color: 'bg-orange-500', count: 4, value: 120000 },
  { name: 'Negotiation', color: 'bg-yellow-500', count: 3, value: 95000 },
  { name: 'Closed Won', color: 'bg-green-500', count: 12, value: 450000 },
  { name: 'Closed Lost', color: 'bg-red-500', count: 6, value: 180000 },
]

const deals = [
  { id: 1, name: 'Enterprise Hosting Package', company: 'Tech Solutions Inc', contact: 'Alice Johnson', value: 25000, stage: 'Qualified', probability: 60, closeDate: '2024-02-15', owner: 'John Admin', lastActivity: '2 hours ago', source: 'Website' },
  { id: 2, name: 'Cloud Migration Project', company: 'Digital Agency', contact: 'Bob Smith', value: 50000, stage: 'Proposal', probability: 40, closeDate: '2024-03-01', owner: 'Sarah Manager', lastActivity: '1 day ago', source: 'Referral' },
  { id: 3, name: 'Managed WordPress Hosting', company: 'E-commerce Plus', contact: 'Carol White', value: 15000, stage: 'New Lead', probability: 20, closeDate: '2024-02-28', owner: 'John Admin', lastActivity: '3 hours ago', source: 'Funnel' },
  { id: 4, name: 'Annual Support Contract', company: 'Cloud Services', contact: 'David Brown', value: 35000, stage: 'Negotiation', probability: 75, closeDate: '2024-02-10', owner: 'Sarah Manager', lastActivity: '5 hours ago', source: 'Email' },
  { id: 5, name: 'SaaS Platform Development', company: 'StartupXYZ', contact: 'Eva Green', value: 80000, stage: 'Proposal', probability: 30, closeDate: '2024-04-01', owner: 'John Admin', lastActivity: '2 days ago', source: 'LinkedIn' },
  { id: 6, name: 'Email Marketing Suite', company: 'Marketing Pro', contact: 'Frank Lee', value: 12000, stage: 'Qualified', probability: 50, closeDate: '2024-02-20', owner: 'Mike Developer', lastActivity: '1 hour ago', source: 'Website' },
  { id: 7, name: 'Server Cluster Setup', company: 'Data Corp', contact: 'Grace Kim', value: 45000, stage: 'New Lead', probability: 15, closeDate: '2024-03-15', owner: 'John Admin', lastActivity: '4 hours ago', source: 'Webinar' },
  { id: 8, name: 'Custom CRM Integration', company: 'Sales Force Plus', contact: 'Henry Wang', value: 30000, stage: 'Negotiation', probability: 80, closeDate: '2024-02-05', owner: 'Sarah Manager', lastActivity: '30 min ago', source: 'Referral' },
]

const stageColors = {
  'New Lead': 'border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10',
  'Qualified': 'border-l-purple-500 bg-purple-50/50 dark:bg-purple-900/10',
  'Proposal': 'border-l-orange-500 bg-orange-50/50 dark:bg-orange-900/10',
  'Negotiation': 'border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10',
  'Closed Won': 'border-l-green-500 bg-green-50/50 dark:bg-green-900/10',
  'Closed Lost': 'border-l-red-500 bg-red-50/50 dark:bg-red-900/10',
}

export default function Opportunities() {
  const [view, setView] = useState('pipeline')
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [filterStage, setFilterStage] = useState('all')

  const totalValue = deals.reduce((s, d) => s + d.value, 0)
  const weightedValue = deals.reduce((s, d) => s + (d.value * d.probability / 100), 0)
  const filtered = deals.filter(d => {
    if (filterStage !== 'all' && d.stage !== filterStage) return false
    if (search && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.company.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Opportunities</h1>
          <p className="text-slate-500 dark:text-slate-400">Sales pipeline and deal management</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> New Deal</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pipeline Value', value: `$${(totalValue/1000).toFixed(0)}K`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Weighted Value', value: `$${(weightedValue/1000).toFixed(0)}K`, icon: Target, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Open Deals', value: deals.filter(d => !d.stage.startsWith('Closed')).length, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
          { label: 'Win Rate', value: `${Math.round(stages.find(s => s.name === 'Closed Won').count / (stages.find(s => s.name === 'Closed Won').count + stages.find(s => s.name === 'Closed Lost').count) * 100)}%`, icon: CheckCircle, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
        ].map((s, i) => (
          <div key={i} className="card p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
              <div><p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p><p className="text-lg font-bold text-slate-900 dark:text-white">{s.value}</p></div>
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline Overview */}
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Pipeline Overview</h3>
        <div className="flex gap-1 h-8 rounded-lg overflow-hidden">
          {stages.filter(s => !s.name.startsWith('Closed')).map(s => (
            <div key={s.name} className={`${s.color} flex items-center justify-center text-white text-xs font-medium`} style={{ width: `${(s.value / stages.filter(st => !st.name.startsWith('Closed')).reduce((sum, st) => sum + st.value, 0)) * 100}%` }}>
              {s.count}
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-2 flex-wrap">
          {stages.filter(s => !s.name.startsWith('Closed')).map(s => (
            <div key={s.name} className="flex items-center gap-1.5 text-xs text-slate-500">
              <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
              <span>{s.name}: {s.count} (${(s.value/1000).toFixed(0)}K)</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search deals..." value={search} onChange={e => setSearch(e.target.value)} className="input pl-10 w-full" />
        </div>
        <select value={filterStage} onChange={e => setFilterStage(e.target.value)} className="input">
          <option value="all">All Stages</option>
          {stages.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map(d => (
          <div key={d.id} className={`card p-4 border-l-4 ${stageColors[d.stage]} hover:shadow-md transition-shadow`}>
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{d.name}</h3>
                  <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-500">{d.stage}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mb-2">
                  <span>{d.company}</span><span>•</span><span>{d.contact}</span><span>•</span><span>Source: {d.source}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Close: {d.closeDate}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {d.lastActivity}</span>
                  <span>Owner: {d.owner}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-slate-900 dark:text-white">${d.value.toLocaleString()}</p>
                <p className="text-xs text-slate-400">{d.probability}% probability</p>
                <div className="w-20 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-1 ml-auto">
                  <div className="h-full bg-primary-500 rounded-full" style={{ width: `${d.probability}%` }} />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><Phone className="w-3.5 h-3.5 text-slate-400" /></button>
                <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><Mail className="w-3.5 h-3.5 text-slate-400" /></button>
                <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><Edit className="w-3.5 h-3.5 text-slate-400" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">New Deal</h2>
              <button onClick={() => setShowCreate(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Deal Name</label><input type="text" className="input w-full" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Value</label><input type="number" className="input w-full" placeholder="0" /></div>
                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Stage</label><select className="input w-full">{stages.map(s => <option key={s.name}>{s.name}</option>)}</select></div>
              </div>
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company</label><input type="text" className="input w-full" /></div>
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contact</label><input type="text" className="input w-full" /></div>
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Expected Close Date</label><input type="date" className="input w-full" /></div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreate(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={() => setShowCreate(false)} className="btn-primary flex-1">Create Deal</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
