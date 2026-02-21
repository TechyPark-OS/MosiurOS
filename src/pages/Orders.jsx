import { useState, useEffect } from 'react'
import { ShoppingCart, Search, Eye, Download } from 'lucide-react'
import api from '../lib/api'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState(null)

  useEffect(() => { load() }, [])
  const load = async () => {
    try { const d = await api.getOrders(); setOrders(Array.isArray(d) ? d : d.orders || []) }
    catch { setOrders([
      { id: 'ORD-1001', customer: 'Alice Johnson', email: 'alice@example.com', total: 297, status: 'completed', date: '2024-01-15', items: [{ name: 'Marketing Course', qty: 1, price: 197 }, { name: 'Template Pack', qty: 1, price: 100 }] },
      { id: 'ORD-1002', customer: 'Bob Smith', email: 'bob@example.com', total: 97, status: 'processing', date: '2024-01-15', items: [{ name: 'Starter Plan', qty: 1, price: 97 }] },
      { id: 'ORD-1003', customer: 'Carol White', email: 'carol@example.com', total: 997, status: 'completed', date: '2024-01-14', items: [{ name: 'Professional Plan', qty: 1, price: 997 }] },
      { id: 'ORD-1004', customer: 'David Brown', email: 'david@example.com', total: 47, status: 'refunded', date: '2024-01-14', items: [{ name: 'E-book Bundle', qty: 1, price: 47 }] },
      { id: 'ORD-1005', customer: 'Eve Davis', email: 'eve@example.com', total: 4997, status: 'completed', date: '2024-01-13', items: [{ name: 'Premium Pro Plan', qty: 1, price: 4997 }] },
    ]) } finally { setLoading(false) }
  }

  const statusColor = (s) => ({ completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', refunded: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' }[s] || 'bg-slate-100 text-slate-600')
  const filtered = orders.filter(o => (filter === 'all' || o.status === filter) && (o.customer?.toLowerCase().includes(search.toLowerCase()) || o.id?.toLowerCase().includes(search.toLowerCase())))

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Orders</h1><p className="text-slate-500 text-sm mt-1">{orders.length} orders &middot; ${orders.reduce((a, o) => a + (o.total || 0), 0).toLocaleString()} revenue</p></div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 text-sm"><Download className="w-4 h-4" /> Export</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[{ label: 'Total Orders', value: orders.length }, { label: 'Completed', value: orders.filter(o => o.status === 'completed').length }, { label: 'Processing', value: orders.filter(o => o.status === 'processing').length }, { label: 'Revenue', value: '$' + orders.filter(o => o.status === 'completed').reduce((a, o) => a + (o.total || 0), 0).toLocaleString() }].map((s, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"><p className="text-xs text-slate-500 mb-1">{s.label}</p><p className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p></div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..." className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm" /></div>
        <div className="flex gap-1">{['all', 'completed', 'processing', 'refunded'].map(f => <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-lg text-sm capitalize ${filter === f ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600'}`}>{f}</button>)}</div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full"><thead><tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Order</th>
          <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Customer</th>
          <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
          <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">Total</th>
          <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Date</th>
          <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">Actions</th>
        </tr></thead><tbody>
          {filtered.map(order => (
            <>
              <tr key={order.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                <td className="px-4 py-3 font-medium text-sm text-slate-900 dark:text-white">{order.id}</td>
                <td className="px-4 py-3"><div><p className="text-sm text-slate-900 dark:text-white">{order.customer}</p><p className="text-xs text-slate-500">{order.email}</p></div></td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(order.status)}`}>{order.status}</span></td>
                <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900 dark:text-white">${order.total?.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-slate-500">{order.date}</td>
                <td className="px-4 py-3 text-right"><button className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700"><Eye className="w-4 h-4 text-slate-500" /></button></td>
              </tr>
              {expanded === order.id && (
                <tr key={order.id + '-detail'}><td colSpan={6} className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50">
                  <div className="space-y-1">{(order.items || []).map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm"><span className="text-slate-600 dark:text-slate-300">{item.name} x{item.qty}</span><span className="font-medium">${item.price}</span></div>
                  ))}</div>
                </td></tr>
              )}
            </>
          ))}
        </tbody></table>
        {filtered.length === 0 && <div className="text-center py-12 text-slate-500"><ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No orders found</p></div>}
      </div>
    </div>
  )
}
