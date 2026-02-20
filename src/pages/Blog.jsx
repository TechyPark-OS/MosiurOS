import { useState } from 'react'
import { Plus, Search, FileText, Eye, Edit, Trash2, Calendar, Clock, Tag, TrendingUp, BarChart3, Globe, Image, BookOpen, MessageCircle, Share2, Star } from 'lucide-react'

const blogPosts = [
  { id: 1, title: '10 Funnel Strategies That Actually Work in 2024', slug: 'funnel-strategies-2024', status: 'published', author: 'John Admin', date: '2024-01-15', views: 12500, comments: 45, shares: 230, category: 'Marketing', readTime: '8 min', featured: true },
  { id: 2, title: 'How to Build a 6-Figure Online Course', slug: 'build-6-figure-course', status: 'published', author: 'Sarah Manager', date: '2024-01-12', views: 8900, comments: 32, shares: 180, category: 'Courses', readTime: '12 min', featured: false },
  { id: 3, title: 'Email Marketing: The Complete Guide', slug: 'email-marketing-guide', status: 'published', author: 'John Admin', date: '2024-01-10', views: 15200, comments: 67, shares: 340, category: 'Email', readTime: '15 min', featured: true },
  { id: 4, title: 'A/B Testing Your Landing Pages', slug: 'ab-testing-landing-pages', status: 'published', author: 'Mike Developer', date: '2024-01-08', views: 5600, comments: 18, shares: 95, category: 'Optimization', readTime: '6 min', featured: false },
  { id: 5, title: 'The Ultimate SEO Checklist', slug: 'seo-checklist', status: 'draft', author: 'John Admin', date: '2024-01-16', views: 0, comments: 0, shares: 0, category: 'SEO', readTime: '10 min', featured: false },
  { id: 6, title: 'Customer Retention Strategies', slug: 'customer-retention', status: 'scheduled', author: 'Sarah Manager', date: '2024-01-20', views: 0, comments: 0, shares: 0, category: 'Business', readTime: '7 min', featured: false },
]

const categories = [
  { name: 'Marketing', count: 24, color: 'bg-blue-500' },
  { name: 'Courses', count: 12, color: 'bg-purple-500' },
  { name: 'Email', count: 18, color: 'bg-green-500' },
  { name: 'SEO', count: 15, color: 'bg-orange-500' },
  { name: 'Business', count: 20, color: 'bg-pink-500' },
  { name: 'Optimization', count: 8, color: 'bg-cyan-500' },
]

const statusColors = { published: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', draft: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400', scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' }

export default function Blog() {
  const [tab, setTab] = useState('posts')
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const totalViews = blogPosts.reduce((s, p) => s + p.views, 0)
  const filtered = blogPosts.filter(p => {
    if (filterStatus !== 'all' && p.status !== filterStatus) return false
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Blog</h1>
          <p className="text-slate-500 dark:text-slate-400">Content management and publishing</p>
        </div>
        <button className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> New Post</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Posts', value: blogPosts.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Total Views', value: `${(totalViews/1000).toFixed(1)}K`, icon: Eye, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Avg Read Time', value: '9 min', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
          { label: 'Total Shares', value: blogPosts.reduce((s, p) => s + p.shares, 0), icon: Share2, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
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
        {['posts', 'categories', 'seo'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${tab === t ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{t === 'seo' ? 'SEO' : t}</button>
        ))}
      </div>

      {tab === 'posts' && (
        <>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" placeholder="Search posts..." value={search} onChange={e => setSearch(e.target.value)} className="input pl-10 w-full" /></div>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="input"><option value="all">All Status</option><option value="published">Published</option><option value="draft">Draft</option><option value="scheduled">Scheduled</option></select>
          </div>
          <div className="space-y-3">
            {filtered.map(p => (
              <div key={p.id} className="card p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-900/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {p.featured && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                      <h3 className="font-semibold text-slate-900 dark:text-white">{p.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[p.status]}`}>{p.status}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mb-1">
                      <span>{p.author}</span><span>•</span><span>{p.date}</span><span>•</span><span>{p.readTime} read</span><span>•</span>
                      <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs">{p.category}</span>
                    </div>
                    {p.views > 0 && (
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {p.views.toLocaleString()}</span>
                        <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {p.comments}</span>
                        <span className="flex items-center gap-1"><Share2 className="w-3 h-3" /> {p.shares}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Eye className="w-4 h-4 text-slate-400" /></button>
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Edit className="w-4 h-4 text-slate-400" /></button>
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Trash2 className="w-4 h-4 text-slate-400" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'categories' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(c => (
            <div key={c.name} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-3 h-3 rounded-full ${c.color}`} />
                <h3 className="font-semibold text-slate-900 dark:text-white">{c.name}</h3>
              </div>
              <p className="text-sm text-slate-500">{c.count} posts</p>
            </div>
          ))}
          <div className="card p-5 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center cursor-pointer hover:border-primary-500">
            <div className="text-center"><Plus className="w-6 h-6 text-slate-400 mx-auto mb-1" /><p className="text-sm text-slate-500">Add Category</p></div>
          </div>
        </div>
      )}

      {tab === 'seo' && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">SEO Overview</h3>
          <div className="space-y-4">
            {blogPosts.filter(p => p.status === 'published').map(p => (
              <div key={p.id} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-slate-900 dark:text-white text-sm">{p.title}</h4>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs">Good</span>
                </div>
                <p className="text-xs text-slate-400 mb-2">/{p.slug}</p>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div><span className="text-slate-400">Title Length</span><div className="h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full mt-1"><div className="h-full bg-green-500 rounded-full" style={{width: '85%'}} /></div></div>
                  <div><span className="text-slate-400">Meta Description</span><div className="h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full mt-1"><div className="h-full bg-green-500 rounded-full" style={{width: '90%'}} /></div></div>
                  <div><span className="text-slate-400">Readability</span><div className="h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full mt-1"><div className="h-full bg-yellow-500 rounded-full" style={{width: '70%'}} /></div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
