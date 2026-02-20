import { useState } from 'react'
import { DollarSign, CreditCard, TrendingUp, ArrowUpRight, ArrowDownRight, Users, ShoppingCart, RefreshCw, AlertTriangle, CheckCircle, Clock, XCircle, Search, Filter, Download, BarChart3 } from 'lucide-react'

const transactions = [
  { id: 'TXN-001', customer: 'Alice Johnson', email: 'alice@example.com', amount: 79, type: 'subscription', product: 'Pro Membership', status: 'completed', method: 'Visa •••• 4242', date: '2024-01-15 10:30 AM' },
  { id: 'TXN-002', customer: 'Bob Smith', email: 'bob@example.com', amount: 497, type: 'one-time', product: 'Marketing Masterclass', status: 'completed', method: 'Mastercard •••• 5555', date: '2024-01-15 09:15 AM' },
  { id: 'TXN-003', customer: 'Carol White', email: 'carol@example.com', amount: 29, type: 'subscription', product: 'Starter Plan', status: 'completed', method: 'PayPal', date: '2024-01-14 04:20 PM' },
  { id: 'TXN-004', customer: 'David Brown', email: 'david@example.com', amount: 199, type: 'subscription', product: 'VIP Membership', status: 'failed', method: 'Visa •••• 1234', date: '2024-01-14 02:45 PM' },
  { id: 'TXN-005', customer: 'Eva Green', email: 'eva@example.com', amount: 47, type: 'one-time', product: 'Funnel Template Pack', status: 'refunded', method: 'Stripe', date: '2024-01-13 11:00 AM' },
  { id: 'TXN-006', customer: 'Frank Lee', email: 'frank@example.com', amount: 79, type: 'subscription', product: 'Pro Membership', status: 'completed', method: 'Amex •••• 3782', date: '2024-01-13 08:30 AM' },
]

const subscriptions = [
  { plan: 'VIP Membership', price: '$199/mo', active: 85, mrr: 16915, churn: 2.1 },
  { plan: 'Pro Membership', price: '$79/mo', active: 420, mrr: 33180, churn: 3.5 },
  { plan: 'Starter Plan', price: '$29/mo', active: 890, mrr: 25810, churn: 5.2 },
]

