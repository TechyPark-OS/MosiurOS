import { useState } from 'react'
import { Plus, Search, Mail, Users, TrendingUp, Eye, Edit, Copy, Trash2, Send, Clock, CheckCircle, BarChart3, MousePointer, AlertCircle, Zap, FileText, ArrowRight } from 'lucide-react'

const campaigns = [
  { id: 1, name: 'Product Launch Announcement', subject: '🚀 Our biggest launch ever!', status: 'sent', sent: 12500, opened: 4375, clicked: 1250, bounced: 125, openRate: 35, clickRate: 10, date: '2024-01-15 10:00', list: 'All Subscribers' },
  { id: 2, name: 'Weekly Newsletter #42', subject: 'This week in marketing...', status: 'sent', sent: 8900, opened: 2670, clicked: 445, bounced: 89, openRate: 30, clickRate: 5, date: '2024-01-14 09:00', list: 'Newsletter' },
  { id: 3, name: 'Black Friday Early Access', subject: '🏷️ Early access: 50% off everything', status: 'sent', sent: 15000, opened: 7500, clicked: 3750, bounced: 150, openRate: 50, clickRate: 25, date: '2024-01-10 08:00', list: 'VIP Customers' },
  { id: 4, name: 'Course Reminder', subject: 'Don\'t forget to complete your course!', status: 'scheduled', sent: 0, opened: 0, clicked: 0, bounced: 0, openRate: 0, clickRate: 0, date: '2024-01-20 10:00', list: 'Students' },
  { id: 5, name: 'Re-engagement Campaign', subject: 'We miss you! Here\'s 20% off', status: 'draft', sent: 0, opened: 0, clicked: 0, bounced: 0, openRate: 0, clickRate: 0, date: null, list: 'Inactive Users' },
]

const automations = [
  { id: 1, name: 'Welcome Sequence', trigger: 'New subscriber', emails: 5, active: true, enrolled: 8500, completed: 6200, conversion: 12.5 },
  { id: 2, name: 'Abandoned Cart', trigger: 'Cart abandoned', emails: 3, active: true, enrolled: 2100, completed: 1800, conversion: 28.5 },
  { id: 3, name: 'Post-Purchase Upsell', trigger: 'Purchase completed', emails: 4, active: true, enrolled: 3200, completed: 2800, conversion: 15.2 },
  { id: 4, name: 'Course Drip', trigger: 'Course enrolled', emails: 12, active: true, enrolled: 1240, completed: 450, conversion: 0 },
  { id: 5, name: 'Win-back Campaign', trigger: 'Inactive 30 days', emails: 3, active: false, enrolled: 0, completed: 0, conversion: 0 },
]

const lists = [
  { name: 'All Subscribers', count: 25400, growth: '+245 this week' },
  { name: 'Newsletter', count: 18900, growth: '+120 this week' },
  { name: 'VIP Customers', count: 3200, growth: '+15 this week' },
  { name: 'Students', count: 4880, growth: '+85 this week' },
  { name: 'Inactive Users', count: 2100, growth: '-45 this week' },
]

const statusColors = { sent: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', draft: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400' }

