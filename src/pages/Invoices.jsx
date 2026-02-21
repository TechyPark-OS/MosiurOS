import { useState, useEffect } from 'react'
import { FileText, Search, Download, Plus, X, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import api from '../lib/api'

export default function Invoices() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ customer: '', amount: '', due_date: '', description: '' })

  useEffect(() => { load() }, [])
  const load = async () => {
    try { const d = await api.getInvoices(); setInvoices(Array.isArray(d) ? d : d.invoices || []) }
    catch { setInvoices([
      { id: 'INV-001', customer: 'Alice Johnson', email: 'alice@example.com', amount: 997, status: 'paid', date: '2024-01-15', due_date: '2024-02-15' },
      { id: 'INV-002', customer: 'Bob Smith', email: 'bob@example.com', amount: 97, status: 'paid', date: '2024-01-14', due_date: '2024-02-14' },
      { id: 'INV-003', customer: 'Carol White', email: 'carol@example.com', amount: 4997, status: 'pending', date: '2024-01-13', due_date: '2024-02-13' },
      { id: 'INV-004', customer: 'David Brown', email: 'david@example.com', amount: 97, status: 'overdue', date: '2024-01-01', due_date: '2024-01-31' },
      { id: 'INV-005', customer: 'Eve Davis', email: 'eve@example.com', amount: 997, status: 'paid', date: '2024-01-10', due_date: '2024-02-10' },
    ]) } finally { setLoading(false) }
  }

  const create = () => { setInvoices([{ id: `INV-${String(invoices.length + 1).padStart(3, '0')}`, ...form, amount: parseFloat(form.amount) || 0, status: 'pending', date: new Date().toISOString().split('T')[0] }, ...invoices]); setShowCreate(false); setForm({ customer: '', amount: '', due_date: '', description: '' }) }
  const markPaid = (id) => setInvoices(invoices.map(i => i.id === id ? { ...i, status: 'paid' } : i))

  const statusIcon = (s) => ({ paid: <CheckCircle className="w-4 h-4 text-green-500" />, pending: <Clock className="w-4 h-4 text-yellow-500" />, overdue: <AlertCircle className="w-4 h-4 text-red-500" /> }[s])
  const statusColor = (s) => ({ paid: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', overdue: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' }[s] || 'bg-slate-100 text-slate-600')
  const filtered = invoices.filter(i => i.customer?.toLowerCase().includes(search.toLowerCase()) || i.id?.toLowerCase().includes(search.toLowerCase()))

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Invoices</h1><p className="text-slate-500 text-sm mt-1">{invoices.length} invoices</p></div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 text-sm"><Download className="w-4 h-4" /> Export</button>
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"><Plus className="w-4 h-4" /> New Invoice</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"><p className="text-xs text-slate-500 mb-1">Total Paid</p><p className="text-2xl font-bold text-green-600">${invoices.filter(i => i.status === 'paid').reduce((a, i) => a + (i.amount || 0), 0).toLocaleString()}</p></div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"><p className="text-xs text-slate-500 mb-1">Pending</p><p className="text-2xl font-bold text-yellow-600">${invoices.filter(i => i.status === 'pending').reduce((a, i) => a + (i.amount || 0), 0).toLocaleString()}</p></div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"><p className="text-xs text-slate-500 mb-1">Overdue</p><p className="text-2xl font-bold text-red-600">${invoices.filter(i => i.status === 'overdue').reduce((a, i) => a + (i.amount || 0), 0).toLocaleString()}</p></div>
      </div>

      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search invoices..." className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm" /></div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full"><thead><tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Invoice</th>
          <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Customer</th>
          <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
          <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">Amount</th>
          <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Date</th>
          <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Due Date</th>
          <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">Actions</th>
        </tr></thead><tbody>
          {filtered.map(inv => (
            <tr key={inv.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30">
              <td className="px-4 py-3 font-medium text-sm text-slate-900 dark:text-white">{inv.id}</td>
              <td className="px-4 py-3"><div><p className="text-sm text-slate-900 dark:text-white">{inv.customer}</p><p className="text-xs text-slate-500">{inv.email}</p></div></td>
              <td className="px-4 py-3"><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(inv.status)}`}>{statusIcon(inv.status)}{inv.status}</span></td>
              <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900 dark:text-white">${inv.amount?.toLocaleString()}</td>
              <td className="px-4 py-3 text-sm text-slate-500">{inv.date}</td>
              <td className="px-4 py-3 text-sm text-slate-500">{inv.due_date}</td>
              <td className="px-4 py-3 text-right"><div className="flex items-center justify-end gap-1">
                {inv.status !== 'paid' && <button onClick={() => markPaid(inv.id)} className="px-2 py-1 rounded text-xs bg-green-50 text-green-600 hover:bg-green-100">Mark Paid</button>}
                <button className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700"><Download className="w-4 h-4 text-slate-500" /></button>
              </div></td>
            </tr>
          ))}
        </tbody></table>
        {filtered.length === 0 && <div className="text-center py-12 text-slate-500"><FileText className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No invoices found</p></div>}
      </div>

      {showCreate && <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"><div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold">New Invoice</h3><button onClick={() => setShowCreate(false)}><X className="w-5 h-5" /></button></div>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Customer</label><input value={form.customer} onChange={e => setForm({...form, customer: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Amount ($)</label><input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Due Date</label><input type="date" value={form.due_date} onChange={e => setForm({...form, due_date: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
          <button onClick={create} className="w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm">Create Invoice</button>
        </div>
      </div></div>}
    </div>
  )
}
