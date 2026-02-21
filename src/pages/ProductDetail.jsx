import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Trash2, Package, DollarSign, Archive, Eye } from 'lucide-react'
import api from '../lib/api'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState({ name: '', description: '', price: '', type: 'physical', status: 'active', inventory: 0, images: '', variants: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    (async () => {
      try { const data = await api.getProduct(id); setProduct(data) }
      catch { setProduct({ name: 'Sample Product', description: 'A great product', price: '97.00', type: 'digital', status: 'active', inventory: 100, images: '', variants: '' }) }
      finally { setLoading(false) }
    })()
  }, [id])

  const saveProduct = async () => {
    setSaving(true)
    try { await api.updateProduct(id, product) } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  const deleteProduct = async () => {
    if (!confirm('Delete this product permanently?')) return
    try { await api.deleteProduct(id) } catch {} navigate('/dashboard/products')
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard/products')} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"><ArrowLeft className="w-5 h-5" /></button>
          <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">{product.name}</h1><p className="text-sm text-slate-500">Product Details</p></div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={deleteProduct} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 text-sm"><Trash2 className="w-4 h-4" /> Delete</button>
          <button onClick={saveProduct} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm disabled:opacity-50"><Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Product Information</h2>
            <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label><input value={product.name} onChange={e => setProduct({...product, name: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
            <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label><textarea value={product.description} onChange={e => setProduct({...product, description: e.target.value})} rows={4} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price ($)</label><input type="number" step="0.01" value={product.price} onChange={e => setProduct({...product, price: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label><select value={product.type} onChange={e => setProduct({...product, type: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"><option value="physical">Physical</option><option value="digital">Digital</option><option value="service">Service</option><option value="subscription">Subscription</option></select></div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Variants</h2>
            <textarea value={product.variants} onChange={e => setProduct({...product, variants: e.target.value})} rows={3} placeholder="e.g. Small, Medium, Large (one per line)" className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Status</h2>
            <select value={product.status} onChange={e => setProduct({...product, status: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"><option value="active">Active</option><option value="draft">Draft</option><option value="archived">Archived</option></select>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Inventory</h2>
            <input type="number" value={product.inventory} onChange={e => setProduct({...product, inventory: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Image URL</h2>
            <input value={product.images} onChange={e => setProduct({...product, images: e.target.value})} placeholder="https://..." className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
          </div>
        </div>
      </div>
    </div>
  )
}
