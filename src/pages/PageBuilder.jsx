import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Eye, Globe, Code, Settings as SettingsIcon, Search as SearchIcon } from 'lucide-react'
import api from '../lib/api'

export default function PageBuilder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [page, setPage] = useState({ title: '', slug: '', meta_description: '', custom_css: '', custom_js: '', content: '', status: 'draft' })
  const [activeTab, setActiveTab] = useState('settings')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    (async () => {
      try { const data = await api.getPage(id); setPage(data) }
      catch { setPage({ title: 'Sample Page', slug: 'sample-page', meta_description: 'A sample landing page', custom_css: '', custom_js: '', content: '<h1>Welcome</h1><p>Edit this page content</p>', status: 'draft' }) }
      finally { setLoading(false) }
    })()
  }, [id])

  const savePage = async () => {
    setSaving(true)
    try { await api.updatePage(id, page) } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  const publish = async () => {
    const updated = { ...page, status: 'published' }
    setPage(updated)
    setSaving(true)
    try { await api.updatePage(id, updated) } catch {} finally { setSaving(false) }
  }

  const tabs = [
    { id: 'settings', label: 'Page Settings', icon: SettingsIcon },
    { id: 'seo', label: 'SEO', icon: SearchIcon },
    { id: 'code', label: 'Custom Code', icon: Code },
    { id: 'preview', label: 'Preview', icon: Eye },
  ]

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard/pages')} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"><ArrowLeft className="w-5 h-5" /></button>
          <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">{page.title || 'Page Editor'}</h1><p className="text-sm text-slate-500">/{page.slug}</p></div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${page.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{page.status}</span>
          {page.status !== 'published' && <button onClick={publish} className="px-4 py-2 rounded-lg border border-green-500 text-green-600 hover:bg-green-50 text-sm"><Globe className="w-4 h-4 inline mr-1" />Publish</button>}
          <button onClick={savePage} disabled={saving} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm disabled:opacity-50"><Save className="w-4 h-4 inline mr-1" />{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
        {tabs.map(tab => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}><tab.icon className="w-4 h-4" />{tab.label}</button>))}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        {activeTab === 'settings' && <div className="space-y-4 max-w-2xl">
          <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Page Title</label><input value={page.title} onChange={e => setPage({...page, title: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
          <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">URL Slug</label><div className="flex items-center"><span className="px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-r-0 border-slate-300 dark:border-slate-600 rounded-l-lg text-sm text-slate-500">yoursite.com/</span><input value={page.slug} onChange={e => setPage({...page, slug: e.target.value})} className="flex-1 px-3 py-2 rounded-r-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div></div>
          <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Page Content (HTML)</label><textarea value={page.content} onChange={e => setPage({...page, content: e.target.value})} rows={12} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm font-mono" /></div>
        </div>}

        {activeTab === 'seo' && <div className="space-y-4 max-w-2xl">
          <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meta Title</label><input value={page.title} onChange={e => setPage({...page, title: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /><p className="text-xs text-slate-400 mt-1">{page.title?.length || 0}/60 characters</p></div>
          <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meta Description</label><textarea value={page.meta_description} onChange={e => setPage({...page, meta_description: e.target.value})} rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /><p className="text-xs text-slate-400 mt-1">{page.meta_description?.length || 0}/160 characters</p></div>
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50"><p className="text-sm font-medium text-blue-600 mb-1">{page.title || 'Page Title'}</p><p className="text-xs text-green-600 mb-1">yoursite.com/{page.slug}</p><p className="text-xs text-slate-500">{page.meta_description || 'No description set'}</p></div>
        </div>}

        {activeTab === 'code' && <div className="space-y-4">
          <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Custom CSS</label><textarea value={page.custom_css} onChange={e => setPage({...page, custom_css: e.target.value})} rows={8} placeholder="/* Add custom CSS here */" className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-900 text-green-400 text-sm font-mono" /></div>
          <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Custom JavaScript</label><textarea value={page.custom_js} onChange={e => setPage({...page, custom_js: e.target.value})} rows={8} placeholder="// Add custom JavaScript here" className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-900 text-green-400 text-sm font-mono" /></div>
        </div>}

        {activeTab === 'preview' && <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white" style={{minHeight: '400px'}}>
          <div className="p-4" dangerouslySetInnerHTML={{ __html: page.content || '<p style="color:#999;text-align:center;padding:60px">No content yet. Add HTML in Page Settings.</p>' }} />
        </div>}
      </div>
    </div>
  )
}
