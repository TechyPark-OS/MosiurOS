import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Plus, Search, Edit, Trash2, Send, Clock, CheckCircle, X } from 'lucide-react'
import api from '../lib/api'

export default function Campaigns() {
  const navigate = useNavigate()
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ name: '', subject: '', from_name: '', from_email: '' })

  useEffect(() => { loadCampaigns() }, [])
  const loadCampaigns = async () => {
    try { const data = await api.getCampaigns(); setCampaigns(Array.isArray(data) ? data : data.campaigns || []) }
    catch { setCampaigns([
      { id: 1, name: 'Welcome Series', subject: 'Welcome to our platform!', status: 'active', sent: 4520, opened: 2890, clicked: 890 },
      { id: 2, name: 'Product Launch', subject: 'Introducing our new feature', status: 'draft', sent: 0, opened: 0, clicked: 0 },
      { id: 3, name: 'Weekly Newsletter', subject: 'This week in tech', status: 'active', sent: 12400, opened: 7800, clicked: 2100 },
      { id: 4, name: 'Re-engagement', subject: 'We miss you!', status: 'scheduled', sent: 0, opened: 0, clicked: 0 },
      { id: 5, name: 'Black Friday Sale', subject: '50% OFF Everything!', status: 'completed', sent: 25000, opened: 18500, clicked: 8900 },
    ]) } finally { setLoading(false) }
  }

  const createCampaign = async () => {
    try { await api.createCampaign(form); setShowCreate(false); loadCampaigns() }
    catch { setCampaigns([...campaigns, { id: Date.now(), ...form, status: 'draft', sent: 0, opened: 0, clicked: 0 }]); setShowCreate(false) }
  }

  const deleteCampaign = async (id) => {
    if (!confirm('Delete this campaign?')) return
    try { await api.deleteCampaign(id) } catch {} setCampaigns(campaigns.filter(c => c.id !== id))
  }

  const statusIcon = (s) => ({ active: <Send className="w-4 h-4 text-green-500" />, draft: <Clock className="w-4 h-4 text-yellow-500" />, scheduled: <Clock className="w-4 h-4 text-blue-500" />, completed: <CheckCircle className="w-4 h-4 text-slate-500" /> }[s] || <Clock className="w-4 h-4 text-slate-400" />)
  const statusColor = (s) => ({ active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', draft: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', completed: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300' }[s] || 'bg-slate-100 text-slate-700')

  const filtered = campaigns.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()))

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Email Campaigns</h1><p className="text-slate-500 text-sm mt-1">{campaigns.length} campaigns</p></div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"><Plus className="w-4 h-4" /> New Campaign</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[{ label: 'Total Sent', value: campaigns.reduce((a, c) => a + (c.sent || 0), 0).toLocaleString(), color: 'blue' },
          { label: 'Total Opened', value: campaigns.reduce((a, c) => a + (c.opened || 0), 0).toLocaleString(), color: 'green' },
          { label: 'Total Clicked', value: campaigns.reduce((a, c) => a + (c.clicked || 0), 0).toLocaleString(), color: 'purple' },
          { label: 'Avg Open Rate', value: campaigns.length ? Math.round(campaigns.reduce((a, c) => a + (c.sent ? (c.opened / c.sent) * 100 : 0), 0) / campaigns.filter(c => c.sent).length || 0) + '%' : '0%', color: 'amber' },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <p className="text-xs text-slate-500 mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search campaigns..." className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm" /></div>

      <div className="space-y-3">
        {filtered.map(campaign => (
          <div key={campaign.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center"><Mail className="w-5 h-5 text-blue-500" /></div>
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-white">{campaign.name}</h3>
                  <p className="text-sm text-slate-500">{campaign.subject}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center gap-6 text-sm">
                  <div className="text-center"><p className="text-slate-500 text-xs">Sent</p><p className="font-medium text-slate-900 dark:text-white">{campaign.sent?.toLocaleString()}</p></div>
                  <div className="text-center"><p className="text-slate-500 text-xs">Opened</p><p className="font-medium text-slate-900 dark:text-white">{campaign.opened?.toLocaleString()}</p></div>
                  <div className="text-center"><p className="text-slate-500 text-xs">Clicked</p><p className="font-medium text-slate-900 dark:text-white">{campaign.clicked?.toLocaleString()}</p></div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(campaign.status)}`}>{campaign.status}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => navigate(`/dashboard/campaigns/${campaign.id}/edit`)} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700"><Edit className="w-4 h-4 text-slate-500" /></button>
                  <button onClick={() => deleteCampaign(campaign.id)} className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="w-4 h-4 text-red-500" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="text-center py-12 text-slate-500"><Mail className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No campaigns found</p></div>}
      </div>

      {showCreate && <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"><div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-slate-900 dark:text-white">New Campaign</h3><button onClick={() => setShowCreate(false)}><X className="w-5 h-5" /></button></div>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Campaign Name</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
          <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject Line</label><input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
          <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">From Name</label><input value={form.from_name} onChange={e => setForm({...form, from_name: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
          <button onClick={createCampaign} className="w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm">Create Campaign</button>
        </div>
      </div></div>}
    </div>
  )
}
