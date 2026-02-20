import { useState } from 'react'
import { Plus, Search, Users, Crown, Lock, Unlock, DollarSign, TrendingUp, Eye, Edit, Trash2, Star, Shield, Clock, CheckCircle, BarChart3 } from 'lucide-react'

const membershipLevels = [
  { id: 1, name: 'Free', price: '$0/mo', members: 2450, color: 'bg-slate-500', access: 'Basic content only', active: true },
  { id: 2, name: 'Starter', price: '$29/mo', members: 890, color: 'bg-blue-500', access: 'Courses + Community', active: true },
  { id: 3, name: 'Pro', price: '$79/mo', members: 420, color: 'bg-purple-500', access: 'All courses + Live coaching', active: true },
  { id: 4, name: 'VIP', price: '$199/mo', members: 85, color: 'bg-yellow-500', access: 'Everything + 1-on-1 mentoring', active: true },
]

const members = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', level: 'Pro', joined: '2023-06-15', lastActive: '2 hours ago', progress: 78, status: 'active' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', level: 'VIP', joined: '2023-04-20', lastActive: '1 hour ago', progress: 92, status: 'active' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', level: 'Starter', joined: '2023-09-01', lastActive: '3 days ago', progress: 45, status: 'active' },
  { id: 4, name: 'David Brown', email: 'david@example.com', level: 'Pro', joined: '2023-08-10', lastActive: '1 week ago', progress: 62, status: 'active' },
  { id: 5, name: 'Eva Green', email: 'eva@example.com', level: 'Free', joined: '2024-01-05', lastActive: '5 days ago', progress: 15, status: 'active' },
  { id: 6, name: 'Frank Lee', email: 'frank@example.com', level: 'Starter', joined: '2023-11-20', lastActive: '2 weeks ago', progress: 30, status: 'churned' },
]

const contentAreas = [
  { name: 'Getting Started', lessons: 8, access: 'Free', completions: 1890 },
  { name: 'Marketing Fundamentals', lessons: 12, access: 'Starter', completions: 720 },
  { name: 'Advanced Funnels', lessons: 15, access: 'Pro', completions: 380 },
  { name: 'Email Mastery', lessons: 10, access: 'Pro', completions: 290 },
  { name: 'Scaling Strategies', lessons: 8, access: 'VIP', completions: 75 },
  { name: 'Live Coaching Replays', lessons: 24, access: 'VIP', completions: 60 },
]

const levelColors = { Free: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400', Starter: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', Pro: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', VIP: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' }

export default function Memberships() {
  const [tab, setTab] = useState('levels')
  const totalMembers = membershipLevels.reduce((s, l) => s + l.members, 0)
  const mrr = (890 * 29) + (420 * 79) + (85 * 199)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Memberships</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage membership levels, content access, and members</p>
        </div>
        <button className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> New Level</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Members', value: totalMembers.toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Monthly Revenue', value: `$${(mrr/1000).toFixed(1)}K`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Avg. Progress', value: '54%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
          { label: 'Churn Rate', value: '3.2%', icon: BarChart3, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
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
        {['levels', 'members', 'content', 'drip'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${tab === t ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{t === 'drip' ? 'Drip Schedule' : t}</button>
        ))}
      </div>

      {tab === 'levels' && (
        <div className="grid sm:grid-cols-2 gap-4">
          {membershipLevels.map(l => (
            <div key={l.id} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl ${l.color} flex items-center justify-center`}><Crown className="w-5 h-5 text-white" /></div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{l.name}</h3>
                  <p className="text-lg font-bold text-primary-600">{l.price}</p>
                </div>
                <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><Edit className="w-4 h-4 text-slate-400" /></button>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{l.access}</p>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                <span className="text-sm text-slate-500"><Users className="w-4 h-4 inline mr-1" />{l.members.toLocaleString()} members</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${l.active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-500'}`}>{l.active ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'members' && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Member</th>
              <th className="text-center py-3 px-4 text-xs font-medium text-slate-500 uppercase">Level</th>
              <th className="text-center py-3 px-4 text-xs font-medium text-slate-500 uppercase">Progress</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Last Active</th>
              <th className="text-center py-3 px-4 text-xs font-medium text-slate-500 uppercase">Status</th>
            </tr></thead>
            <tbody>
              {members.map(m => (
                <tr key={m.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4">
                    <p className="font-medium text-slate-900 dark:text-white">{m.name}</p>
                    <p className="text-xs text-slate-400">{m.email}</p>
                  </td>
                  <td className="py-3 px-4 text-center"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${levelColors[m.level]}`}>{m.level}</span></td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full"><div className="h-full bg-primary-500 rounded-full" style={{ width: `${m.progress}%` }} /></div>
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400 w-8">{m.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-500">{m.lastActive}</td>
                  <td className="py-3 px-4 text-center"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${m.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>{m.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'content' && (
        <div className="space-y-3">
          {contentAreas.map((c, i) => (
            <div key={i} className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-lg font-bold text-primary-600">{i + 1}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-white">{c.name}</h3>
                <p className="text-sm text-slate-500">{c.lessons} lessons • {c.completions} completions</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${levelColors[c.access]}`}>{c.access}</span>
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Edit className="w-4 h-4 text-slate-400" /></button>
            </div>
          ))}
        </div>
      )}

      {tab === 'drip' && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Content Drip Schedule</h3>
          <p className="text-sm text-slate-500 mb-6">Control when members get access to content based on their join date.</p>
          <div className="space-y-3">
            {[
              { content: 'Getting Started', delay: 'Immediately', icon: '🟢' },
              { content: 'Marketing Fundamentals', delay: 'After 7 days', icon: '📅' },
              { content: 'Advanced Funnels', delay: 'After 14 days', icon: '📅' },
              { content: 'Email Mastery', delay: 'After 21 days', icon: '📅' },
              { content: 'Scaling Strategies', delay: 'After 30 days', icon: '📅' },
              { content: 'Live Coaching Replays', delay: 'After 45 days', icon: '📅' },
            ].map((d, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <span className="text-lg">{d.icon}</span>
                <span className="flex-1 text-sm font-medium text-slate-900 dark:text-white">{d.content}</span>
                <span className="text-sm text-slate-500">{d.delay}</span>
                <button className="text-sm text-primary-600 font-medium">Edit</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
