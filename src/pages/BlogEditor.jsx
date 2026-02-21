import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Globe, Eye, Image } from 'lucide-react'
import api from '../lib/api'

export default function BlogEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState({ title: '', content: '', excerpt: '', featured_image: '', category: '', tags: '', status: 'draft', meta_title: '', meta_description: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState('content')

  useEffect(() => {
    (async () => {
      try { const d = await api.getBlogPost(id); setPost(d) }
      catch { setPost({ title: 'Getting Started with TechyPark', content: '<h2>Introduction</h2><p>Welcome to TechyPark Engine...</p>', excerpt: 'Learn how to get started with TechyPark Engine', featured_image: '', category: 'Tutorials', tags: 'getting-started, tutorial', status: 'draft', meta_title: '', meta_description: '' }) }
      finally { setLoading(false) }
    })()
  }, [id])

  const save = async () => { setSaving(true); try { await api.updateBlogPost(id, post) } catch {} finally { setSaving(false) } }
  const publish = async () => { const u = { ...post, status: 'published' }; setPost(u); setSaving(true); try { await api.updateBlogPost(id, u) } catch {} finally { setSaving(false) } }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard/blog')} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"><ArrowLeft className="w-5 h-5" /></button>
          <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">{post.title || 'Blog Editor'}</h1><p className="text-sm text-slate-500">Edit blog post</p></div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{post.status}</span>
          {post.status !== 'published' && <button onClick={publish} className="px-4 py-2 rounded-lg border border-green-500 text-green-600 hover:bg-green-50 text-sm"><Globe className="w-4 h-4 inline mr-1" />Publish</button>}
          <button onClick={save} disabled={saving} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm disabled:opacity-50"><Save className="w-4 h-4 inline mr-1" />{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
        {['content', 'media', 'seo'].map(t => <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-sm font-medium border-b-2 capitalize ${tab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{t}</button>)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            {tab === 'content' && <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Title</label><input value={post.title} onChange={e => setPost({...post, title: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-lg font-semibold" /></div>
              <div><label className="block text-sm font-medium mb-1">Excerpt</label><textarea value={post.excerpt} onChange={e => setPost({...post, excerpt: e.target.value})} rows={2} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">Content (HTML)</label><textarea value={post.content} onChange={e => setPost({...post, content: e.target.value})} rows={16} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm font-mono" /></div>
            </div>}
            {tab === 'media' && <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Featured Image URL</label><input value={post.featured_image} onChange={e => setPost({...post, featured_image: e.target.value})} placeholder="https://..." className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
              {post.featured_image && <img src={post.featured_image} alt="Featured" className="w-full h-48 object-cover rounded-lg" />}
              {!post.featured_image && <div className="flex items-center justify-center h-48 bg-slate-50 dark:bg-slate-700/50 rounded-lg"><Image className="w-12 h-12 text-slate-300" /></div>}
            </div>}
            {tab === 'seo' && <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Meta Title</label><input value={post.meta_title || post.title} onChange={e => setPost({...post, meta_title: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /><p className="text-xs text-slate-400 mt-1">{(post.meta_title || post.title)?.length}/60</p></div>
              <div><label className="block text-sm font-medium mb-1">Meta Description</label><textarea value={post.meta_description || post.excerpt} onChange={e => setPost({...post, meta_description: e.target.value})} rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /><p className="text-xs text-slate-400 mt-1">{(post.meta_description || post.excerpt)?.length}/160</p></div>
            </div>}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Post Settings</h3>
            <div><label className="block text-sm font-medium mb-1">Category</label><input value={post.category} onChange={e => setPost({...post, category: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1">Tags (comma-separated)</label><input value={post.tags} onChange={e => setPost({...post, tags: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1">Status</label><select value={post.status} onChange={e => setPost({...post, status: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"><option value="draft">Draft</option><option value="published">Published</option><option value="scheduled">Scheduled</option></select></div>
          </div>
        </div>
      </div>
    </div>
  )
}
