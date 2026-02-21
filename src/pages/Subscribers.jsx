import { useState, useEffect } from 'react'
import { Users, Plus, Search, Trash2, Tag, Upload, Download, X, Mail } from 'lucide-react'
import api from '../lib/api'

export default function Subscribers() {
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', tags: '' })
  const [selected, setSelected] = useState([])

  useEffect(() => { load() }, [])
  const load = async () => {
    try { const d = await api.getSubscribers(); setSubscribers(Array.isArray(d) ? d : d.subscribers || []) }
    catch { setSubscribers([
      { id: 1, name: 'Alice Johnson', email: 'alice@example.com', status: 'active', tags: ['newsletter', 'customer'], subscribed: '2024-01-10' },
      { id: 2, name: 'Bob Smith', email: 'bob@example.com', status: 'active', tags: ['newsletter'], subscribed: '2024-01-08' },
      { id: 3, name: 'Carol White', email: 'carol@example.com', status: 'unsubscribed', tags: ['lead'], subscribed: '2024-01-05' },
      { id: 4, name: 'David Brown', email: 'david@example.com', status: 'active', tags: ['customer', 'vip'], subscribed: '2024-01-12' },
      { id: 5, name: 'Eve Davis', email: 'eve@example.com', status: 'bounced', tags: ['newsletter'], subscribed: '2024-01-01' },
    ]) } finally { setLoading(false) }
  }

  const add = async () => { try { await api.createSubscriber({...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)}) } catch {} setSubscribers([...subscribers, { id: Date.now(), ...form, status: 'active', tags: form.tags.split(',').map(t => t.trim()).filter(Boolean), subscribed: new Date().toISOString().split('T')[0] }]); setShowAdd(false); setForm({ name: '', email: '', tags: '' }) }
  const remove = async (id) => { if (!confirm('Remove subscriber?')) return; try { await api.deleteSubscriber(id) } catch {} setSubscribers(subscribers.filter(s => s.id !== id)) }
  const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  const selectAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map(s => s.id))

  const statusColor = (s) => ({ active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', unsubscribed: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400', bounced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' }[s] || 'bg-slate-100 text-slate-600')
  const filtered = subscribers.filter(s => s.name?.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase()))

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Subscribers</h1><p className="text-slate-500 text-sm mt-1">{subscribers.filter(s => s.status === 'active').length} active of {subscribers.length} total</p></div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 text-sm"><Upload className="w-4 h-4" /> Import</button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 text-sm"><Download className="w-4 h-4" /> Export</button>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"><Plus className="w-4 h-4" /> Add Subscriber</button>
        </div>
      </div>

      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search subscribers..." className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm" /></div>

      {selected.length > 0 && <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"><span className="text-sm text-blue-700 dark:text-blue-300">{selected.length} selected</span><button className="text-sm text-blue-600 hover:underline">Tag Selected</button><button onClick={() => { selected.forEach(id => remove(id)); setSelected([]) }} className="text-sm text-red-600 hover:underline">Delete Selected</button></div>}

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full"><thead><tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <th className="text-left px-4 py-3 w-8"><input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={selectAll} className="rounded" /></th>
          <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Subscriber</th>
          <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
          <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Tags</th>
          <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Subscribed</th>
          <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">Actions</th>
        </tr></thead><tbody>
          {filtered.map(sub => (
            <tr key={sub.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30">
              <td className="px-4 py-3"><input type="checkbox" checked={selected.includes(sub.id)} onChange={() => toggleSelect(sub.id)} className="rounded" /></td>
              <td className="px-4 py-3"><div className="flex items-center gap-3"><Mail className="w-5 h-5 text-blue-500" /><div><p className="font-medium text-slate-900 dark:text-white text-sm">{sub.name}</p><p className="text-xs text-slate-500">{sub.email}</p></div></div></td>
              <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(sub.status)}`}>{sub.status}</span></td>
              <td className="px-4 py-3"><div className="flex gap-1 flex-wrap">{(sub.tags || []).map((t, i) => <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">{t}</span>)}</div></td>
              <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{sub.subscribed}</td>
              <td className="px-4 py-3 text-right"><button onClick={() => remove(sub.id)} className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="w-4 h-4 text-red-500" /></button></td>
            </tr>
          ))}
        </tbody></table>
        {filtered.length === 0 && <div className="text-center py-12 text-slate-500"><Users className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No subscribers found</p></div>}
      </div>

      {showAdd && <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"><div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-slate-900 dark:text-white">Add Subscriber</h3><button onClick={() => setShowAdd(false)}><X className="w-5 h-5" /></button></div>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Name</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Email</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Tags (comma-separated)</label><input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} placeholder="newsletter, customer" className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
          <button onClick={add} className="w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm">Add Subscriber</button>
        </div>
      </div></div>}
    </div>
  )
}
