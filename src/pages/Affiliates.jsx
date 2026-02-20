import { useState } from 'react'
import { Plus, Search, Users, DollarSign, TrendingUp, Link, Copy, Eye, Edit, CheckCircle, Clock, XCircle, BarChart3, ArrowUpRight, Award, Percent } from 'lucide-react'

const affiliates = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', status: 'active', referrals: 145, sales: 89, revenue: 26700, commission: 8010, pending: 1200, tier: 'Gold', joined: '2023-06-15' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', status: 'active', referrals: 230, sales: 156, revenue: 46800, commission: 14040, pending: 2100, tier: 'Platinum', joined: '2023-04-20' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', status: 'active', referrals: 78, sales: 42, revenue: 12600, commission: 3780, pending: 560, tier: 'Silver', joined: '2023-09-01' },
  { id: 4, name: 'David Brown', email: 'david@example.com', status: 'active', referrals: 320, sales: 210, revenue: 63000, commission: 18900, pending: 3200, tier: 'Platinum', joined: '2023-03-10' },
  { id: 5, name: 'Eva Green', email: 'eva@example.com', status: 'pending', referrals: 0, sales: 0, revenue: 0, commission: 0, pending: 0, tier: 'Bronze', joined: '2024-01-14' },
]

const tierColors = { Bronze: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', Silver: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400', Gold: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', Platinum: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' }

const payouts = [
  { id: 'PAY-001', affiliate: 'David Brown', amount: 3200, method: 'PayPal', status: 'completed', date: '2024-01-15' },
  { id: 'PAY-002', affiliate: 'Bob Smith', amount: 2100, method: 'Bank Transfer', status: 'completed', date: '2024-01-15' },
  { id: 'PAY-003', affiliate: 'Alice Johnson', amount: 1200, method: 'PayPal', status: 'pending', date: '2024-01-20' },
  { id: 'PAY-004', affiliate: 'Carol White', amount: 560, method: 'Stripe', status: 'pending', date: '2024-01-20' },
]

export default function Affiliates() {
  const [tab, setTab] = useState('affiliates')
  const [search, setSearch] = useState('')

  const totalRevenue = affiliates.reduce((s, a) => s + a.revenue, 0)
  const totalCommission = affiliates.reduce((s, a) => s + a.commission, 0)
  const totalPending = affiliates.reduce((s, a) => s + a.pending, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Affiliate Center</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage affiliates, commissions, and payouts</p>
        </div>
        <button className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Add Affiliate</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Affiliates', value: affiliates.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Affiliate Revenue', value: `$${(totalRevenue/1000).toFixed(0)}K`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Commissions Paid', value: `$${(totalCommission/1000).toFixed(0)}K`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
          { label: 'Pending Payouts', value: `$${totalPending.toLocaleString()}`, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
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
        {['affiliates', 'payouts', 'links', 'settings'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${tab === t ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{t}</button>
        ))}
      </div>

      {tab === 'affiliates' && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Affiliate</th>
              <th className="text-center py-3 px-4 text-xs font-medium text-slate-500 uppercase">Tier</th>
              <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase">Referrals</th>
              <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase">Sales</th>
              <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase">Revenue</th>
              <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase">Commission</th>
              <th className="text-center py-3 px-4 text-xs font-medium text-slate-500 uppercase">Status</th>
            </tr></thead>
            <tbody>
              {affiliates.map(a => (
                <tr key={a.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4"><p className="font-medium text-slate-900 dark:text-white">{a.name}</p><p className="text-xs text-slate-400">{a.email}</p></td>
                  <td className="py-3 px-4 text-center"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tierColors[a.tier]}`}>{a.tier}</span></td>
                  <td className="py-3 px-4 text-right text-sm text-slate-600 dark:text-slate-400">{a.referrals}</td>
                  <td className="py-3 px-4 text-right text-sm text-slate-600 dark:text-slate-400">{a.sales}</td>
                  <td className="py-3 px-4 text-right text-sm font-semibold text-slate-900 dark:text-white">${a.revenue.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-sm font-semibold text-green-600">${a.commission.toLocaleString()}</td>
                  <td className="py-3 px-4 text-center"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${a.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'payouts' && (
        <div className="space-y-4">
          <div className="flex justify-end"><button className="btn-primary text-sm">Process Payouts</button></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Payout ID</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Affiliate</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase">Amount</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Method</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Date</th>
              </tr></thead>
              <tbody>
                {payouts.map(p => (
                  <tr key={p.id} className="border-b border-slate-100 dark:border-slate-700/50">
                    <td className="py-3 px-4 text-sm font-medium text-primary-600">{p.id}</td>
                    <td className="py-3 px-4 text-sm text-slate-900 dark:text-white">{p.affiliate}</td>
                    <td className="py-3 px-4 text-sm text-right font-semibold text-slate-900 dark:text-white">${p.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{p.method}</td>
                    <td className="py-3 px-4 text-center"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>{p.status}</span></td>
                    <td className="py-3 px-4 text-sm text-slate-500">{p.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'links' && (
        <div className="space-y-4">
          {[
            { name: 'Main Funnel', url: 'https://techypark.com/?ref=', clicks: 4500, conversions: 320 },
            { name: 'Course Page', url: 'https://techypark.com/courses/?ref=', clicks: 2100, conversions: 180 },
            { name: 'Free Trial', url: 'https://techypark.com/trial/?ref=', clicks: 6800, conversions: 890 },
          ].map((l, i) => (
            <div key={i} className="card p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center"><Link className="w-5 h-5 text-primary-600" /></div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-white">{l.name}</h3>
                <p className="text-sm text-slate-400 font-mono">{l.url}[ID]</p>
              </div>
              <div className="hidden sm:flex gap-6 text-center">
                <div><p className="text-xs text-slate-400">Clicks</p><p className="font-semibold text-slate-900 dark:text-white">{l.clicks.toLocaleString()}</p></div>
                <div><p className="text-xs text-slate-400">Conversions</p><p className="font-semibold text-green-600">{l.conversions}</p></div>
              </div>
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Copy className="w-4 h-4 text-slate-400" /></button>
            </div>
          ))}
        </div>
      )}

      {tab === 'settings' && (
        <div className="card p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Commission Settings</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Default Commission Rate</label><div className="flex"><input type="number" className="input flex-1 rounded-r-none" defaultValue="30" /><span className="px-3 bg-slate-100 dark:bg-slate-700 border border-l-0 border-slate-300 dark:border-slate-600 rounded-r-lg flex items-center text-sm text-slate-500">%</span></div></div>
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cookie Duration</label><div className="flex"><input type="number" className="input flex-1 rounded-r-none" defaultValue="30" /><span className="px-3 bg-slate-100 dark:bg-slate-700 border border-l-0 border-slate-300 dark:border-slate-600 rounded-r-lg flex items-center text-sm text-slate-500">days</span></div></div>
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Minimum Payout</label><div className="flex"><span className="px-3 bg-slate-100 dark:bg-slate-700 border border-r-0 border-slate-300 dark:border-slate-600 rounded-l-lg flex items-center text-sm text-slate-500">$</span><input type="number" className="input flex-1 rounded-l-none" defaultValue="50" /></div></div>
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Payout Frequency</label><select className="input w-full"><option>Monthly</option><option>Bi-weekly</option><option>Weekly</option></select></div>
            </div>
          </div>
          <button className="btn-primary">Save Settings</button>
        </div>
      )}
    </div>
  )
}
