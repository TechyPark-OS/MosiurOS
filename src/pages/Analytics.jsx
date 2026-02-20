import { useState } from 'react'
import { BarChart3, TrendingUp, Users, Eye, MousePointer, DollarSign, ArrowUpRight, ArrowDownRight, Globe, Clock, Smartphone, Monitor, Tablet, Target, Percent, ShoppingCart, Calendar, Filter } from 'lucide-react'

const overviewStats = [
  { label: 'Total Visitors', value: '125,400', change: '+12.5%', up: true, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { label: 'Page Views', value: '342,800', change: '+8.3%', up: true, icon: Eye, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
  { label: 'Conversion Rate', value: '4.2%', change: '+0.5%', up: true, icon: Target, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  { label: 'Revenue', value: '$89,500', change: '+15.2%', up: true, icon: DollarSign, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
]

const trafficSources = [
  { source: 'Organic Search', visitors: 45200, percentage: 36, color: 'bg-blue-500' },
  { source: 'Direct', visitors: 31350, percentage: 25, color: 'bg-green-500' },
  { source: 'Social Media', visitors: 25080, percentage: 20, color: 'bg-purple-500' },
  { source: 'Email', visitors: 12540, percentage: 10, color: 'bg-orange-500' },
  { source: 'Paid Ads', visitors: 7524, percentage: 6, color: 'bg-pink-500' },
  { source: 'Referral', visitors: 3756, percentage: 3, color: 'bg-cyan-500' },
]

const topPages = [
  { page: '/funnel/product-launch', views: 45200, conversions: 2260, rate: '5.0%' },
  { page: '/courses/marketing-masterclass', views: 32100, conversions: 1284, rate: '4.0%' },
  { page: '/landing/free-trial', views: 28900, conversions: 1734, rate: '6.0%' },
  { page: '/store/template-pack', views: 21500, conversions: 860, rate: '4.0%' },
  { page: '/blog/funnel-strategies', views: 18700, conversions: 374, rate: '2.0%' },
]

const abTests = [
  { id: 1, name: 'Checkout Button Color', page: 'Product Page', status: 'running', variants: [{ name: 'Control (Blue)', visitors: 5200, conversions: 260, rate: 5.0 }, { name: 'Variant A (Green)', visitors: 5100, conversions: 306, rate: 6.0 }], confidence: 92, startDate: '2024-01-10' },
  { id: 2, name: 'Headline Copy Test', page: 'Landing Page', status: 'running', variants: [{ name: 'Control', visitors: 8200, conversions: 410, rate: 5.0 }, { name: 'Variant A', visitors: 8100, conversions: 486, rate: 6.0 }], confidence: 96, startDate: '2024-01-08' },
  { id: 3, name: 'Pricing Page Layout', page: 'Pricing', status: 'completed', variants: [{ name: 'Control (Cards)', visitors: 12000, conversions: 480, rate: 4.0 }, { name: 'Winner (Table)', visitors: 12100, conversions: 605, rate: 5.0 }], confidence: 99, startDate: '2023-12-15' },
]

const funnelSteps = [
  { name: 'Landing Page', visitors: 25000, dropoff: 0 },
  { name: 'Opt-in Form', visitors: 12500, dropoff: 50 },
  { name: 'Thank You Page', visitors: 10000, dropoff: 20 },
  { name: 'Sales Page', visitors: 7500, dropoff: 25 },
  { name: 'Checkout', visitors: 3750, dropoff: 50 },
  { name: 'Purchase', visitors: 2250, dropoff: 40 },
]

export default function Analytics() {
  const [tab, setTab] = useState('overview')
  const [period, setPeriod] = useState('30d')

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400">Traffic, conversions, and performance insights</p>
        </div>
        <div className="flex gap-2">
          {['7d', '30d', '90d', '1y'].map(p => (
            <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 text-sm rounded-lg ${period === p ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>{p}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map((s, i) => (
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
        {['overview', 'a/b tests', 'funnels', 'real-time'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${tab === t ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{t}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Traffic Chart Placeholder */}
          <div className="card p-5">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Traffic Overview</h3>
            <div className="h-48 flex items-end gap-1">
              {[40, 55, 35, 60, 75, 50, 65, 80, 70, 85, 60, 90, 75, 95, 80, 70, 85, 90, 75, 80, 95, 85, 70, 90, 80, 75, 85, 90, 95, 100].map((h, i) => (
                <div key={i} className="flex-1 bg-primary-500/80 rounded-t hover:bg-primary-600 transition-colors" style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-2"><span>Jan 1</span><span>Jan 15</span><span>Jan 30</span></div>
          </div>

          {/* Traffic Sources */}
          <div className="card p-5">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Traffic Sources</h3>
            <div className="flex gap-1 h-4 rounded-full overflow-hidden mb-4">
              {trafficSources.map(s => <div key={s.source} className={`${s.color}`} style={{ width: `${s.percentage}%` }} />)}
            </div>
            <div className="space-y-2">
              {trafficSources.map(s => (
                <div key={s.source} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${s.color}`} />
                  <span className="flex-1 text-sm text-slate-700 dark:text-slate-300">{s.source}</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{s.visitors.toLocaleString()}</span>
                  <span className="text-xs text-slate-400 w-10 text-right">{s.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Pages */}
          <div className="card p-5 lg:col-span-2">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Top Pages</h3>
            <table className="w-full">
              <thead><tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-2 text-xs font-medium text-slate-500 uppercase">Page</th>
                <th className="text-right py-2 text-xs font-medium text-slate-500 uppercase">Views</th>
                <th className="text-right py-2 text-xs font-medium text-slate-500 uppercase">Conversions</th>
                <th className="text-right py-2 text-xs font-medium text-slate-500 uppercase">Rate</th>
              </tr></thead>
              <tbody>
                {topPages.map((p, i) => (
                  <tr key={i} className="border-b border-slate-100 dark:border-slate-700/50">
                    <td className="py-2.5 text-sm font-mono text-primary-600">{p.page}</td>
                    <td className="py-2.5 text-sm text-right text-slate-600 dark:text-slate-400">{p.views.toLocaleString()}</td>
                    <td className="py-2.5 text-sm text-right text-slate-600 dark:text-slate-400">{p.conversions.toLocaleString()}</td>
                    <td className="py-2.5 text-sm text-right font-semibold text-green-600">{p.rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Device Breakdown */}
          <div className="card p-5">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Devices</h3>
            <div className="space-y-3">
              {[
                { name: 'Desktop', icon: Monitor, value: 58, count: '72,732' },
                { name: 'Mobile', icon: Smartphone, value: 35, count: '43,890' },
                { name: 'Tablet', icon: Tablet, value: 7, count: '8,778' },
              ].map(d => (
                <div key={d.name} className="flex items-center gap-3">
                  <d.icon className="w-5 h-5 text-slate-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300 w-16">{d.name}</span>
                  <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full"><div className="h-full bg-primary-500 rounded-full" style={{ width: `${d.value}%` }} /></div>
                  <span className="text-sm font-medium text-slate-900 dark:text-white w-16 text-right">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Geographic */}
          <div className="card p-5">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Top Countries</h3>
            <div className="space-y-3">
              {[
                { country: 'United States', flag: '🇺🇸', visitors: 52000, pct: 41 },
                { country: 'United Kingdom', flag: '🇬🇧', visitors: 18800, pct: 15 },
                { country: 'Canada', flag: '🇨🇦', visitors: 12540, pct: 10 },
                { country: 'Australia', flag: '🇦🇺', visitors: 8778, pct: 7 },
                { country: 'Germany', flag: '🇩🇪', visitors: 6270, pct: 5 },
              ].map(c => (
                <div key={c.country} className="flex items-center gap-3">
                  <span className="text-lg">{c.flag}</span>
                  <span className="flex-1 text-sm text-slate-700 dark:text-slate-300">{c.country}</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{c.visitors.toLocaleString()}</span>
                  <span className="text-xs text-slate-400 w-10 text-right">{c.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'a/b tests' && (
        <div className="space-y-4">
          {abTests.map(t => (
            <div key={t.id} className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{t.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${t.status === 'running' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'}`}>{t.status}</span>
                  </div>
                  <p className="text-sm text-slate-500">Page: {t.page} • Started: {t.startDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Confidence</p>
                  <p className={`text-xl font-bold ${t.confidence >= 95 ? 'text-green-600' : t.confidence >= 90 ? 'text-yellow-600' : 'text-slate-600'}`}>{t.confidence}%</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {t.variants.map((v, i) => (
                  <div key={i} className={`p-3 rounded-xl border-2 ${i === 1 && t.confidence >= 95 ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10' : 'border-slate-200 dark:border-slate-700'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{v.name}</span>
                      {i === 1 && t.confidence >= 95 && <span className="text-xs text-green-600 font-medium">Winner</span>}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div><span className="text-slate-400">Visitors</span><p className="font-semibold text-slate-900 dark:text-white">{v.visitors.toLocaleString()}</p></div>
                      <div><span className="text-slate-400">Conversions</span><p className="font-semibold text-slate-900 dark:text-white">{v.conversions}</p></div>
                      <div><span className="text-slate-400">Rate</span><p className="font-semibold text-green-600">{v.rate}%</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'funnels' && (
        <div className="card p-5">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Funnel Conversion Flow</h3>
          <div className="space-y-2">
            {funnelSteps.map((s, i) => (
              <div key={i}>
                <div className="flex items-center gap-4 mb-1">
                  <span className="text-sm text-slate-700 dark:text-slate-300 w-32">{s.name}</span>
                  <div className="flex-1 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                    <div className="h-full bg-primary-500/80 rounded-lg flex items-center px-3" style={{ width: `${(s.visitors / funnelSteps[0].visitors) * 100}%` }}>
                      <span className="text-xs font-medium text-white">{s.visitors.toLocaleString()}</span>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-slate-900 dark:text-white w-16 text-right">{((s.visitors / funnelSteps[0].visitors) * 100).toFixed(1)}%</span>
                </div>
                {i < funnelSteps.length - 1 && s.dropoff > 0 && (
                  <div className="ml-32 pl-4 text-xs text-red-500 mb-1">↓ {s.dropoff}% drop-off</div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <p className="text-sm font-medium text-green-700 dark:text-green-400">Overall Conversion: {((funnelSteps[funnelSteps.length - 1].visitors / funnelSteps[0].visitors) * 100).toFixed(1)}% ({funnelSteps[funnelSteps.length - 1].visitors.toLocaleString()} purchases from {funnelSteps[0].visitors.toLocaleString()} visitors)</p>
          </div>
        </div>
      )}

      {tab === 'real-time' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Active Users Right Now</h3>
            </div>
            <p className="text-5xl font-bold text-slate-900 dark:text-white mb-2">247</p>
            <p className="text-sm text-slate-500">across all pages</p>
          </div>
          <div className="card p-5">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Active Pages</h3>
            <div className="space-y-2">
              {[
                { page: '/funnel/product-launch', users: 45 },
                { page: '/courses/marketing', users: 32 },
                { page: '/store', users: 28 },
                { page: '/blog', users: 22 },
                { page: '/landing/free-trial', users: 18 },
              ].map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-sm font-mono text-slate-600 dark:text-slate-400 flex-1">{p.page}</span>
                  <span className="text-sm font-bold text-primary-600">{p.users}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
