import { useState } from 'react'
import { Plus, Search, Users, HelpCircle, BookOpen, MessageCircle, CheckCircle, Clock, AlertCircle, Star, ThumbsUp, Eye, Edit, Tag, BarChart3 } from 'lucide-react'

const tickets = [
  { id: 'TKT-001', subject: 'Cannot access my course content', customer: 'Alice Johnson', priority: 'high', status: 'open', category: 'Access', created: '2 hours ago', replies: 3 },
  { id: 'TKT-002', subject: 'Billing question about Pro upgrade', customer: 'Bob Smith', priority: 'medium', status: 'in-progress', category: 'Billing', created: '4 hours ago', replies: 5 },
  { id: 'TKT-003', subject: 'Funnel page not loading on mobile', customer: 'Carol White', priority: 'high', status: 'open', category: 'Technical', created: '6 hours ago', replies: 1 },
  { id: 'TKT-004', subject: 'How to set up email automation?', customer: 'David Brown', priority: 'low', status: 'resolved', category: 'How-to', created: '1 day ago', replies: 4 },
  { id: 'TKT-005', subject: 'Request for custom domain setup', customer: 'Eva Green', priority: 'medium', status: 'in-progress', category: 'Technical', created: '1 day ago', replies: 2 },
  { id: 'TKT-006', subject: 'Refund request for template pack', customer: 'Frank Lee', priority: 'medium', status: 'resolved', category: 'Billing', created: '2 days ago', replies: 6 },
]

const kbArticles = [
  { title: 'Getting Started with Funnels', category: 'Funnels', views: 12500, helpful: 95, updated: '3 days ago' },
  { title: 'Email Marketing Best Practices', category: 'Email', views: 8900, helpful: 92, updated: '1 week ago' },
  { title: 'Setting Up Payment Gateways', category: 'Payments', views: 6700, helpful: 88, updated: '2 weeks ago' },
  { title: 'Custom Domain Configuration', category: 'Domains', views: 5400, helpful: 90, updated: '1 week ago' },
  { title: 'A/B Testing Your Pages', category: 'Optimization', views: 4200, helpful: 94, updated: '5 days ago' },
  { title: 'Membership Site Setup Guide', category: 'Memberships', views: 3800, helpful: 91, updated: '3 days ago' },
]

const priorityColors = { high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' }
const statusColors = { open: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', 'in-progress': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', resolved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' }

export default function CustomerCenter() {
  const [tab, setTab] = useState('tickets')
  const [search, setSearch] = useState('')

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Customer Center</h1>
          <p className="text-slate-500 dark:text-slate-400">Support tickets, knowledge base, and customer portal</p>
        </div>
        <button className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> New Ticket</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Open Tickets', value: tickets.filter(t => t.status === 'open').length, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
          { label: 'In Progress', value: tickets.filter(t => t.status === 'in-progress').length, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
          { label: 'Resolved', value: tickets.filter(t => t.status === 'resolved').length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Avg Response', value: '2.4h', icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
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
        {['tickets', 'knowledge base', 'satisfaction', 'portal settings'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${tab === t ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{t}</button>
        ))}
      </div>

      {tab === 'tickets' && (
        <>
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" placeholder="Search tickets..." value={search} onChange={e => setSearch(e.target.value)} className="input pl-10 w-full" /></div>
          <div className="space-y-3">
            {tickets.map(t => (
              <div key={t.id} className="card p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-primary-600">{t.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[t.priority]}`}>{t.priority}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[t.status]}`}>{t.status}</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{t.subject}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{t.customer}</span><span>•</span><span>{t.category}</span><span>•</span><span>{t.created}</span><span>•</span>
                      <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {t.replies} replies</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'knowledge base' && (
        <div className="space-y-3">
          {kbArticles.map((a, i) => (
            <div key={i} className="card p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center"><BookOpen className="w-5 h-5 text-primary-600" /></div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{a.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded">{a.category}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {a.views.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {a.helpful}% helpful</span>
                    <span>Updated {a.updated}</span>
                  </div>
                </div>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Edit className="w-4 h-4 text-slate-400" /></button>
              </div>
            </div>
          ))}
          <button className="card p-4 w-full border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-primary-500 transition-colors text-center">
            <Plus className="w-6 h-6 text-slate-400 mx-auto mb-1" /><p className="text-sm text-slate-500">Add Article</p>
          </button>
        </div>
      )}

      {tab === 'satisfaction' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-5">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Customer Satisfaction Score</h3>
            <div className="text-center py-6">
              <p className="text-5xl font-bold text-green-600 mb-2">4.7</p>
              <div className="flex justify-center gap-1 mb-2">{[1,2,3,4,5].map(s => <Star key={s} className={`w-5 h-5 ${s <= 4 ? 'text-yellow-500 fill-yellow-500' : 'text-yellow-500 fill-yellow-200'}`} />)}</div>
              <p className="text-sm text-slate-500">Based on 1,245 ratings</p>
            </div>
          </div>
          <div className="card p-5">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Response Time Distribution</h3>
            <div className="space-y-3">
              {[
                { range: '< 1 hour', pct: 45, color: 'bg-green-500' },
                { range: '1-4 hours', pct: 30, color: 'bg-blue-500' },
                { range: '4-12 hours', pct: 15, color: 'bg-yellow-500' },
                { range: '12-24 hours', pct: 8, color: 'bg-orange-500' },
                { range: '> 24 hours', pct: 2, color: 'bg-red-500' },
              ].map(r => (
                <div key={r.range} className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 dark:text-slate-400 w-24">{r.range}</span>
                  <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full"><div className={`h-full ${r.color} rounded-full`} style={{ width: `${r.pct}%` }} /></div>
                  <span className="text-sm font-medium text-slate-900 dark:text-white w-10 text-right">{r.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'portal settings' && (
        <div className="card p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Customer Portal Settings</h3>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Portal URL</label><input type="text" className="input w-full" defaultValue="https://support.techypark.com" /></div>
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Welcome Message</label><textarea className="input w-full" rows={3} defaultValue="Welcome to TechyPark Support! How can we help you today?" /></div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <div><p className="font-medium text-slate-900 dark:text-white text-sm">Allow ticket creation</p><p className="text-xs text-slate-400">Let customers create support tickets</p></div>
                <div className="w-10 h-6 bg-green-500 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" /></div>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <div><p className="font-medium text-slate-900 dark:text-white text-sm">Show knowledge base</p><p className="text-xs text-slate-400">Display KB articles in the portal</p></div>
                <div className="w-10 h-6 bg-green-500 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" /></div>
              </div>
            </div>
          </div>
          <button className="btn-primary">Save Settings</button>
        </div>
      )}
    </div>
  )
}
