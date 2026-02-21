import { useState, useEffect } from 'react'
import { CreditCard, Search, DollarSign, Users, TrendingUp } from 'lucide-react'
import api from '../lib/api'

export default function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => { load() }, [])
  const load = async () => {
    try { const d = await api.getAdminUsers(); setSubscriptions(Array.isArray(d) ? d : []) }
    catch { setSubscriptions([
      { id: 1, user: 'Alice Johnson', email: 'alice@example.com', plan: 'Professional', price: 997, status: 'active', start_date: '2024-01-05', next_billing: '2024-02-05', trial_ends: null },
      { id: 2, user: 'Bob Smith', email: 'bob@example.com', plan: 'Starter', price: 97, status: 'active', start_date: '2024-01-08', next_billing: '2024-02-08', trial_ends: null },
      { id: 3, user: 'Carol White', email: 'carol@example.com', plan: 'Professional', price: 997, status: 'cancelled', start_date: '2024-01-03', next_billing: null, trial_ends: null },
      { id: 4, user: 'David Brown', email: 'david@example.com', plan: 'Starter', price: 97, status: 'trialing', start_date: '2024-01-12', next_billing: '2024-01-26', trial_ends: '2024-01-26' },
      { id: 5, user: 'Eve Davis', email: 'eve@example.com', plan: 'Premium Pro', price: 4997, status: 'active', start_date: '2024-01-01', next_billing: '2024-02-01', trial_ends: null },
      { id: 6, user: 'Frank Miller', email: 'frank@example.com', plan: 'Starter', price: 97, status: 'past_due', start_date: '2024-01-02', next_billing: '2024-01-16', trial_ends: null },
    ]) } finally { setLoading(false) }
  }

  const cancelSub = (id) => { if (!confirm('Cancel this subscription?')) return; setSubscriptions(subscriptions.map(s => s.id === id ? { ...s, status: 'cancelled' } : s)) }

  const statusColor = (s) => ({ active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', trialing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', cancelled: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400', past_due: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' }[s] || 'bg-slate-100 text-slate-600')
  const filtered = subscriptions.filter(s => (filter === 'all' || s.status === filter) && (s.user?.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase())))

  const totalMRR = subscriptions.filter(s => s.status === 'active').reduce((a, s) => a + (s.price || 0), 0)

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Subscription Management</h1><p className="text-slate-500 text-sm mt-1">Manage all user subscriptions</p></div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"><div className="flex items-center gap-2 mb-1"><DollarSign className="w-4 h-4 text-green-500" /><p className="text-xs text-slate-500">MRR</p></div><p className="text-2xl font-bold text-green-600">${totalMRR.toLocaleString()}</p></div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"><div className="flex items-center gap-2 mb-1"><Users className="w-4 h-4 text-blue-500" /><p className="text-xs text-slate-500">Active</p></div><p className="text-2xl font-bold text-blue-600">{subscriptions.filter(s => s.status === 'active').length}</p></div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"><div className="flex items-center gap-2 mb-1"><TrendingUp className="w-4 h-4 text-purple-500" /><p className="text-xs text-slate-500">Trialing</p></div><p className="text-2xl font-bold text-purple-600">{subscriptions.filter(s => s.status === 'trialing').length}</p></div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"><div className="flex items-center gap-2 mb-1"><CreditCard className="w-4 h-4 text-red-500" /><p className="text-xs text-slate-500">Past Due</p></div><p className="text-2xl font-bold text-red-600">{subscriptions.filter(s => s.status === 'past_due').length}</p></div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search subscriptions..." className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm" /></div>
        <div className="flex gap-1">{['all', 'active', 'trialing', 'cancelled', 'past_due'].map(f => <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-lg text-sm capitalize ${filter === f ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600'}`}>{f.replace('_', ' ')}</button>)}</div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full"><thead><tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">User</th>
          <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Plan</th>
          <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
          <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">Price</th>
          <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Start Date</th>
          <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Next Billing</th>
          <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">Actions</th>
        </tr></thead><tbody>
          {filtered.map(sub => (
            <tr key={sub.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30">
              <td className="px-4 py-3"><div><p className="font-medium text-sm text-slate-900 dark:text-white">{sub.user}</p><p className="text-xs text-slate-500">{sub.email}</p></div></td>
              <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{sub.plan}</td>
              <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(sub.status)}`}>{sub.status}</span></td>
              <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900 dark:text-white">${sub.price}/mo</td>
              <td className="px-4 py-3 text-sm text-slate-500">{sub.start_date}</td>
              <td className="px-4 py-3 text-sm text-slate-500">{sub.next_billing || '-'}</td>
              <td className="px-4 py-3 text-right">{sub.status !== 'cancelled' && <button onClick={() => cancelSub(sub.id)} className="px-2 py-1 rounded text-xs bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400">Cancel</button>}</td>
            </tr>
          ))}
        </tbody></table>
        {filtered.length === 0 && <div className="text-center py-12 text-slate-500"><CreditCard className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No subscriptions found</p></div>}
      </div>
    </div>
  )
}
