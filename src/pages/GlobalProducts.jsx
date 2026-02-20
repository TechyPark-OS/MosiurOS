import { useState } from 'react'
import { Plus, Search, Package, DollarSign, TrendingUp, ShoppingCart, Eye, Edit, Trash2, Copy, Star, Tag, BarChart3, Archive, Filter } from 'lucide-react'

const products = [
  { id: 1, name: 'Marketing Masterclass', type: 'digital', price: 497, recurring: false, sales: 1250, revenue: 621250, rating: 4.8, status: 'active', image: '📚' },
  { id: 2, name: 'Pro Membership', type: 'subscription', price: 79, recurring: true, interval: 'monthly', sales: 420, revenue: 33180, rating: 4.9, status: 'active', image: '👑' },
  { id: 3, name: 'Funnel Template Pack', type: 'digital', price: 47, recurring: false, sales: 3200, revenue: 150400, rating: 4.6, status: 'active', image: '🎨' },
  { id: 4, name: 'VIP Coaching Program', type: 'subscription', price: 199, recurring: true, interval: 'monthly', sales: 85, revenue: 16915, rating: 5.0, status: 'active', image: '🏆' },
  { id: 5, name: 'Email Swipe Files', type: 'digital', price: 27, recurring: false, sales: 5400, revenue: 145800, rating: 4.5, status: 'active', image: '📧' },
  { id: 6, name: 'Webinar Toolkit', type: 'bundle', price: 147, recurring: false, sales: 890, revenue: 130830, rating: 4.7, status: 'active', image: '🎥' },
  { id: 7, name: 'Starter Plan', type: 'subscription', price: 29, recurring: true, interval: 'monthly', sales: 890, revenue: 25810, rating: 4.4, status: 'active', image: '🚀' },
  { id: 8, name: 'Physical Workbook', type: 'physical', price: 39, recurring: false, sales: 620, revenue: 24180, rating: 4.3, status: 'draft', image: '📖' },
]

const typeColors = { digital: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', subscription: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', physical: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', bundle: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' }

export default function GlobalProducts() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [showCreate, setShowCreate] = useState(false)

  const totalRevenue = products.reduce((s, p) => s + p.revenue, 0)
  const totalSales = products.reduce((s, p) => s + p.sales, 0)

  const filtered = products.filter(p => {
    if (typeFilter !== 'all' && p.type !== typeFilter) return false
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Products</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your digital, physical, and subscription products</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Add Product</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: products.length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Total Revenue', value: `$${(totalRevenue/1000000).toFixed(1)}M`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Total Sales', value: totalSales.toLocaleString(), icon: ShoppingCart, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
          { label: 'Avg Rating', value: '4.7', icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
        ].map((s, i) => (
          <div key={i} className="card p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
              <div><p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p><p className="text-lg font-bold text-slate-900 dark:text-white">{s.value}</p></div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="input pl-10 w-full" /></div>
        <div className="flex gap-1">
          {['all', 'digital', 'subscription', 'physical', 'bundle'].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)} className={`px-3 py-2 text-sm rounded-lg capitalize ${typeFilter === t ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(p => (
          <div key={p.id} className="card overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-32 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-5xl">{p.image}</div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${typeColors[p.type]}`}>{p.type}</span>
                {p.recurring && <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-[10px] text-slate-500">{p.interval}</span>}
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{p.name}</h3>
              <p className="text-lg font-bold text-primary-600">${p.price}{p.recurring ? `/${p.interval === 'monthly' ? 'mo' : 'yr'}` : ''}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1"><ShoppingCart className="w-3 h-3" /> {p.sales.toLocaleString()}</span>
                <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> ${(p.revenue/1000).toFixed(0)}K</span>
                <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500" /> {p.rating}</span>
              </div>
              <div className="flex gap-1 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button className="flex-1 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-xs text-slate-500 flex items-center justify-center gap-1"><Edit className="w-3 h-3" /> Edit</button>
                <button className="flex-1 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-xs text-slate-500 flex items-center justify-center gap-1"><Copy className="w-3 h-3" /> Duplicate</button>
                <button className="flex-1 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-xs text-slate-500 flex items-center justify-center gap-1"><BarChart3 className="w-3 h-3" /> Stats</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add Product</h2>
              <button onClick={() => setShowCreate(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Product Name</label><input type="text" className="input w-full" placeholder="e.g., Marketing Masterclass" /></div>
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
                <select className="input w-full"><option>Digital Product</option><option>Subscription</option><option>Physical Product</option><option>Bundle</option></select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price</label><input type="number" className="input w-full" placeholder="0.00" /></div>
                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Compare Price</label><input type="number" className="input w-full" placeholder="0.00" /></div>
              </div>
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label><textarea className="input w-full" rows={3} placeholder="Product description..." /></div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreate(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={() => setShowCreate(false)} className="btn-primary flex-1">Create Product</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
