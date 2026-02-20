import { useState } from 'react'
import { Plus, Search, Eye, Edit, Copy, Trash2, BarChart3, ExternalLink, Layout, Smartphone, Monitor, Globe, Clock, CheckCircle, TrendingUp, MousePointer } from 'lucide-react'

const pages = [
  { id: 1, name: 'Product Launch Landing', url: '/launch', funnel: 'Product Launch Funnel', status: 'published', views: 8450, conversions: 1250, rate: 14.8, lastEdited: '2 hours ago', template: 'Hero + Video' },
  { id: 2, name: 'Free Ebook Opt-in', url: '/free-ebook', funnel: 'Lead Magnet Funnel', status: 'published', views: 12300, conversions: 5800, rate: 47.2, lastEdited: '1 day ago', template: 'Squeeze Page' },
  { id: 3, name: 'Webinar Registration', url: '/webinar', funnel: 'Webinar Registration', status: 'published', views: 5600, conversions: 1890, rate: 33.8, lastEdited: '3 days ago', template: 'Event Registration' },
  { id: 4, name: 'Checkout Page', url: '/checkout', funnel: 'Product Launch Funnel', status: 'published', views: 3200, conversions: 480, rate: 15.0, lastEdited: '2 hours ago', template: 'Checkout' },
  { id: 5, name: 'Thank You Page', url: '/thank-you', funnel: 'Lead Magnet Funnel', status: 'published', views: 5800, conversions: 0, rate: 0, lastEdited: '1 day ago', template: 'Thank You' },
  { id: 6, name: 'Coming Soon', url: '/coming-soon', funnel: null, status: 'draft', views: 0, conversions: 0, rate: 0, lastEdited: '5 days ago', template: 'Coming Soon' },
]

const templates = [
  { id: 1, name: 'Hero with Video', category: 'Sales', preview: '🎬', desc: 'Full-width hero with embedded video' },
  { id: 2, name: 'Squeeze Page', category: 'Lead Gen', preview: '📧', desc: 'Minimal opt-in focused page' },
  { id: 3, name: 'Long Form Sales', category: 'Sales', preview: '📝', desc: 'Long-form sales letter style' },
  { id: 4, name: 'Event Registration', category: 'Webinar', preview: '📅', desc: 'Event/webinar registration page' },
  { id: 5, name: 'Product Showcase', category: 'Ecommerce', preview: '🛍️', desc: 'Product features and benefits' },
  { id: 6, name: 'Thank You', category: 'Utility', preview: '🎉', desc: 'Post-conversion thank you page' },
  { id: 7, name: 'Coming Soon', category: 'Utility', preview: '⏳', desc: 'Pre-launch coming soon page' },
  { id: 8, name: 'Checkout', category: 'Sales', preview: '💳', desc: 'Optimized checkout page' },
  { id: 9, name: 'Testimonial Wall', category: 'Social Proof', preview: '⭐', desc: 'Customer testimonials showcase' },
]

export default function LandingPages() {
  const [tab, setTab] = useState('pages')
  const [search, setSearch] = useState('')
  const [showEditor, setShowEditor] = useState(false)

  const filtered = pages.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))
  const totalViews = pages.reduce((s, p) => s + p.views, 0)
  const totalConversions = pages.reduce((s, p) => s + p.conversions, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Landing Pages</h1>
          <p className="text-slate-500 dark:text-slate-400">Create and manage your landing pages</p>
        </div>
        <button onClick={() => setShowEditor(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Page
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Pages', value: pages.length, icon: Layout, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Published', value: pages.filter(p => p.status === 'published').length, icon: Globe, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Total Views', value: totalViews.toLocaleString(), icon: Eye, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
          { label: 'Conversions', value: totalConversions.toLocaleString(), icon: MousePointer, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
        ].map((s, i) => (
          <div key={i} className="card p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
        {['pages', 'templates'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${tab === t ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'pages' && (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search pages..." value={search} onChange={e => setSearch(e.target.value)} className="input pl-10 w-full" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Page</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Funnel</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Status</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase">Views</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase">Conversions</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase">Rate</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(page => (
                  <tr key={page.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{page.name}</p>
                        <p className="text-xs text-slate-400">{page.url} • {page.template}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{page.funnel || '—'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${page.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'}`}>
                        {page.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-slate-700 dark:text-slate-300">{page.views.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-right text-slate-700 dark:text-slate-300">{page.conversions.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-right font-medium text-primary-600">{page.rate}%</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><Eye className="w-4 h-4 text-slate-400" /></button>
                        <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><Edit className="w-4 h-4 text-slate-400" /></button>
                        <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><Copy className="w-4 h-4 text-slate-400" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'templates' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map(t => (
            <div key={t.id} className="card overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
              <div className="h-32 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-4xl">
                {t.preview}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{t.name}</h3>
                  <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-500">{t.category}</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{t.desc}</p>
                <div className="flex gap-2">
                  <button className="btn-primary text-sm flex-1">Use Template</button>
                  <button className="btn-secondary text-sm"><Eye className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showEditor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowEditor(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create Landing Page</h2>
              <button onClick={() => setShowEditor(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Page Name</label>
                <input type="text" placeholder="My Landing Page" className="input w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">URL Path</label>
                <input type="text" placeholder="/my-page" className="input w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Assign to Funnel (optional)</label>
                <select className="input w-full">
                  <option value="">None - Standalone Page</option>
                  <option>Product Launch Funnel</option>
                  <option>Lead Magnet Funnel</option>
                  <option>Webinar Registration</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowEditor(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={() => setShowEditor(false)} className="btn-primary flex-1">Create Page</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
