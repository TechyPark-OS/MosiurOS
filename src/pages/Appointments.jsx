import { useState } from 'react'
import { Plus, Search, Calendar, Clock, Users, Video, MapPin, Phone, Mail, Edit, Trash2, CheckCircle, XCircle, ChevronLeft, ChevronRight, Filter } from 'lucide-react'

const appointments = [
  { id: 1, title: 'Strategy Call - Alice Johnson', type: 'video', date: '2024-01-15', time: '10:00 AM', duration: '30 min', status: 'confirmed', client: 'Alice Johnson', email: 'alice@example.com', notes: 'Discuss hosting migration plan' },
  { id: 2, title: 'Demo - Tech Solutions Inc', type: 'video', date: '2024-01-15', time: '2:00 PM', duration: '45 min', status: 'confirmed', client: 'Bob Smith', email: 'bob@techsolutions.com', notes: 'Product demo for enterprise plan' },
  { id: 3, title: 'Onboarding Call - Carol White', type: 'phone', date: '2024-01-16', time: '11:00 AM', duration: '30 min', status: 'pending', client: 'Carol White', email: 'carol@example.com', notes: 'New customer onboarding' },
  { id: 4, title: 'Support Review - David Brown', type: 'video', date: '2024-01-16', time: '3:00 PM', duration: '15 min', status: 'confirmed', client: 'David Brown', email: 'david@example.com', notes: 'Monthly support review' },
  { id: 5, title: 'Sales Call - Eva Green', type: 'phone', date: '2024-01-17', time: '9:00 AM', duration: '30 min', status: 'cancelled', client: 'Eva Green', email: 'eva@example.com', notes: 'Follow up on proposal' },
  { id: 6, title: 'Team Standup', type: 'video', date: '2024-01-17', time: '10:00 AM', duration: '15 min', status: 'confirmed', client: 'Internal', email: '', notes: 'Daily standup meeting' },
]

const calendarTypes = [
  { name: 'Strategy Call', duration: '30 min', price: 'Free', bookings: 45, color: 'bg-blue-500' },
  { name: 'Product Demo', duration: '45 min', price: 'Free', bookings: 28, color: 'bg-purple-500' },
  { name: 'Coaching Session', duration: '60 min', price: '$150', bookings: 12, color: 'bg-green-500' },
  { name: 'Quick Chat', duration: '15 min', price: 'Free', bookings: 89, color: 'bg-orange-500' },
]

const statusColors = { confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', completed: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400' }
const typeIcons = { video: Video, phone: Phone, 'in-person': MapPin }

export default function Appointments() {
  const [tab, setTab] = useState('upcoming')
  const [showCreate, setShowCreate] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Appointments</h1>
          <p className="text-slate-500 dark:text-slate-400">Schedule and manage meetings</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> New Appointment</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Today', value: 2, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'This Week', value: 6, icon: Clock, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Total Bookings', value: 174, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
          { label: 'Completion Rate', value: '92%', icon: CheckCircle, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
        ].map((s, i) => (
          <div key={i} className="card p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
              <div><p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p><p className="text-lg font-bold text-slate-900 dark:text-white">{s.value}</p></div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
        {['upcoming', 'calendar types', 'availability'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${tab === t ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{t}</button>
        ))}
      </div>

      {tab === 'upcoming' && (
        <div className="space-y-3">
          {appointments.map(a => {
            const TypeIcon = typeIcons[a.type] || Video
            return (
              <div key={a.id} className="card p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary-600">{a.date.split('-')[2]}</span>
                    <span className="text-[10px] text-primary-400">Jan</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{a.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[a.status]}`}>{a.status}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {a.time} ({a.duration})</span>
                      <span className="flex items-center gap-1"><TypeIcon className="w-3.5 h-3.5" /> {a.type}</span>
                      {a.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {a.email}</span>}
                    </div>
                    {a.notes && <p className="text-xs text-slate-400 mt-1">{a.notes}</p>}
                  </div>
                  <div className="flex gap-1">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Edit className="w-4 h-4 text-slate-400" /></button>
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Trash2 className="w-4 h-4 text-slate-400" /></button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {tab === 'calendar types' && (
        <div className="grid sm:grid-cols-2 gap-4">
          {calendarTypes.map((c, i) => (
            <div key={i} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-3 h-3 rounded-full ${c.color} mt-1.5`} />
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{c.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{c.duration} • {c.price}</p>
                </div>
                <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><Edit className="w-4 h-4 text-slate-400" /></button>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">{c.bookings} total bookings</span>
                <button className="text-primary-600 font-medium text-sm">Copy Link</button>
              </div>
            </div>
          ))}
          <div className="card p-5 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center cursor-pointer hover:border-primary-500 transition-colors">
            <div className="text-center"><Plus className="w-8 h-8 text-slate-400 mx-auto mb-2" /><p className="text-sm font-medium text-slate-500">Create Calendar Type</p></div>
          </div>
        </div>
      )}

      {tab === 'availability' && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Weekly Availability</h3>
          <div className="space-y-3">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, i) => (
              <div key={day} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div className="w-24"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">{day}</span></div>
                <div className="flex-1 flex items-center gap-2">
                  {i < 5 ? (
                    <>
                      <span className="text-sm text-slate-600 dark:text-slate-400">9:00 AM - 5:00 PM</span>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs">Available</span>
                    </>
                  ) : (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-slate-600 dark:text-slate-400 rounded-full text-xs">Unavailable</span>
                  )}
                </div>
                <button className="text-sm text-primary-600 font-medium">Edit</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">New Appointment</h2>
              <button onClick={() => setShowCreate(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label><input type="text" className="input w-full" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label><input type="date" className="input w-full" /></div>
                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Time</label><input type="time" className="input w-full" /></div>
              </div>
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label><select className="input w-full"><option>Video Call</option><option>Phone Call</option><option>In Person</option></select></div>
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Client Email</label><input type="email" className="input w-full" /></div>
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes</label><textarea className="input w-full" rows={2} /></div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreate(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={() => setShowCreate(false)} className="btn-primary flex-1">Schedule</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
