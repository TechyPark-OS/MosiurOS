import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Plus, Search, Eye, Edit, Trash2, ExternalLink, X } from 'lucide-react'
import api from '../lib/api'

export default function Pages() {
  const navigate = useNavigate()
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ name: '', funnel_id: '', template: 'blank' })

  useEffect(() => { loadPages() }, [])
  const loadPages = async () => {
    try { const data = await api.getPages(); setPages(Array.isArray(data) ? data : data.pages || []) }
    catch { setPages([
      { id: 1, name: 'Opt-in Page', funnel: 'Sales Funnel', url: '/optin', status: 'published', visits: 1250, conversions: 312 },
      { id: 2, name: 'Sales Letter', funnel: 'Sales Funnel', url: '/sales', status: 'published', visits: 890, conversions: 67 },
      { id: 3, name: 'Webinar Registration', funnel: 'Webinar Funnel', url: '/webinar', status: 'draft', visits: 0, conversions: 0 },
      { id: 4, name: 'Thank You Page', funnel: 'Sales Funnel', url: '/thank-you', status: 'published', visits: 312, conversions: 312 },
      { id: 5, name: 'Upsell Offer', funnel: 'Sales Funnel', url: '/upsell', status: 'draft', visits: 67, conversions: 12 },
    ]) } finally { setLoading(false) }
  }

  const createPage = async () => {
    try { await api.createPage(form); setShowCreate(false); loadPages() } catch { setPages([...pages, { id: Date.now(), ...form, status: 'draft', visits: 0, conversions: 0 }]); setShowCreate(false) }
  }

  const deletePage = async (id) => {
    if (!confirm('Delete this page?')) return
    try { await api.deletePage(id) } catch {} setPages(pages.filter(p => p.id !== id))
  }

  const filtered = pages.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()))

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Landing Pages</h1><p className="text-slate-500 text-sm mt-1">{pages.length} pages across all funnels</p></div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"><Plus className="w-4 h-4" /> New Page</button>
      </div>

      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search pages..." className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm" /></div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full"><thead><tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Page</th>
          <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Funnel</th>
          <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
          <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">Visits</th>
          <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">Conversions</th>
          <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">Actions</th>
        </tr></thead><tbody>
          {filtered.map(page => (
            <tr key={page.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30">
              <td className="px-4 py-3"><div className="flex items-center gap-3"><FileText className="w-5 h-5 text-blue-500" /><div><p className="font-medium text-slate-900 dark:text-white text-sm">{page.name}</p><p className="text-xs text-slate-500">{page.url}</p></div></div></td>
              <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{page.funnel || '-'}</td>
              <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${page.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>{page.status}</span></td>
              <td className="px-4 py-3 text-right text-sm text-slate-600 dark:text-slate-300">{page.visits?.toLocaleString()}</td>
              <td className="px-4 py-3 text-right text-sm text-slate-600 dark:text-slate-300">{page.conversions?.toLocaleString()}</td>
              <td className="px-4 py-3 text-right"><div className="flex items-center justify-end gap-1">
                <button onClick={() => navigate(`/dashboard/pages/${page.id}/edit`)} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700"><Edit className="w-4 h-4 text-slate-500" /></button>
                <button className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700"><Eye className="w-4 h-4 text-slate-500" /></button>
                <button onClick={() => deletePage(page.id)} className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="w-4 h-4 text-red-500" /></button>
              </div></td>
            </tr>
          ))}
        </tbody></table>
        {filtered.length === 0 && <div className="text-center py-12 text-slate-500"><FileText className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No pages found</p></div>}
      </div>

      {showCreate && <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"><div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-slate-900 dark:text-white">Create Page</h3><button onClick={() => setShowCreate(false)}><X className="w-5 h-5" /></button></div>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Page Name</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
          <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Template</label><select value={form.template} onChange={e => setForm({...form, template: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"><option value="blank">Blank</option><option value="optin">Opt-in</option><option value="sales">Sales Page</option><option value="webinar">Webinar</option></select></div>
          <button onClick={createPage} className="w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm">Create Page</button>
        </div>
      </div></div>}
    </div>
  )
}
