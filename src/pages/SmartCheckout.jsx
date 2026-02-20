import { useState } from 'react'
import { ShoppingCart, DollarSign, TrendingUp, ArrowUpRight, CreditCard, Package, Percent, Plus, Edit, Eye, BarChart3, Zap, CheckCircle, Gift } from 'lucide-react'

const checkoutFunnels = [
  { id: 1, name: 'Masterclass Checkout', product: 'Marketing Masterclass', price: '$497', orderBumps: 2, upsells: 3, convRate: 12.5, avgOrderValue: 624, revenue: 312000, status: 'active' },
  { id: 2, name: 'Pro Plan Checkout', product: 'Pro Membership', price: '$79/mo', orderBumps: 1, upsells: 2, convRate: 8.2, avgOrderValue: 112, revenue: 89600, status: 'active' },
  { id: 3, name: 'Template Bundle', product: 'Funnel Template Pack', price: '$47', orderBumps: 3, upsells: 1, convRate: 18.4, avgOrderValue: 78, revenue: 156000, status: 'active' },
  { id: 4, name: 'Coaching Checkout', product: 'VIP Coaching', price: '$199/mo', orderBumps: 1, upsells: 2, convRate: 5.6, avgOrderValue: 289, revenue: 48960, status: 'draft' },
]

const orderBumps = [
  { name: 'Email Swipe Files', addedTo: 'Masterclass Checkout', price: '$27', takeRate: 42, revenue: 14175 },
  { name: 'Private Community Access', addedTo: 'Masterclass Checkout', price: '$97', takeRate: 28, revenue: 33950 },
  { name: 'Bonus Templates', addedTo: 'Template Bundle', price: '$17', takeRate: 55, revenue: 29920 },
  { name: 'Priority Support', addedTo: 'Pro Plan Checkout', price: '$19/mo', takeRate: 35, revenue: 11130 },
]

const coupons = [
  { code: 'LAUNCH50', discount: '50% off', type: 'percentage', uses: 450, limit: 500, revenue: 112500, status: 'active' },
  { code: 'WELCOME20', discount: '$20 off', type: 'fixed', uses: 1200, limit: null, revenue: 24000, status: 'active' },
  { code: 'VIP100', discount: '$100 off', type: 'fixed', uses: 85, limit: 100, revenue: 8500, status: 'active' },
  { code: 'BLACKFRIDAY', discount: '40% off', type: 'percentage', uses: 2100, limit: 2100, revenue: 168000, status: 'expired' },
]

export default function SmartCheckout() {
  const [tab, setTab] = useState('checkouts')

  const totalRevenue = checkoutFunnels.reduce((s, c) => s + c.revenue, 0)
  const avgConvRate = (checkoutFunnels.reduce((s, c) => s + c.convRate, 0) / checkoutFunnels.length).toFixed(1)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Smart Checkout</h1>
          <p className="text-slate-500 dark:text-slate-400">Optimize checkout flows with order bumps, upsells, and coupons</p>
        </div>
        <button className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> New Checkout</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `$${(totalRevenue/1000).toFixed(0)}K`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Avg Conv Rate', value: `${avgConvRate}%`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Avg Order Value', value: '$276', icon: ShoppingCart, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
          { label: 'Bump Take Rate', value: '40%', icon: ArrowUpRight, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
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
        {['checkouts', 'order bumps', 'coupons', 'upsells'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${tab === t ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{t}</button>
        ))}
      </div>

      {tab === 'checkouts' && (
        <div className="space-y-3">
          {checkoutFunnels.map(c => (
            <div key={c.id} className="card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center"><CreditCard className="w-5 h-5 text-green-600" /></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{c.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-500'}`}>{c.status}</span>
                  </div>
                  <p className="text-sm text-slate-500 mb-1">{c.product} • {c.price}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Package className="w-3 h-3" /> {c.orderBumps} bumps</span>
                    <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> {c.upsells} upsells</span>
                    <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {c.convRate}% conv</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> ${c.avgOrderValue} AOV</span>
                    <span className="font-medium text-green-600">${(c.revenue/1000).toFixed(0)}K revenue</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Eye className="w-4 h-4 text-slate-400" /></button>
                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Edit className="w-4 h-4 text-slate-400" /></button>
                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><BarChart3 className="w-4 h-4 text-slate-400" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'order bumps' && (
        <div className="space-y-3">
          {orderBumps.map((b, i) => (
            <div key={i} className="card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center"><Gift className="w-5 h-5 text-orange-600" /></div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{b.name}</h3>
                  <p className="text-sm text-slate-500">{b.addedTo} • {b.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">{b.takeRate}% take rate</p>
                  <p className="text-xs text-slate-400">${b.revenue.toLocaleString()} revenue</p>
                </div>
              </div>
            </div>
          ))}
          <button className="card p-4 w-full border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-primary-500 transition-colors text-center">
            <Plus className="w-6 h-6 text-slate-400 mx-auto mb-1" /><p className="text-sm text-slate-500">Add Order Bump</p>
          </button>
        </div>
      )}

      {tab === 'coupons' && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Code</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Discount</th>
              <th className="text-center py-3 px-4 text-xs font-medium text-slate-500 uppercase">Uses</th>
              <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase">Revenue</th>
              <th className="text-center py-3 px-4 text-xs font-medium text-slate-500 uppercase">Status</th>
            </tr></thead>
            <tbody>
              {coupons.map(c => (
                <tr key={c.code} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4"><span className="font-mono font-bold text-primary-600">{c.code}</span></td>
                  <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-300">{c.discount}</td>
                  <td className="py-3 px-4 text-center text-sm">{c.uses.toLocaleString()}{c.limit ? ` / ${c.limit.toLocaleString()}` : ''}</td>
                  <td className="py-3 px-4 text-right text-sm font-semibold text-green-600">${c.revenue.toLocaleString()}</td>
                  <td className="py-3 px-4 text-center"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-500'}`}>{c.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'upsells' && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">One-Click Upsell Sequences</h3>
          <p className="text-sm text-slate-500 mb-6">Configure post-purchase upsell offers to maximize order value.</p>
          <div className="space-y-4">
            {[
              { step: 1, name: 'VIP Upgrade Offer', price: '$97', acceptRate: 22, revenue: 26730 },
              { step: 2, name: 'Done-For-You Templates', price: '$47', acceptRate: 35, revenue: 20580 },
              { step: 3, name: 'Coaching Call Add-on', price: '$197', acceptRate: 8, revenue: 19700 },
            ].map(u => (
              <div key={u.step} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold">{u.step}</div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900 dark:text-white">{u.name}</h4>
                  <p className="text-sm text-slate-500">{u.price} • {u.acceptRate}% accept rate</p>
                </div>
                <span className="text-sm font-bold text-green-600">${u.revenue.toLocaleString()}</span>
                <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg"><Edit className="w-4 h-4 text-slate-400" /></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
