import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Send, Clock, Users, Eye } from 'lucide-react'
import api from '../lib/api'

export default function CampaignEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [campaign, setCampaign] = useState({ name: '', subject: '', from_name: '', from_email: '', content: '', status: 'draft', schedule_date: '', list_id: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState('content')

  useEffect(() => {
    (async () => {
      try { const d = await api.getCampaign(id); setCampaign(d) }
      catch { setCampaign({ name: 'Welcome Campaign', subject: 'Welcome to our platform!', from_name: 'TechyPark', from_email: 'hello@techypark.com', content: '<h1>Welcome!</h1><p>Thanks for joining us.</p>', status: 'draft', schedule_date: '', list_id: '1' }) }
      finally { setLoading(false) }
    })()
  }, [id])

  const save = async () => { setSaving(true); try { await api.updateCampaign(id, campaign) } catch {} finally { setSaving(false) } }
  const sendNow = async () => { if (!confirm('Send this campaign now?')) return; save() }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard/email-marketing')} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"><ArrowLeft className="w-5 h-5" /></button>
          <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">{campaign.name || 'Campaign Editor'}</h1><p className="text-sm text-slate-500">Edit campaign</p></div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 text-sm"><Eye className="w-4 h-4" /> Preview</button>
          <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm disabled:opacity-50"><Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Draft'}</button>
          <button onClick={sendNow} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 text-sm"><Send className="w-4 h-4" /> Send Now</button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
        {['content', 'settings', 'schedule'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-sm font-medium border-b-2 capitalize ${tab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{t}</button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        {tab === 'content' && <div className="space-y-4">
          <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Campaign Name</label><input value={campaign.name} onChange={e => setCampaign({...campaign, name: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
          <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject Line</label><input value={campaign.subject} onChange={e => setCampaign({...campaign, subject: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
          <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Content (HTML)</label><textarea value={campaign.content} onChange={e => setCampaign({...campaign, content: e.target.value})} rows={16} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm font-mono" /></div>
        </div>}

        {tab === 'settings' && <div className="space-y-4 max-w-lg">
          <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">From Name</label><input value={campaign.from_name} onChange={e => setCampaign({...campaign, from_name: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
          <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">From Email</label><input value={campaign.from_email} onChange={e => setCampaign({...campaign, from_email: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
          <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subscriber List</label><select value={campaign.list_id} onChange={e => setCampaign({...campaign, list_id: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"><option value="">All Subscribers</option><option value="1">Newsletter</option><option value="2">Customers</option><option value="3">Leads</option></select></div>
        </div>}

        {tab === 'schedule' && <div className="space-y-4 max-w-lg">
          <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Schedule Date & Time</label><input type="datetime-local" value={campaign.schedule_date} onChange={e => setCampaign({...campaign, schedule_date: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
          <p className="text-sm text-slate-500">Leave empty to send immediately when you click "Send Now"</p>
        </div>}
      </div>
    </div>
  )
}
