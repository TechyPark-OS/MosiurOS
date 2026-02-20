import { useState, useEffect } from 'react'
import { Plus, Clock, Eye, Edit, Trash2, Play, Pause, Copy, BarChart3, Zap, Calendar, TrendingUp, Target } from 'lucide-react'

const countdowns = [
  { id: 1, name: 'Product Launch Sale', type: 'fixed', endDate: '2024-02-15T23:59:59', status: 'active', views: 45000, conversions: 1250, convRate: 2.8, style: 'banner' },
  { id: 2, name: 'Webinar Registration', type: 'evergreen', duration: '48 hours', status: 'active', views: 12000, conversions: 890, convRate: 7.4, style: 'inline' },
  { id: 3, name: 'Black Friday Deal', type: 'fixed', endDate: '2024-11-30T23:59:59', status: 'scheduled', views: 0, conversions: 0, convRate: 0, style: 'popup' },
  { id: 4, name: 'Course Early Bird', type: 'evergreen', duration: '72 hours', status: 'active', views: 8500, conversions: 420, convRate: 4.9, style: 'floating' },
  { id: 5, name: 'Flash Sale', type: 'fixed', endDate: '2024-01-20T18:00:00', status: 'expired', views: 32000, conversions: 2100, convRate: 6.6, style: 'banner' },
]

const statusColors = { active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', expired: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400', paused: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' }

function CountdownTimer({ endDate }) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 })
  useEffect(() => {
    const timer = setInterval(() => {
      const diff = new Date(endDate) - new Date()
      if (diff <= 0) { clearInterval(timer); return }
      setTime({ d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) })
    }, 1000)
    return () => clearInterval(timer)
  }, [endDate])
  return (
    <div className="flex gap-2">
      {[['d', time.d], ['h', time.h], ['m', time.m], ['s', time.s]].map(([label, val]) => (
        <div key={label} className="text-center">
          <div className="w-12 h-12 bg-slate-900 dark:bg-slate-600 rounded-lg flex items-center justify-center text-white text-lg font-bold">{String(val).padStart(2, '0')}</div>
          <span className="text-[10px] text-slate-400 uppercase mt-1">{label === 'd' ? 'Days' : label === 'h' ? 'Hours' : label === 'm' ? 'Min' : 'Sec'}</span>
        </div>
      ))}
    </div>
  )
}

export default function Countdown() {
  const [tab, setTab] = useState('countdowns')
  const totalViews = countdowns.reduce((s, c) => s + c.views, 0)
  const totalConversions = countdowns.reduce((s, c) => s + c.conversions, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Countdown Funnels</h1>
          <p className="text-slate-500 dark:text-slate-400">Create urgency with countdown timers and limited-time offers</p>
        </div>
        <button className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> New Countdown</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Countdowns', value: countdowns.filter(c => c.status === 'active').length, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Total Views', value: `${(totalViews/1000).toFixed(1)}K`, icon: Eye, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Conversions', value: totalConversions.toLocaleString(), icon: Target, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
          { label: 'Avg Conv. Rate', value: '4.3%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
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
        {['countdowns', 'preview', 'analytics'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${tab === t ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{t}</button>
        ))}
      </div>

      {tab === 'countdowns' && (
        <div className="space-y-3">
          {countdowns.map(c => (
            <div key={c.id} className="card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center"><Clock className="w-5 h-5 text-red-600" /></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{c.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[c.status]}`}>{c.status}</span>
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs text-slate-500">{c.type}</span>
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs text-slate-500">{c.style}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {c.views.toLocaleString()} views</span>
                    <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {c.conversions.toLocaleString()} conversions</span>
                    <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {c.convRate}% rate</span>
                    <span>{c.type === 'fixed' ? c.endDate.split('T')[0] : c.duration}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  {c.status === 'active' ? <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Pause className="w-4 h-4 text-slate-400" /></button> : <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Play className="w-4 h-4 text-slate-400" /></button>}
                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Copy className="w-4 h-4 text-slate-400" /></button>
                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Edit className="w-4 h-4 text-slate-400" /></button>
                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Trash2 className="w-4 h-4 text-slate-400" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'preview' && (
        <div className="space-y-6">
          <div className="card overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-orange-500 p-4 text-center text-white">
              <p className="text-sm font-medium mb-2">🔥 Product Launch Sale Ends In:</p>
              <CountdownTimer endDate="2024-02-15T23:59:59" />
              <p className="text-xs mt-2 opacity-80">Don't miss out - prices go up when the timer hits zero!</p>
            </div>
          </div>
          <div className="card p-6 text-center">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Webinar Starts In:</h3>
            <div className="flex justify-center"><CountdownTimer endDate="2024-02-20T14:00:00" /></div>
            <button className="btn-primary mt-4">Reserve Your Spot</button>
          </div>
          <div className="card p-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white">
            <div className="flex items-center justify-between">
              <div><p className="font-bold">⚡ Early Bird Pricing</p><p className="text-sm opacity-80">Save 40% - Limited time only</p></div>
              <CountdownTimer endDate="2024-03-01T00:00:00" />
              <button className="px-4 py-2 bg-white text-purple-600 rounded-lg font-semibold text-sm">Get Deal</button>
            </div>
          </div>
        </div>
      )}

      {tab === 'analytics' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-5">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Conversion by Countdown Type</h3>
            <div className="space-y-3">
              {[{ type: 'Evergreen', rate: 6.2, color: 'bg-green-500' }, { type: 'Fixed Date', rate: 4.7, color: 'bg-blue-500' }, { type: 'Flash Sale', rate: 8.1, color: 'bg-red-500' }].map(t => (
                <div key={t.type} className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 dark:text-slate-400 w-24">{t.type}</span>
                  <div className="flex-1 h-4 bg-slate-100 dark:bg-slate-700 rounded-full"><div className={`h-full ${t.color} rounded-full`} style={{ width: `${t.rate * 10}%` }} /></div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white w-12 text-right">{t.rate}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-5">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Urgency Impact</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl"><p className="text-2xl font-bold text-green-600">+156%</p><p className="text-xs text-slate-400 mt-1">Conv. Rate Lift</p></div>
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl"><p className="text-2xl font-bold text-blue-600">+89%</p><p className="text-xs text-slate-400 mt-1">Page Engagement</p></div>
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl"><p className="text-2xl font-bold text-purple-600">3.2x</p><p className="text-xs text-slate-400 mt-1">Revenue Multiplier</p></div>
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl"><p className="text-2xl font-bold text-orange-600">-42%</p><p className="text-xs text-slate-400 mt-1">Cart Abandonment</p></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
