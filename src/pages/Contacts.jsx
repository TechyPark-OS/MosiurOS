import { useState } from 'react'
import { Plus, Search, Users, UserPlus, Tag, Filter, Mail, Phone, Star, Edit, Trash2, Download, Upload, BarChart3, TrendingUp, CheckCircle } from 'lucide-react'

const contacts = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', phone: '+1 555-0101', tags: ['customer', 'vip'], lists: ['Pro Members'], score: 95, lastActive: '2 hours ago', status: 'active', source: 'Funnel' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', phone: '+1 555-0102', tags: ['customer', 'coaching'], lists: ['VIP Members'], score: 88, lastActive: '1 hour ago', status: 'active', source: 'Webinar' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', phone: '+1 555-0103', tags: ['lead'], lists: ['Newsletter'], score: 62, lastActive: '3 days ago', status: 'active', source: 'Opt-in' },
  { id: 4, name: 'David Brown', email: 'david@example.com', phone: '+1 555-0104', tags: ['customer'], lists: ['Pro Members'], score: 75, lastActive: '1 week ago', status: 'active', source: 'Referral' },
  { id: 5, name: 'Eva Green', email: 'eva@example.com', phone: '+1 555-0105', tags: ['lead', 'webinar'], lists: ['Newsletter', 'Webinar Attendees'], score: 45, lastActive: '5 days ago', status: 'active', source: 'Ad' },
  { id: 6, name: 'Frank Lee', email: 'frank@example.com', phone: '+1 555-0106', tags: ['churned'], lists: ['Former Members'], score: 20, lastActive: '2 weeks ago', status: 'unsubscribed', source: 'Organic' },
  { id: 7, name: 'Grace Kim', email: 'grace@example.com', phone: '+1 555-0107', tags: ['lead', 'hot'], lists: ['Newsletter'], score: 82, lastActive: '1 day ago', status: 'active', source: 'Funnel' },
  { id: 8, name: 'Henry Park', email: 'henry@example.com', phone: '+1 555-0108', tags: ['customer'], lists: ['Starter Members'], score: 55, lastActive: '4 days ago', status: 'active', source: 'Social' },
]

const segments = [
  { name: 'Active Customers', count: 1395, criteria: 'Has purchased + active in last 30 days', color: 'bg-green-500' },
  { name: 'Hot Leads', count: 450, criteria: 'Score > 70 + no purchase', color: 'bg-orange-500' },
  { name: 'At Risk', count: 120, criteria: 'Customer + inactive 30+ days', color: 'bg-red-500' },
  { name: 'Newsletter Only', count: 3200, criteria: 'Subscribed + no purchase', color: 'bg-blue-500' },
  { name: 'VIP Customers', count: 85, criteria: 'VIP tag + score > 85', color: 'bg-purple-500' },
]

const tagColors = { customer: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', lead: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', vip: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', coaching: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', webinar: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400', hot: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', churned: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400' }

export default function Contacts() {
  const [tab, setTab] = useState('contacts')
  const [search, setSearch] = useState('')

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Contacts</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage contacts, segments, and lead scoring</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center gap-2"><Upload className="w-4 h-4" /> Import</button>
          <button className="btn-primary flex items-center gap-2"><UserPlus className="w-4 h-4" /> Add Contact</button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Contacts', value: '5,250', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Active', value: '4,890', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'New This Month', value: '342', icon: UserPlus, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
          { label: 'Avg Score', value: '64', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
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
        {['contacts', 'segments', 'lists', 'tags'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${tab === t ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{t}</button>
        ))}
      </div>

      {tab === 'contacts' && (
        <>
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" placeholder="Search contacts..." value={search} onChange={e => setSearch(e.target.value)} className="input pl-10 w-full" /></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Contact</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Tags</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-slate-500 uppercase">Score</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Source</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Last Active</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr></thead>
              <tbody>
                {contacts.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.includes(search.toLowerCase())).map(c => (
                  <tr key={c.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-bold text-primary-600">{c.name.split(' ').map(n => n[0]).join('')}</div>
                        <div><p className="font-medium text-slate-900 dark:text-white text-sm">{c.name}</p><p className="text-xs text-slate-400">{c.email}</p></div>
                      </div>
                    </td>
                    <td className="py-3 px-4"><div className="flex gap-1 flex-wrap">{c.tags.map(t => <span key={t} className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${tagColors[t] || 'bg-slate-100 text-slate-500'}`}>{t}</span>)}</div></td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1">
                        <div className="w-8 h-2 bg-slate-200 dark:bg-slate-700 rounded-full"><div className={`h-full rounded-full ${c.score >= 80 ? 'bg-green-500' : c.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${c.score}%` }} /></div>
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{c.score}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-500">{c.source}</td>
                    <td className="py-3 px-4 text-sm text-slate-500">{c.lastActive}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-1">
                        <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><Mail className="w-3.5 h-3.5 text-slate-400" /></button>
                        <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><Edit className="w-3.5 h-3.5 text-slate-400" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'segments' && (
        <div className="space-y-3">
          {segments.map((s, i) => (
            <div key={i} className="card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-10 rounded-full ${s.color}`} />
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{s.name}</h3>
                  <p className="text-sm text-slate-500">{s.criteria}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{s.count.toLocaleString()}</p>
                  <p className="text-xs text-slate-400">contacts</p>
                </div>
              </div>
            </div>
          ))}
          <button className="card p-4 w-full border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-primary-500 transition-colors text-center">
            <Plus className="w-6 h-6 text-slate-400 mx-auto mb-1" /><p className="text-sm text-slate-500">Create Segment</p>
          </button>
        </div>
      )}

      {tab === 'lists' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Newsletter', count: 3200, growth: '+12%' },
            { name: 'Pro Members', count: 420, growth: '+8%' },
            { name: 'VIP Members', count: 85, growth: '+5%' },
            { name: 'Starter Members', count: 890, growth: '+15%' },
            { name: 'Webinar Attendees', count: 1250, growth: '+22%' },
            { name: 'Former Members', count: 180, growth: '-3%' },
          ].map((l, i) => (
            <div key={i} className="card p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{l.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">{l.count.toLocaleString()}</span>
                <span className={`text-sm font-medium ${l.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{l.growth}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'tags' && (
        <div className="flex flex-wrap gap-3">
          {Object.entries(tagColors).map(([tag, color]) => (
            <div key={tag} className={`px-4 py-2 rounded-xl ${color} flex items-center gap-2 cursor-pointer hover:opacity-80`}>
              <Tag className="w-3.5 h-3.5" />
              <span className="text-sm font-medium capitalize">{tag}</span>
              <span className="text-xs opacity-60">{Math.floor(Math.random() * 500 + 50)}</span>
            </div>
          ))}
          <button className="px-4 py-2 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-400 hover:border-primary-500 flex items-center gap-2">
            <Plus className="w-3.5 h-3.5" /><span className="text-sm">New Tag</span>
          </button>
        </div>
      )}
    </div>
  )
}
