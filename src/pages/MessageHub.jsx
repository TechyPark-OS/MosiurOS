import { useState } from 'react'
import { Search, Mail, MessageSquare, Phone, Send, Paperclip, Star, Archive, Trash2, MoreVertical, Clock, CheckCheck, User, Filter } from 'lucide-react'

const conversations = [
  { id: 1, name: 'Alice Johnson', avatar: 'AJ', channel: 'email', lastMessage: 'Thanks for the quick response! I\'ll review the proposal and get back to you.', time: '2 min ago', unread: true, starred: true },
  { id: 2, name: 'Bob Smith', avatar: 'BS', channel: 'sms', lastMessage: 'Can we schedule a call for tomorrow?', time: '15 min ago', unread: true, starred: false },
  { id: 3, name: 'Carol White', avatar: 'CW', channel: 'chat', lastMessage: 'The new funnel is performing great! Conversion rate is up 25%.', time: '1 hour ago', unread: false, starred: false },
  { id: 4, name: 'David Brown', avatar: 'DB', channel: 'email', lastMessage: 'I need help with my account settings. Can you assist?', time: '2 hours ago', unread: false, starred: true },
  { id: 5, name: 'Eva Green', avatar: 'EG', channel: 'chat', lastMessage: 'When is the next webinar scheduled?', time: '3 hours ago', unread: false, starred: false },
  { id: 6, name: 'Frank Lee', avatar: 'FL', channel: 'sms', lastMessage: 'Got it, thanks!', time: '5 hours ago', unread: false, starred: false },
  { id: 7, name: 'Grace Kim', avatar: 'GK', channel: 'email', lastMessage: 'Please find attached the updated contract for your review.', time: '1 day ago', unread: false, starred: false },
]

const messages = [
  { id: 1, sender: 'Alice Johnson', isMe: false, text: 'Hi! I\'m interested in upgrading to the Pro plan. Can you tell me more about the features?', time: '10:30 AM' },
  { id: 2, sender: 'You', isMe: true, text: 'Of course! The Pro plan includes unlimited funnels, advanced analytics, A/B testing, and priority support. It\'s $79/month.', time: '10:32 AM' },
  { id: 3, sender: 'Alice Johnson', isMe: false, text: 'That sounds great! Does it include the email marketing automation as well?', time: '10:35 AM' },
  { id: 4, sender: 'You', isMe: true, text: 'Yes! You get full email marketing automation with up to 25,000 contacts, including drip campaigns, segmentation, and broadcast emails.', time: '10:37 AM' },
  { id: 5, sender: 'Alice Johnson', isMe: false, text: 'Thanks for the quick response! I\'ll review the proposal and get back to you.', time: '10:40 AM' },
]

const channelIcons = { email: Mail, sms: MessageSquare, chat: Phone }
const channelColors = { email: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400', sms: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400', chat: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' }

export default function MessageHub() {
  const [selectedConvo, setSelectedConvo] = useState(conversations[0])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [newMessage, setNewMessage] = useState('')

  const filtered = conversations.filter(c => {
    if (filter !== 'all' && c.channel !== filter) return false
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="flex h-[calc(100vh-120px)] gap-0 -m-6">
      {/* Conversation List */}
      <div className="w-80 border-r border-slate-200 dark:border-slate-700 flex flex-col bg-white dark:bg-slate-900">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <h1 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Messages</h1>
          <div className="relative mb-2"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="input pl-9 w-full text-sm" /></div>
          <div className="flex gap-1">
            {['all', 'email', 'sms', 'chat'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-2 py-1 text-xs rounded-lg capitalize ${filter === f ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>{f}</button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map(c => {
            const ChannelIcon = channelIcons[c.channel]
            return (
              <div key={c.id} onClick={() => setSelectedConvo(c)} className={`p-3 border-b border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 ${selectedConvo?.id === c.id ? 'bg-primary-50 dark:bg-primary-900/10' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-sm font-bold text-primary-600">{c.avatar}</div>
                    {c.unread && <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-primary-500 rounded-full border-2 border-white dark:border-slate-900" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-sm ${c.unread ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>{c.name}</span>
                      <span className="text-[10px] text-slate-400">{c.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`p-0.5 rounded ${channelColors[c.channel]}`}><ChannelIcon className="w-2.5 h-2.5" /></span>
                      <p className={`text-xs truncate ${c.unread ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'}`}>{c.lastMessage}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Message Thread */}
      <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-800/50">
        {selectedConvo ? (
          <>
            <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-sm font-bold text-primary-600">{selectedConvo.avatar}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-white">{selectedConvo.name}</h3>
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${channelColors[selectedConvo.channel]}`}>
                  {(() => { const Icon = channelIcons[selectedConvo.channel]; return <Icon className="w-2.5 h-2.5" /> })()}
                  {selectedConvo.channel}
                </span>
              </div>
              <div className="flex gap-1">
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Star className={`w-4 h-4 ${selectedConvo.starred ? 'text-yellow-500 fill-yellow-500' : 'text-slate-400'}`} /></button>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Archive className="w-4 h-4 text-slate-400" /></button>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><MoreVertical className="w-4 h-4 text-slate-400" /></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${m.isMe ? 'bg-primary-500 text-white' : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white'}`}>
                    <p className="text-sm leading-relaxed">{m.text}</p>
                    <div className={`flex items-center gap-1 mt-1 ${m.isMe ? 'justify-end' : ''}`}>
                      <span className={`text-[10px] ${m.isMe ? 'text-primary-200' : 'text-slate-400'}`}>{m.time}</span>
                      {m.isMe && <CheckCheck className="w-3 h-3 text-primary-200" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Paperclip className="w-5 h-5 text-slate-400" /></button>
                <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type a message..." className="input flex-1" onKeyDown={e => e.key === 'Enter' && setNewMessage('')} />
                <button onClick={() => setNewMessage('')} className="p-2 bg-primary-500 hover:bg-primary-600 rounded-lg"><Send className="w-5 h-5 text-white" /></button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            <div className="text-center"><MessageSquare className="w-12 h-12 mx-auto mb-2" /><p>Select a conversation</p></div>
          </div>
        )}
      </div>
    </div>
  )
}
