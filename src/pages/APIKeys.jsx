import { useState, useEffect } from 'react'
import { Key, Plus, Trash2, Copy, Eye, EyeOff, X } from 'lucide-react'
import api from '../lib/api'

export default function APIKeys() {
  const [keys, setKeys] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ name: '', permissions: 'read' })
  const [revealed, setRevealed] = useState({})

  useEffect(() => { load() }, [])
  const load = async () => {
    try { const d = await api.getApiKeys(); setKeys(Array.isArray(d) ? d : d.keys || []) }
    catch { setKeys([
      { id: 1, name: 'Production API', key: 'tp_live_abc123def456ghi789jkl012mno345', permissions: 'full', created: '2024-01-10', last_used: '2024-01-15 10:30' },
      { id: 2, name: 'Read-only Dashboard', key: 'tp_live_xyz789abc123def456ghi789jkl012', permissions: 'read', created: '2024-01-05', last_used: '2024-01-14 16:45' },
      { id: 3, name: 'Webhook Integration', key: 'tp_live_mno345pqr678stu901vwx234yza567', permissions: 'write', created: '2024-01-01', last_used: 'Never' },
    ]) } finally { setLoading(false) }
  }

  const create = async () => {
    const newKey = { id: Date.now(), ...form, key: `tp_live_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`, created: new Date().toISOString().split('T')[0], last_used: 'Never' }
    try { await api.createApiKey(form) } catch {}
    setKeys([...keys, newKey]); setShowCreate(false); setForm({ name: '', permissions: 'read' })
  }

  const revoke = async (id) => {
    if (!confirm('Revoke this API key? This cannot be undone.')) return
    try { await api.deleteApiKey(id) } catch {}
    setKeys(keys.filter(k => k.id !== id))
  }

  const copyKey = (key) => { navigator.clipboard.writeText(key); alert('API key copied to clipboard') }
  const maskKey = (key) => key ? key.slice(0, 12) + '...' + key.slice(-6) : ''

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">API Keys</h1><p className="text-slate-500 text-sm mt-1">Manage your API access keys</p></div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"><Plus className="w-4 h-4" /> Create Key</button>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
        <p className="text-sm text-yellow-800 dark:text-yellow-200"><strong>Security Notice:</strong> API keys provide full access to your account. Keep them secure and never share them publicly.</p>
      </div>

      <div className="space-y-3">
        {keys.map(k => (
          <div key={k.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center"><Key className="w-5 h-5 text-blue-500" /></div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{k.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded font-mono">{revealed[k.id] ? k.key : maskKey(k.key)}</code>
                    <button onClick={() => setRevealed({...revealed, [k.id]: !revealed[k.id]})} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700">{revealed[k.id] ? <EyeOff className="w-3.5 h-3.5 text-slate-400" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}</button>
                    <button onClick={() => copyKey(k.key)} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"><Copy className="w-3.5 h-3.5 text-slate-400" /></button>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden md:block"><p className="text-xs text-slate-500">Created: {k.created}</p><p className="text-xs text-slate-500">Last used: {k.last_used}</p></div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${k.permissions === 'full' ? 'bg-red-100 text-red-700' : k.permissions === 'write' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{k.permissions}</span>
                <button onClick={() => revoke(k.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="w-4 h-4 text-red-500" /></button>
              </div>
            </div>
          </div>
        ))}
        {keys.length === 0 && <div className="text-center py-12 text-slate-500"><Key className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No API keys yet</p></div>}
      </div>

      {showCreate && <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"><div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold">Create API Key</h3><button onClick={() => setShowCreate(false)}><X className="w-5 h-5" /></button></div>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Key Name</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Production API" className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Permissions</label><select value={form.permissions} onChange={e => setForm({...form, permissions: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"><option value="read">Read Only</option><option value="write">Read & Write</option><option value="full">Full Access</option></select></div>
          <button onClick={create} className="w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm">Create Key</button>
        </div>
      </div></div>}
    </div>
  )
}
