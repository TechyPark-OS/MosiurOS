import { useState } from 'react'
import { Globe, Save, Plus, Trash2, Eye, BookOpen } from 'lucide-react'

export default function CustomerPortal() {
  const [settings, setSettings] = useState({ enabled: true, title: 'Help Center', logo_url: '', primary_color: '#2563eb', welcome_message: 'Welcome to our help center' })
  const [articles, setArticles] = useState([
    { id: 1, title: 'Getting Started Guide', category: 'Basics', status: 'published', views: 1250 },
    { id: 2, title: 'Account Settings', category: 'Account', status: 'published', views: 890 },
    { id: 3, title: 'Billing FAQ', category: 'Billing', status: 'published', views: 2100 },
    { id: 4, title: 'API Documentation', category: 'Developer', status: 'draft', views: 450 },
  ])
  const [saving, setSaving] = useState(false)

  const save = () => { setSaving(true); setTimeout(() => setSaving(false), 1000) }
  const addArticle = () => setArticles([...articles, { id: Date.now(), title: 'New Article', category: 'General', status: 'draft', views: 0 }])
  const removeArticle = (id) => setArticles(articles.filter(a => a.id !== id))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Customer Portal</h1><p className="text-slate-500 text-sm mt-1">Manage your customer-facing help center</p></div>
        <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm disabled:opacity-50"><Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Settings'}</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
            <div className="flex items-center justify-between"><h2 className="text-lg font-semibold text-slate-900 dark:text-white">Portal Settings</h2>
              <label className="flex items-center gap-2 cursor-pointer"><span className="text-sm text-slate-600">{settings.enabled ? 'Enabled' : 'Disabled'}</span><div className={`w-10 h-6 rounded-full transition-colors ${settings.enabled ? 'bg-blue-600' : 'bg-slate-300'} relative cursor-pointer`} onClick={() => setSettings({...settings, enabled: !settings.enabled})}><div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${settings.enabled ? 'translate-x-5' : 'translate-x-1'}`} /></div></label>
            </div>
            <div><label className="block text-sm font-medium mb-1">Portal Title</label><input value={settings.title} onChange={e => setSettings({...settings, title: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1">Welcome Message</label><textarea value={settings.welcome_message} onChange={e => setSettings({...settings, welcome_message: e.target.value})} rows={2} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Logo URL</label><input value={settings.logo_url} onChange={e => setSettings({...settings, logo_url: e.target.value})} placeholder="https://..." className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">Primary Color</label><div className="flex gap-2"><input type="color" value={settings.primary_color} onChange={e => setSettings({...settings, primary_color: e.target.value})} className="w-10 h-10 rounded border border-slate-300" /><input value={settings.primary_color} onChange={e => setSettings({...settings, primary_color: e.target.value})} className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div></div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold text-slate-900 dark:text-white">Knowledge Base Articles</h2><button onClick={addArticle} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 text-sm"><Plus className="w-4 h-4" /> Add Article</button></div>
            <div className="space-y-2">
              {articles.map(a => (
                <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  <div className="flex-1"><p className="font-medium text-sm text-slate-900 dark:text-white">{a.title}</p><p className="text-xs text-slate-500">{a.category} &middot; {a.views} views</p></div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${a.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{a.status}</span>
                  <button onClick={() => removeArticle(a.id)} className="p-1 rounded hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-500" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Preview</h2>
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4" style={{ backgroundColor: settings.primary_color }}><p className="text-white font-bold text-lg">{settings.title}</p><p className="text-white/80 text-sm">{settings.welcome_message}</p></div>
            <div className="p-4 space-y-2">{articles.filter(a => a.status === 'published').map(a => <div key={a.id} className="p-2 rounded bg-slate-50 dark:bg-slate-700/50 text-sm">{a.title}</div>)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