const statusColors = { completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', refunded: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', pending: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' }
const statusIcons = { completed: CheckCircle, failed: XCircle, refunded: RefreshCw, pending: Clock }

export default function Payments() {
  const [tab, setTab] = useState('transactions')
  const [search, setSearch] = useState('')

  const totalMrr = subscriptions.reduce((s, p) => s + p.mrr, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Payments</h1>
          <p className="text-slate-500 dark:text-slate-400">Transactions, subscriptions, and revenue</p>
        </div>
        <button className="btn-secondary flex items-center gap-2"><Download className="w-4 h-4" /> Export</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Monthly Revenue', value: `$${(totalMrr/1000).toFixed(1)}K`, change: '+12.5%', up: true, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Active Subscriptions', value: '1,395', change: '+8.3%', up: true, icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Avg Order Value', value: '$124', change: '+5.1%', up: true, icon: ShoppingCart, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
          { label: 'Refund Rate', value: '1.8%', change: '-0.3%', up: true, icon: RefreshCw, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
        ].map((s, i) => (
          <div key={i} className="card p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{s.value}</p>
                <span className={`text-xs font-medium ${s.up ? 'text-green-600' : 'text-red-600'} flex items-center gap-0.5`}>
                  {s.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />} {s.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
        {['transactions', 'subscriptions', 'revenue', 'gateways'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${tab === t ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{t}</button>
        ))}
      </div>

      {tab === 'transactions' && (
        <>
          <div className="flex gap-3">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" placeholder="Search transactions..." value={search} onChange={e => setSearch(e.target.value)} className="input pl-10 w-full" /></div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Transaction</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Customer</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Product</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase">Amount</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Date</th>
              </tr></thead>
              <tbody>
                {transactions.map(t => {
                  const StatusIcon = statusIcons[t.status]
                  return (
                    <tr key={t.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-4"><p className="text-sm font-medium text-primary-600">{t.id}</p><p className="text-xs text-slate-400">{t.method}</p></td>
                      <td className="py-3 px-4"><p className="text-sm font-medium text-slate-900 dark:text-white">{t.customer}</p><p className="text-xs text-slate-400">{t.email}</p></td>
                      <td className="py-3 px-4"><p className="text-sm text-slate-700 dark:text-slate-300">{t.product}</p><p className="text-xs text-slate-400">{t.type}</p></td>
                      <td className="py-3 px-4 text-right text-sm font-semibold text-slate-900 dark:text-white">${t.amount}</td>
                      <td className="py-3 px-4 text-center"><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[t.status]}`}><StatusIcon className="w-3 h-3" />{t.status}</span></td>
                      <td className="py-3 px-4 text-sm text-slate-500">{t.date}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'subscriptions' && (
        <div className="space-y-4">
          {subscriptions.map((s, i) => (
            <div key={i} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{s.plan}</h3>
                  <p className="text-sm text-slate-500">{s.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">${s.mrr.toLocaleString()}</p>
                  <p className="text-xs text-slate-400">MRR</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-100 dark:border-slate-700">
                <div><p className="text-xs text-slate-400">Active</p><p className="text-lg font-bold text-slate-900 dark:text-white">{s.active}</p></div>
                <div><p className="text-xs text-slate-400">Churn Rate</p><p className="text-lg font-bold text-slate-900 dark:text-white">{s.churn}%</p></div>
                <div><p className="text-xs text-slate-400">LTV</p><p className="text-lg font-bold text-slate-900 dark:text-white">${Math.round(parseInt(s.price.replace(/\D/g, '')) / (s.churn / 100))}</p></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'revenue' && (
        <div className="card p-5">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Revenue Over Time</h3>
          <div className="h-48 flex items-end gap-2">
            {[65, 72, 68, 85, 78, 92, 88, 95, 90, 98, 94, 100].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-green-500/80 rounded-t hover:bg-green-600 transition-colors" style={{ height: `${h}%` }} />
                <span className="text-[10px] text-slate-400">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
            <div className="text-center"><p className="text-xs text-slate-400">Annual Revenue</p><p className="text-xl font-bold text-slate-900 dark:text-white">$912K</p></div>
            <div className="text-center"><p className="text-xs text-slate-400">Growth Rate</p><p className="text-xl font-bold text-green-600">+24%</p></div>
            <div className="text-center"><p className="text-xs text-slate-400">Net Revenue</p><p className="text-xl font-bold text-slate-900 dark:text-white">$856K</p></div>
          </div>
        </div>
      )}

      {tab === 'gateways' && (
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { name: 'Stripe', status: 'connected', transactions: 12500, volume: '$456K', icon: '💳' },
            { name: 'PayPal', status: 'connected', transactions: 4200, volume: '$128K', icon: '🅿️' },
            { name: 'Square', status: 'not connected', transactions: 0, volume: '$0', icon: '⬜' },
            { name: 'Authorize.net', status: 'not connected', transactions: 0, volume: '$0', icon: '🔒' },
          ].map((g, i) => (
            <div key={i} className="card p-5">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">{g.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{g.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${g.status === 'connected' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-500'}`}>{g.status}</span>
                </div>
              </div>
              {g.status === 'connected' ? (
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-slate-400 text-xs">Transactions</span><p className="font-semibold text-slate-900 dark:text-white">{g.transactions.toLocaleString()}</p></div>
                  <div><span className="text-slate-400 text-xs">Volume</span><p className="font-semibold text-slate-900 dark:text-white">{g.volume}</p></div>
                </div>
              ) : (
                <button className="btn-primary text-sm w-full mt-2">Connect</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
