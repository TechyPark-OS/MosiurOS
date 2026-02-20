import { useState } from 'react'
import { Plus, Search, Link, Copy, ExternalLink, BarChart3, MousePointer, Eye, Edit, Trash2, QrCode, Globe, Calendar, TrendingUp, ArrowUpRight } from 'lucide-react'

const links = [
  { id: 1, shortUrl: 'tpk.io/launch', originalUrl: 'https://techypark.com/funnel/product-launch-2024?utm_source=email&utm_medium=campaign', title: 'Product Launch Funnel', clicks: 12500, uniqueClicks: 8900, created: '2024-01-10', lastClick: '2 min ago', tags: ['marketing', 'funnel'] },
  { id: 2, shortUrl: 'tpk.io/course', originalUrl: 'https://techypark.com/courses/marketing-masterclass', title: 'Marketing Masterclass', clicks: 8200, uniqueClicks: 6100, created: '2024-01-08', lastClick: '15 min ago', tags: ['courses'] },
  { id: 3, shortUrl: 'tpk.io/trial', originalUrl: 'https://techypark.com/free-trial?ref=social', title: 'Free Trial Page', clicks: 25600, uniqueClicks: 19200, created: '2023-12-20', lastClick: '1 min ago', tags: ['acquisition'] },
  { id: 4, shortUrl: 'tpk.io/webinar', originalUrl: 'https://techypark.com/webinar/scaling-secrets', title: 'Scaling Secrets Webinar', clicks: 4500, uniqueClicks: 3200, created: '2024-01-12', lastClick: '1 hour ago', tags: ['webinar'] },
  { id: 5, shortUrl: 'tpk.io/ebook', originalUrl: 'https://techypark.com/resources/funnel-ebook', title: 'Free Funnel eBook', clicks: 6800, uniqueClicks: 5100, created: '2024-01-05', lastClick: '30 min ago', tags: ['lead-magnet'] },
]

export default function ShortLinks() {
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)

  const totalClicks = links.reduce((s, l) => s + l.clicks, 0)
  const totalUnique = links.reduce((s, l) => s + l.uniqueClicks, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Short Links</h1>
          <p className="text-slate-500 dark:text-slate-400">Create, manage, and track shortened URLs</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Create Link</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Links', value: links.length, icon: Link, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Total Clicks', value: `${(totalClicks/1000).toFixed(1)}K`, icon: MousePointer, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Unique Clicks', value: `${(totalUnique/1000).toFixed(1)}K`, icon: Eye, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
          { label: 'Avg CTR', value: '4.8%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
        ].map((s, i) => (
          <div key={i} className="card p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
              <div><p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p><p className="text-lg font-bold text-slate-900 dark:text-white">{s.value}</p></div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" placeholder="Search links..." value={search} onChange={e => setSearch(e.target.value)} className="input pl-10 w-full" /></div>
      </div>

      <div className="space-y-3">
        {links.filter(l => !search || l.title.toLowerCase().includes(search.toLowerCase())).map(l => (
          <div key={l.id} className="card p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0"><Link className="w-5 h-5 text-primary-600" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{l.title}</h3>
                  {l.tags.map(t => <span key={t} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-[10px] text-slate-500">{t}</span>)}
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-primary-600">{l.shortUrl}</span>
                  <button className="p-0.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><Copy className="w-3.5 h-3.5 text-slate-400" /></button>
                  <button className="p-0.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><ExternalLink className="w-3.5 h-3.5 text-slate-400" /></button>
                </div>
                <p className="text-xs text-slate-400 truncate">{l.originalUrl}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><MousePointer className="w-3 h-3" /> {l.clicks.toLocaleString()} clicks</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {l.uniqueClicks.toLocaleString()} unique</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {l.created}</span>
                  <span className="flex items-center gap-1 text-green-500"><ArrowUpRight className="w-3 h-3" /> {l.lastClick}</span>
                </div>
              </div>
              <div className="flex gap-1">
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><QrCode className="w-4 h-4 text-slate-400" /></button>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><BarChart3 className="w-4 h-4 text-slate-400" /></button>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Edit className="w-4 h-4 text-slate-400" /></button>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Trash2 className="w-4 h-4 text-slate-400" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create Short Link</h2>
              <button onClick={() => setShowCreate(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Destination URL</label><input type="url" className="input w-full" placeholder="https://..." /></div>
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label><input type="text" className="input w-full" placeholder="Link title" /></div>
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Custom Slug (optional)</label><div className="flex"><span className="px-3 bg-slate-100 dark:bg-slate-700 border border-r-0 border-slate-300 dark:border-slate-600 rounded-l-lg flex items-center text-sm text-slate-500">tpk.io/</span><input type="text" className="input flex-1 rounded-l-none" placeholder="custom-slug" /></div></div>
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tags</label><input type="text" className="input w-full" placeholder="marketing, funnel (comma separated)" /></div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreate(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={() => setShowCreate(false)} className="btn-primary flex-1">Create Link</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
