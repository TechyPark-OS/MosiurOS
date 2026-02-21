import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, Clock, User } from 'lucide-react'
import api from '../lib/api'

export default function TicketDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ticket, setTicket] = useState({ subject: '', requester: '', status: 'open', priority: 'medium', assignee: '', description: '' })
  const [messages, setMessages] = useState([])
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try { const d = await api.getTicket(id); setTicket(d); setMessages(d.messages || []) }
      catch {
        setTicket({ subject: 'Cannot access dashboard', requester: 'alice@example.com', status: 'open', priority: 'high', assignee: 'Support Team', description: 'I am unable to log into my dashboard since this morning.' })
        setMessages([
          { id: 1, sender: 'alice@example.com', type: 'customer', text: 'I am unable to log into my dashboard since this morning. I keep getting a 500 error.', time: '2024-01-15 10:30' },
          { id: 2, sender: 'Support Team', type: 'agent', text: 'Thank you for reporting this. We are looking into the issue now. Could you please try clearing your browser cache?', time: '2024-01-15 10:45' },
          { id: 3, sender: 'alice@example.com', type: 'customer', text: 'I tried clearing the cache but the issue persists.', time: '2024-01-15 11:00' },
        ])
      } finally { setLoading(false) }
    })()
  }, [id])

  const sendReply = () => {
    if (!reply.trim()) return
    setMessages([...messages, { id: Date.now(), sender: 'Support Team', type: 'agent', text: reply, time: new Date().toISOString().slice(0, 16).replace('T', ' ') }])
    setReply('')
  }

  const updateStatus = (status) => { setTicket({ ...ticket, status }); try { api.updateTicket(id, { status }) } catch {} }

  const statusColor = (s) => ({ open: 'bg-blue-100 text-blue-700', pending: 'bg-yellow-100 text-yellow-700', resolved: 'bg-green-100 text-green-700', closed: 'bg-slate-100 text-slate-600' }[s] || 'bg-slate-100 text-slate-600')

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/dashboard/tickets')} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"><ArrowLeft className="w-5 h-5" /></button>
        <div className="flex-1"><h1 className="text-2xl font-bold text-slate-900 dark:text-white">#{id} - {ticket.subject}</h1><p className="text-sm text-slate-500">{ticket.requester}</p></div>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(ticket.status)}`}>{ticket.status}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto">
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-3 ${msg.type === 'agent' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.type === 'agent' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}><User className="w-4 h-4" /></div>
                  <div className={`max-w-[70%] p-3 rounded-xl ${msg.type === 'agent' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-slate-50 dark:bg-slate-700/50'}`}>
                    <p className="text-xs font-medium text-slate-500 mb-1">{msg.sender}</p>
                    <p className="text-sm text-slate-900 dark:text-white">{msg.text}</p>
                    <p className="text-xs text-slate-400 mt-1">{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 border-t border-slate-200 dark:border-slate-700 pt-4">
              <textarea value={reply} onChange={e => setReply(e.target.value)} placeholder="Type your reply..." rows={2} className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm resize-none" />
              <button onClick={sendReply} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 self-end"><Send className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Details</h3>
            <div><label className="block text-xs text-slate-500 mb-1">Status</label><select value={ticket.status} onChange={e => updateStatus(e.target.value)} className="w-full px-2 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"><option value="open">Open</option><option value="pending">Pending</option><option value="resolved">Resolved</option><option value="closed">Closed</option></select></div>
            <div><label className="block text-xs text-slate-500 mb-1">Priority</label><select value={ticket.priority} onChange={e => setTicket({...ticket, priority: e.target.value})} className="w-full px-2 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option></select></div>
            <div><label className="block text-xs text-slate-500 mb-1">Assignee</label><input value={ticket.assignee} onChange={e => setTicket({...ticket, assignee: e.target.value})} className="w-full px-2 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
          </div>
        </div>
      </div>
    </div>
  )
}
