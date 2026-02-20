import { useState } from 'react'
import { Plus, Search, Package, ShoppingCart, DollarSign, TrendingUp, Eye, Edit, Trash2, Star, Tag, Filter, ArrowUpDown, MoreVertical, Image, Box } from 'lucide-react'

const products = [
  { id: 1, name: 'Ultimate Marketing Course', price: 297, comparePrice: 497, sku: 'UMC-001', stock: 'unlimited', type: 'digital', status: 'active', sales: 1240, revenue: 368280, image: '📚', category: 'Courses', rating: 4.8 },
  { id: 2, name: 'Business Template Pack', price: 49, comparePrice: 99, sku: 'BTP-001', stock: 'unlimited', type: 'digital', status: 'active', sales: 3500, revenue: 171500, image: '📋', category: 'Templates', rating: 4.6 },
  { id: 3, name: 'Premium Coaching (1hr)', price: 500, comparePrice: null, sku: 'PC-001', stock: '10', type: 'service', status: 'active', sales: 85, revenue: 42500, image: '🎯', category: 'Services', rating: 5.0 },
  { id: 4, name: 'E-book: Growth Hacking', price: 19, comparePrice: 39, sku: 'EBK-001', stock: 'unlimited', type: 'digital', status: 'active', sales: 8900, revenue: 169100, image: '📖', category: 'E-books', rating: 4.3 },
  { id: 5, name: 'Membership - Monthly', price: 97, comparePrice: null, sku: 'MEM-M', stock: 'unlimited', type: 'subscription', status: 'active', sales: 450, revenue: 43650, image: '🔑', category: 'Memberships', rating: 4.7 },
  { id: 6, name: 'VIP Workshop Access', price: 1997, comparePrice: 2997, sku: 'VIP-001', stock: '50', type: 'event', status: 'draft', sales: 0, revenue: 0, image: '🏆', category: 'Events', rating: 0 },
]

const orders = [
  { id: 'ORD-1001', customer: 'Alice Johnson', email: 'alice@example.com', items: 2, total: 346, status: 'completed', date: '2024-01-15 14:30', payment: 'Stripe' },
  { id: 'ORD-1002', customer: 'Bob Smith', email: 'bob@example.com', items: 1, total: 297, status: 'completed', date: '2024-01-15 12:15', payment: 'PayPal' },
  { id: 'ORD-1003', customer: 'Carol White', email: 'carol@example.com', items: 3, total: 365, status: 'processing', date: '2024-01-15 10:45', payment: 'Stripe' },
  { id: 'ORD-1004', customer: 'David Brown', email: 'david@example.com', items: 1, total: 500, status: 'completed', date: '2024-01-14 16:20', payment: 'Stripe' },
  { id: 'ORD-1005', customer: 'Eva Green', email: 'eva@example.com', items: 1, total: 97, status: 'refunded', date: '2024-01-14 09:00', payment: 'Stripe' },
  { id: 'ORD-1006', customer: 'Frank Lee', email: 'frank@example.com', items: 2, total: 68, status: 'completed', date: '2024-01-13 18:30', payment: 'PayPal' },
]

const orderStatusColors = { completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', refunded: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' }

export default function EcomStore() {
  const [tab, setTab] = useState('products')
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)

  const totalRevenue = products.reduce((s, p) => s + p.revenue, 0)
  const totalSales = products.reduce((s, p) => s + p.sales, 0)
  const filteredProducts = products.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))
  const filteredOrders = orders.filter(o => !search || o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Store</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your products and orders</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `$${(totalRevenue/1000).toFixed(0)}K`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Total Sales', value: totalSales.toLocaleString(), icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Products', value: products.length, icon: Package, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
          { label: 'Avg Order Value', value: `$${(totalRevenue / totalSales).toFixed(0)}`, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
        ].map((s, i) => (
          <div key={i} className="card p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
        {['products', 'orders', 'discounts'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${tab === t ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            {t} {t === 'orders' && <span className="ml-1 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded-full text-xs">{orders.length}</span>}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type="text" placeholder={`Search ${tab}...`} value={search} onChange={e => setSearch(e.target.value)} className="input pl-10 w-full" />
      </div>

      {tab === 'products' && (
        <div className="grid gap-4">
          {filteredProducts.map(p => (
            <div key={p.id} className="card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-2xl flex-shrink-0">{p.image}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{p.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'}`}>{p.status}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                    <span>{p.category}</span>
                    <span>•</span>
                    <span>{p.type}</span>
                    <span>•</span>
                    <span>SKU: {p.sku}</span>
                    {p.rating > 0 && <><span>•</span><span className="flex items-center gap-0.5"><Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {p.rating}</span></>}
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-slate-900 dark:text-white">${p.price}</span>
                    {p.comparePrice && <span className="text-sm text-slate-400 line-through">${p.comparePrice}</span>}
                  </div>
                  <p className="text-xs text-slate-400">{p.sales.toLocaleString()} sales • ${p.revenue.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Edit className="w-4 h-4 text-slate-400" /></button>
                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Trash2 className="w-4 h-4 text-slate-400" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'orders' && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Order</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Customer</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase">Items</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase">Total</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Payment</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(o => (
                <tr key={o.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-medium text-primary-600 text-sm">{o.id}</td>
                  <td className="py-3 px-4">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{o.customer}</p>
                    <p className="text-xs text-slate-400">{o.email}</p>
                  </td>
                  <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${orderStatusColors[o.status]}`}>{o.status}</span></td>
                  <td className="py-3 px-4 text-sm text-right text-slate-600 dark:text-slate-400">{o.items}</td>
                  <td className="py-3 px-4 text-sm text-right font-semibold text-slate-900 dark:text-white">${o.total}</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{o.payment}</td>
                  <td className="py-3 px-4 text-sm text-slate-500">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'discounts' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button className="btn-primary flex items-center gap-2 text-sm"><Plus className="w-4 h-4" /> Create Discount</button>
          </div>
          {[
            { code: 'WELCOME20', type: 'Percentage', value: '20%', usage: '145 / 500', status: 'active', expires: '2024-03-01' },
            { code: 'BLACKFRIDAY', type: 'Percentage', value: '50%', usage: '2100 / 5000', status: 'expired', expires: '2023-12-01' },
            { code: 'FREESHIP', type: 'Free Shipping', value: 'Free', usage: '890 / unlimited', status: 'active', expires: 'Never' },
            { code: 'VIP100', type: 'Fixed Amount', value: '$100', usage: '12 / 50', status: 'active', expires: '2024-06-01' },
          ].map((d, i) => (
            <div key={i} className="card p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                <Tag className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <code className="font-mono font-bold text-slate-900 dark:text-white">{d.code}</code>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${d.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'}`}>{d.status}</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{d.type}: {d.value} • Used: {d.usage} • Expires: {d.expires}</p>
              </div>
              <div className="flex gap-1">
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Edit className="w-4 h-4 text-slate-400" /></button>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Trash2 className="w-4 h-4 text-slate-400" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add Product</h2>
              <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Product Name</label><input type="text" className="input w-full" placeholder="My Product" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price</label><input type="number" className="input w-full" placeholder="0.00" /></div>
                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Compare Price</label><input type="number" className="input w-full" placeholder="0.00" /></div>
              </div>
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
                <select className="input w-full"><option>Digital</option><option>Physical</option><option>Service</option><option>Subscription</option><option>Event</option></select>
              </div>
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label><textarea className="input w-full" rows={3} placeholder="Product description..." /></div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAdd(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={() => setShowAdd(false)} className="btn-primary flex-1">Add Product</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
