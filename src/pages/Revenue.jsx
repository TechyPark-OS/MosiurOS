import { useState } from 'react'
import { DollarSign, TrendingUp, TrendingDown, Users, ArrowUpRight } from 'lucide-react'

export default function Revenue() {
  const [period, setPeriod] = useState('30d')

  const metrics = [
    { label: 'Total Revenue', value: '$128,450', change: '+12.5%', trend: 'up', icon: DollarSign, color: 'green' },
    { label: 'MRR', value: '$42,800', change: '+8.3%', trend: 'up', icon: TrendingUp, color: 'blue' },
    { label: 'Churn Rate', value: '2.4%', change: '-0.3%', trend: 'down', icon: TrendingDown, color: 'red' },
    { label: 'LTV', value: '$1,850', change: '+5.2%', trend: 'up', icon: Users, color: 'purple' },
  ]

  const revenueByPlan = [
    { plan: 'Starter ($97/mo)', subscribers: 245, mrr: 23765, percentage: 55 },
    { plan: 'Professional ($997/mo)', subscribers: 18, mrr: 17946, percentage: 42 },
    { plan: 'Premium Pro ($4997/mo)', subscribers: 1, mrr: 4997, percentage: 12 },
  ]

  const revenueByProduct = [
    { product: 'Subscriptions', revenue: 42800, percentage: 65 },
    { product: 'Courses', revenue: 12500, percentage: 19 },
    { product: 'Digital Products', revenue: 8200, percentage: 12 },
    { product: 'Services', revenue: 2950, percentage: 4 },
  ]

  const monthlyRevenue = [
    { month: 'Aug', revenue: 28500 }, { month: 'Sep', revenue: 32100 }, { month: 'Oct', revenue: 35800 },
    { month: 'Nov', revenue: 38200 }, { month: 'Dec', revenue: 41500 }, { month: 'Jan', revenue: 42800 },
  ]

  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Revenue Analytics</h1><p className="text-slate-500 text-sm mt-1">Track your business performance</p></div>
        <div className="flex gap-1">{['7d', '30d', '90d', '12m'].map(p => <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-2 rounded-lg text-sm ${period === p ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600'}`}>{p}</button>)}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between mb-2"><m.icon className={`w-5 h-5 text-${m.color}-500`} /><span className={`text-xs font-medium ${m.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>{m.change}</span></div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{m.value}</p>
            <p className="text-xs text-slate-500 mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Monthly Revenue</h2>
          <div className="flex items-end gap-3 h-48">
            {monthlyRevenue.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-slate-500">${(m.revenue / 1000).toFixed(1)}k</span>
                <div className="w-full bg-blue-500 rounded-t-lg transition-all" style={{ height: `${(m.revenue / maxRevenue) * 100}%` }} />
                <span className="text-xs text-slate-500">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Revenue by Plan</h2>
          <div className="space-y-4">
            {revenueByPlan.map((p, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1"><span className="text-sm text-slate-600 dark:text-slate-300">{p.plan}</span><span className="text-sm font-semibold text-slate-900 dark:text-white">${p.mrr.toLocaleString()}/mo</span></div>
                <div className="flex items-center gap-2"><div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full"><div className="h-2 bg-blue-500 rounded-full" style={{ width: `${p.percentage}%` }} /></div><span className="text-xs text-slate-500">{p.subscribers} subs</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Revenue by Product Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {revenueByProduct.map((p, i) => (
            <div key={i} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
              <p className="text-sm text-slate-500 mb-1">{p.product}</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">${p.revenue.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-1"><ArrowUpRight className="w-3 h-3 text-green-500" /><span className="text-xs text-green-600">{p.percentage}% of total</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