export default function EmailMarketing() {
  const [tab, setTab] = useState('campaigns')
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)

  const totalSent = campaigns.reduce((s, c) => s + c.sent, 0)
  const avgOpenRate = campaigns.filter(c => c.sent > 0).reduce((s, c) => s + c.openRate, 0) / campaigns.filter(c => c.sent > 0).length
  const avgClickRate = campaigns.filter(c => c.sent > 0).reduce((s, c) => s + c.clickRate, 0) / campaigns.filter(c => c.sent > 0).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Email Marketing</h1>
          <p className="text-slate-500 dark:text-slate-400">Campaigns, automations, and subscriber management</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> New Campaign</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Subscribers', value: '25.4K', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Emails Sent', value: totalSent.toLocaleString(), icon: Send, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Avg Open Rate', value: `${avgOpenRate.toFixed(1)}%`, icon: Mail, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
          { label: 'Avg Click Rate', value: `${avgClickRate.toFixed(1)}%`, icon: MousePointer, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
        ].map((s, i) => (
          <div key={i} className="card p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
              <div><p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p><p className="text-lg font-bold text-slate-900 dark:text-white">{s.value}</p></div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
        {['campaigns', 'automations', 'lists', 'templates'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${tab === t ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{t}</button>
        ))}
      </div>

      {tab === 'campaigns' && (
        <div className="space-y-4">
          {campaigns.map(c => (
            <div key={c.id} className="card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${c.status === 'sent' ? 'bg-green-50 dark:bg-green-900/20' : c.status === 'scheduled' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-slate-100 dark:bg-slate-700'}`}>
                  {c.status === 'sent' ? <CheckCircle className="w-5 h-5 text-green-600" /> : c.status === 'scheduled' ? <Clock className="w-5 h-5 text-blue-600" /> : <FileText className="w-5 h-5 text-slate-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{c.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[c.status]}`}>{c.status}</span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Subject: {c.subject}</p>
                  {c.sent > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div><p className="text-xs text-slate-400">Sent</p><p className="font-semibold text-slate-900 dark:text-white">{c.sent.toLocaleString()}</p></div>
                      <div><p className="text-xs text-slate-400">Opened</p><p className="font-semibold text-slate-900 dark:text-white">{c.opened.toLocaleString()} <span className="text-xs text-green-600">({c.openRate}%)</span></p></div>
                      <div><p className="text-xs text-slate-400">Clicked</p><p className="font-semibold text-slate-900 dark:text-white">{c.clicked.toLocaleString()} <span className="text-xs text-primary-600">({c.clickRate}%)</span></p></div>
                      <div><p className="text-xs text-slate-400">Bounced</p><p className="font-semibold text-slate-900 dark:text-white">{c.bounced.toLocaleString()}</p></div>
                    </div>
                  )}
                  {c.date && <p className="text-xs text-slate-400 mt-2">{c.status === 'scheduled' ? 'Scheduled for' : 'Sent on'}: {c.date} • List: {c.list}</p>}
                </div>
                <div className="flex gap-1">
                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><BarChart3 className="w-4 h-4 text-slate-400" /></button>
                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Edit className="w-4 h-4 text-slate-400" /></button>
                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Copy className="w-4 h-4 text-slate-400" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'automations' && (
        <div className="space-y-4">
          {automations.map(a => (
            <div key={a.id} className="card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${a.active ? 'bg-green-50 dark:bg-green-900/20' : 'bg-slate-100 dark:bg-slate-700'}`}>
                  <Zap className={`w-5 h-5 ${a.active ? 'text-green-600' : 'text-slate-400'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{a.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${a.active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'}`}>{a.active ? 'Active' : 'Inactive'}</span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Trigger: {a.trigger} • {a.emails} emails in sequence</p>
                </div>
                <div className="hidden sm:grid grid-cols-3 gap-6 text-center">
                  <div><p className="text-xs text-slate-400">Enrolled</p><p className="font-semibold text-slate-900 dark:text-white">{a.enrolled.toLocaleString()}</p></div>
                  <div><p className="text-xs text-slate-400">Completed</p><p className="font-semibold text-slate-900 dark:text-white">{a.completed.toLocaleString()}</p></div>
                  <div><p className="text-xs text-slate-400">Conversion</p><p className="font-semibold text-green-600">{a.conversion}%</p></div>
                </div>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Edit className="w-4 h-4 text-slate-400" /></button>
              </div>
            </div>
          ))}
          <button className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Create Automation</button>
        </div>
      )}

      {tab === 'lists' && (
        <div className="space-y-4">
          {lists.map((l, i) => (
            <div key={i} className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center"><Users className="w-5 h-5 text-blue-600" /></div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-white">{l.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{l.count.toLocaleString()} subscribers • {l.growth}</p>
              </div>
              <div className="flex gap-1">
                <button className="btn-secondary text-sm">View</button>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Edit className="w-4 h-4 text-slate-400" /></button>
              </div>
            </div>
          ))}
          <button className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Create List</button>
        </div>
      )}

      {tab === 'templates' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Welcome Email', desc: 'New subscriber welcome', icon: '👋' },
            { name: 'Newsletter', desc: 'Weekly newsletter template', icon: '📰' },
            { name: 'Product Announcement', desc: 'New product launch', icon: '🚀' },
            { name: 'Sale / Promotion', desc: 'Discount and sale emails', icon: '🏷️' },
            { name: 'Course Update', desc: 'Course progress reminder', icon: '📚' },
            { name: 'Thank You', desc: 'Post-purchase thank you', icon: '🙏' },
          ].map((t, i) => (
            <div key={i} className="card p-5 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="text-3xl mb-3">{t.icon}</div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{t.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{t.desc}</p>
              <button className="text-sm text-primary-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">Use Template →</button>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">New Campaign</h2>
              <button onClick={() => setShowCreate(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Campaign Name</label><input type="text" className="input w-full" /></div>
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject Line</label><input type="text" className="input w-full" /></div>
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Send To</label><select className="input w-full">{lists.map(l => <option key={l.name}>{l.name} ({l.count.toLocaleString()})</option>)}</select></div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreate(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={() => setShowCreate(false)} className="btn-primary flex-1">Create Campaign</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
