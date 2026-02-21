import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Ticket, Plus, Search, X } from 'lucide-react'
import api from '../lib/api'

export default function Tickets() {
  const navigate = useNavigate()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ subject: '', description: '', priority: 'medium', requester: '' })

  useEffect(() => { load() }, [])
  const load = async () => {
    try { const d = await api.getTickets(); setTickets(Array.isArray(d) ? d : d.tickets || []) }
    catch { setTickets([
      { id: 1001, subject: 'Cannot access dashboard', requester: 'alice@example.com', status: 'open', priority: 'high', created: '2024-01-15 10:30', assignee: 'Support Team' },
      { id: 1002, subject: 'Billing question', requester: 'bob@example.com', status: 'pending', priority: 'medium', created: '2024-01-15 09:15', assignee: 'Billing' },
      { id: 1003, subject: 'Feature request: Export CSV', requester: 'carol@example.com', status: 'open', priority: 'low', created: '2024-01-14 16:45', assignee: 'Product' },
      { id: 1004, subject: 'Server downtime issue', requester: 'david@example.com', status: 'resolved', priority: 'critical', created: '2024-01-14 08:00', assignee: 'DevOps' },
      { id: 1005, subject: 'Password reset not working', requester: 'eve@example.com', status: 'closed', priority: 'high', created: '2024-01-13 14:20', assignee: 'Support Team' },
    ]) } finally { setLoading(false) }
  }

  const create = async () => {
    try { await api.createTicket(form) } catch {}
    setTickets([{ id: Date.now(), ...form, status: 'open', created: new Date().toISOString().slice(0, 16).replace('T', ' '), assignee: 'Unassigned' }, ...tickets])
    setShowCreate(false); setForm({ subject: '', description: '', priority: 'medium', requester: '' })
  }

  const statusColor = (s) => ({ open: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', resolved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', closed: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400' }[s] || 'bg-slate-100 text-slate-600')
  const priorityColor = (p) => ({ critical: 'text-red-600', high: 'text-orange-600', medium: 'text-yellow-600', low: 'text-slate-500' }[p] || 'text-slate-500')

  const filtered = tickets.filter(t => (filter === 'all' || t.status === filter) && (t.subject?.toLowerCase().includes(search.toLowerCase()) || t.requester?.toLowerCase().includes(search.toLowerCase())))

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Support Tickets</h1><p className="text-slate-500 text-sm mt-1">{tickets.filter(t => t.status === 'open').length} open tickets</p></div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"><Plus className="w-4 h-4" /> New Ticket</button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tickets..." className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm" /></div>
        <div className="flex gap-1">{['all', 'open', 'pending', 'resolved', 'closed'].map(f => <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-lg text-sm capitalize ${filter === f ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600'}`}>{f}</button>)}</div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full"><thead><tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Ticket</th>
          <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Requester</th>
          <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
          <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Priority</th>
          <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Assignee</th>
          <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Created</th>
        </tr></thead><tbody>
          {filtered.map(ticket => (
            <tr key={ticket.id} onClick={() => navigate(`/dashboard/tickets/${ticket.id}`)} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer">
              <td className="px-4 py-3"><div><p className="font-medium text-slate-900 dark:text-white text-sm">#{ticket.id}</p><p className="text-xs text-slate-500">{ticket.subject}</p></div></td>
              <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{ticket.requester}</td>
              <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(ticket.status)}`}>{ticket.status}</span></td>
              <td className="px-4 py-3"><span className={`text-sm font-medium capitalize ${priorityColor(ticket.priority)}`}>{ticket.priority}</span></td>
              <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{ticket.assignee}</td>
              <td className="px-4 py-3 text-sm text-slate-500">{ticket.created}</td>
            </tr>
          ))}
        </tbody></table>
        {filtered.length === 0 && <div className="text-center py-12 text-slate-500"><Ticket className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No tickets found</p></div>}
      </div>

      {showCreate && <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"><div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold">New Ticket</h3><button onClick={() => setShowCreate(false)}><X className="w-5 h-5" /></button></div>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Subject</label><input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Requester Email</label><input value={form.requester} onChange={e => setForm({...form, requester: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Priority</label><select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option></select></div>
          <button onClick={create} className="w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm">Create Ticket</button>
        </div>
      </div></div>}
    </div>
  )
}
