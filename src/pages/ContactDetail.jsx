import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Mail, Phone, Building, Tag, Clock, MessageSquare, DollarSign } from 'lucide-react'
import api from '../lib/api'

export default function ContactDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [contact, setContact] = useState({ name: '', email: '', phone: '', company: '', status: 'lead', tags: [], notes: '' })
  const [activities, setActivities] = useState([])
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newNote, setNewNote] = useState('')

  useEffect(() => {
    (async () => {
      try { const d = await api.getContact(id); setContact(d) }
      catch {
        setContact({ name: 'Alice Johnson', email: 'alice@example.com', phone: '+1 (555) 123-4567', company: 'Tech Solutions', status: 'qualified', tags: ['vip', 'enterprise'], notes: 'Interested in premium plan' })
        setActivities([
          { id: 1, type: 'email', text: 'Sent welcome email', time: '2 hours ago' },
          { id: 2, type: 'call', text: 'Discovery call completed', time: '1 day ago' },
          { id: 3, type: 'note', text: 'Added to VIP segment', time: '3 days ago' },
          { id: 4, type: 'deal', text: 'Created deal: Enterprise Plan', time: '5 days ago' },
        ])
        setDeals([
          { id: 1, name: 'Enterprise Plan', value: 50000, stage: 'Proposal', probability: 60 },
          { id: 2, name: 'Consulting Package', value: 15000, stage: 'Qualified', probability: 40 },
        ])
      } finally { setLoading(false) }
    })()
  }, [id])

  const save = async () => { setSaving(true); try { await api.updateContact(id, contact) } catch {} finally { setSaving(false) } }
  const addNote = () => { if (!newNote.trim()) return; setActivities([{ id: Date.now(), type: 'note', text: newNote, time: 'Just now' }, ...activities]); setNewNote('') }

  const statusColor = (s) => ({ lead: 'bg-blue-100 text-blue-700', qualified: 'bg-purple-100 text-purple-700', customer: 'bg-green-100 text-green-700', negotiation: 'bg-yellow-100 text-yellow-700' }[s] || 'bg-slate-100 text-slate-700')
  const activityIcon = (t) => ({ email: <Mail className="w-4 h-4 text-blue-500" />, call: <Phone className="w-4 h-4 text-green-500" />, note: <MessageSquare className="w-4 h-4 text-purple-500" />, deal: <DollarSign className="w-4 h-4 text-yellow-500" /> }[t] || <Clock className="w-4 h-4 text-slate-500" />)

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard/contacts')} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"><ArrowLeft className="w-5 h-5" /></button>
          <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">{contact.name}</h1><p className="text-sm text-slate-500">{contact.email}</p></div>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(contact.status)}`}>{contact.status}</span>
        </div>
        <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm disabled:opacity-50"><Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Contact Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Name</label><input value={contact.name} onChange={e => setContact({...contact, name: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">Email</label><input value={contact.email} onChange={e => setContact({...contact, email: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">Phone</label><input value={contact.phone} onChange={e => setContact({...contact, phone: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">Company</label><input value={contact.company} onChange={e => setContact({...contact, company: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
            </div>
            <div><label className="block text-sm font-medium mb-1">Status</label><select value={contact.status} onChange={e => setContact({...contact, status: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"><option value="lead">Lead</option><option value="qualified">Qualified</option><option value="negotiation">Negotiation</option><option value="customer">Customer</option></select></div>
            <div><label className="block text-sm font-medium mb-1">Notes</label><textarea value={contact.notes} onChange={e => setContact({...contact, notes: e.target.value})} rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Activity Timeline</h2>
            <div className="flex gap-2 mb-4"><input value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Add a note..." className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /><button onClick={addNote} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700">Add</button></div>
            <div className="space-y-3">
              {activities.map(a => (
                <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  {activityIcon(a.type)}
                  <div className="flex-1"><p className="text-sm text-slate-900 dark:text-white">{a.text}</p><p className="text-xs text-slate-500">{a.time}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Tags</h2>
            <div className="flex gap-2 flex-wrap">{(contact.tags || []).map((t, i) => <span key={i} className="px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">{t}</span>)}</div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Deals</h2>
            <div className="space-y-3">
              {deals.map(d => (
                <div key={d.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <p className="font-medium text-sm text-slate-900 dark:text-white">{d.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-green-600">${d.value?.toLocaleString()}</span>
                    <span className="text-xs text-slate-500">{d.stage} ({d.probability}%)</span>
                  </div>
                </div>
              ))}
              {deals.length === 0 && <p className="text-sm text-slate-500">No deals yet</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
