import { useState } from 'react'
import { Plus, Search, Zap, Play, Pause, Edit, Trash2, ArrowRight, Clock, CheckCircle, Users, Mail, ShoppingCart, GitBranch, Filter, Tag, Bell, MoreVertical, TrendingUp, Activity } from 'lucide-react'

const workflows = [
  { id: 1, name: 'Welcome Sequence', trigger: 'New Contact', steps: 8, status: 'active', enrolled: 12500, completed: 9800, running: 2700, lastRun: '2 min ago', description: 'Welcome new subscribers with a 5-day email sequence + tag assignment' },
  { id: 2, name: 'Abandoned Cart Recovery', trigger: 'Cart Abandoned', steps: 5, status: 'active', enrolled: 3200, completed: 2100, running: 1100, lastRun: '15 min ago', description: 'Send 3 reminder emails over 48 hours with discount escalation' },
  { id: 3, name: 'Post-Purchase Upsell', trigger: 'Purchase Complete', steps: 6, status: 'active', enrolled: 5600, completed: 4200, running: 1400, lastRun: '1 hour ago', description: 'Upsell related products after purchase with personalized recommendations' },
  { id: 4, name: 'Lead Scoring', trigger: 'Page Visit', steps: 4, status: 'active', enrolled: 25000, completed: 18000, running: 7000, lastRun: '5 min ago', description: 'Score leads based on engagement and route to sales when qualified' },
  { id: 5, name: 'Birthday Campaign', trigger: 'Date Trigger', steps: 3, status: 'active', enrolled: 800, completed: 750, running: 50, lastRun: '6 hours ago', description: 'Send birthday wishes with special discount code' },
  { id: 6, name: 'Webinar Follow-up', trigger: 'Webinar Attended', steps: 7, status: 'paused', enrolled: 1200, completed: 900, running: 0, lastRun: '2 weeks ago', description: 'Follow up with attendees and no-shows differently' },
  { id: 7, name: 'Re-engagement', trigger: 'Inactive 30 Days', steps: 4, status: 'draft', enrolled: 0, completed: 0, running: 0, lastRun: 'Never', description: 'Win back inactive subscribers with special offers' },
]

const triggers = [
  { name: 'New Contact', icon: Users, color: 'blue' },
  { name: 'Form Submitted', icon: CheckCircle, color: 'green' },
  { name: 'Purchase Complete', icon: ShoppingCart, color: 'purple' },
  { name: 'Cart Abandoned', icon: ShoppingCart, color: 'orange' },
  { name: 'Tag Added', icon: Tag, color: 'pink' },
  { name: 'Page Visit', icon: Activity, color: 'cyan' },
  { name: 'Date Trigger', icon: Clock, color: 'yellow' },
  { name: 'Email Opened', icon: Mail, color: 'indigo' },
]

const statusColors = { active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', paused: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', draft: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400' }

export default function Workflows() {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showCreate, setShowCreate] = useState(false)
  const [selectedWorkflow, setSelectedWorkflow] = useState(null)

  const filtered = workflows.filter(w => {
    if (filterStatus !== 'all' && w.status !== filterStatus) return false
    if (search && !w.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const totalActive = workflows.filter(w => w.status === 'active').length
  const totalRunning = workflows.reduce((s, w) => s + w.running, 0)
  const totalCompleted = workflows.reduce((s, w) => s + w.completed, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Workflows</h1>
          <p className="text-slate-500 dark:text-slate-400">Marketing automations and workflow builder</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Create Workflow</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Workflows', value: totalActive, icon: Zap, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Currently Running', value: totalRunning.toLocaleString(), icon: Play, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Total Completed', value: totalCompleted.toLocaleString(), icon: CheckCircle, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
          { label: 'Total Workflows', value: workflows.length, icon: GitBranch, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
        ].map((s, i) => (
          <div key={i} className="card p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
              <div><p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p><p className="text-lg font-bold text-slate-900 dark:text-white">{s.value}</p></div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search workflows..." value={search} onChange={e => setSearch(e.target.value)} className="input pl-10 w-full" />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'paused', 'draft'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-2 text-sm rounded-lg capitalize ${filterStatus === s ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map(w => (
          <div key={w.id} className="card p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedWorkflow(selectedWorkflow === w.id ? null : w.id)}>
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${w.status === 'active' ? 'bg-green-50 dark:bg-green-900/20' : w.status === 'paused' ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-slate-100 dark:bg-slate-700'}`}>
                <Zap className={`w-5 h-5 ${w.status === 'active' ? 'text-green-600' : w.status === 'paused' ? 'text-yellow-600' : 'text-slate-400'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{w.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[w.status]}`}>{w.status}</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{w.description}</p>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span>Trigger: {w.trigger}</span><span>•</span><span>{w.steps} steps</span><span>•</span><span>Last run: {w.lastRun}</span>
                </div>
              </div>
              <div className="hidden sm:grid grid-cols-3 gap-4 text-center">
                <div><p className="text-xs text-slate-400">Enrolled</p><p className="font-semibold text-slate-900 dark:text-white">{w.enrolled.toLocaleString()}</p></div>
                <div><p className="text-xs text-slate-400">Running</p><p className="font-semibold text-blue-600">{w.running.toLocaleString()}</p></div>
                <div><p className="text-xs text-slate-400">Completed</p><p className="font-semibold text-green-600">{w.completed.toLocaleString()}</p></div>
              </div>
            </div>

            {selectedWorkflow === w.id && (
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Workflow Steps</h4>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {['Trigger', 'Wait 1hr', 'Send Email', 'Check Open', 'Tag Contact', 'Notify Team', 'Complete'].slice(0, w.steps).map((step, i) => (
                    <div key={i} className="flex items-center gap-2 flex-shrink-0">
                      <div className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap ${i === 0 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}>{step}</div>
                      {i < w.steps - 1 && <ArrowRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="btn-primary text-sm flex items-center gap-1"><Edit className="w-3.5 h-3.5" /> Edit</button>
                  {w.status === 'active' ? (
                    <button className="btn-secondary text-sm flex items-center gap-1"><Pause className="w-3.5 h-3.5" /> Pause</button>
                  ) : (
                    <button className="btn-secondary text-sm flex items-center gap-1"><Play className="w-3.5 h-3.5" /> Activate</button>
                  )}
                  <button className="text-sm px-3 py-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create Workflow</h2>
              <button onClick={() => setShowCreate(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Workflow Name</label><input type="text" className="input w-full" placeholder="My Workflow" /></div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select Trigger</label>
                <div className="grid grid-cols-2 gap-2">
                  {triggers.map(t => (
                    <button key={t.name} className="p-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-left hover:border-primary-500 transition-colors">
                      <t.icon className="w-5 h-5 text-slate-600 dark:text-slate-400 mb-1" />
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{t.name}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreate(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={() => setShowCreate(false)} className="btn-primary flex-1">Create Workflow</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
