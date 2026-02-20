import { useState } from 'react'
import { Plus, Search, BookOpen, Users, DollarSign, TrendingUp, Play, Edit, Eye, BarChart3, Clock, CheckCircle, Star, Award, GraduationCap, Video, FileText, Lock } from 'lucide-react'

const courses = [
  { id: 1, title: 'Complete Digital Marketing Masterclass', students: 1240, revenue: 368280, modules: 12, lessons: 86, duration: '42 hours', price: 297, status: 'published', rating: 4.8, completion: 68, image: '🎯' },
  { id: 2, title: 'Facebook Ads from Zero to Hero', students: 890, revenue: 88110, modules: 8, lessons: 45, duration: '18 hours', price: 99, status: 'published', rating: 4.6, completion: 72, image: '📱' },
  { id: 3, title: 'SEO Fundamentals', students: 2100, revenue: 62790, modules: 6, lessons: 32, duration: '12 hours', price: 49, status: 'published', rating: 4.5, completion: 81, image: '🔍' },
  { id: 4, title: 'Email Marketing Secrets', students: 650, revenue: 96850, modules: 10, lessons: 55, duration: '24 hours', price: 149, status: 'published', rating: 4.9, completion: 55, image: '📧' },
  { id: 5, title: 'Advanced Funnel Building', students: 0, revenue: 0, modules: 8, lessons: 0, duration: '0 hours', price: 497, status: 'draft', rating: 0, completion: 0, image: '🏗️' },
]

const students = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', courses: 3, progress: 78, lastActive: '2 hours ago', joined: '2023-10-15' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', courses: 2, progress: 45, lastActive: '1 day ago', joined: '2023-11-20' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', courses: 4, progress: 92, lastActive: '5 hours ago', joined: '2023-09-01' },
  { id: 4, name: 'David Brown', email: 'david@example.com', courses: 1, progress: 15, lastActive: '1 week ago', joined: '2024-01-05' },
  { id: 5, name: 'Eva Green', email: 'eva@example.com', courses: 2, progress: 60, lastActive: '3 hours ago', joined: '2023-12-10' },
]

export default function Courses() {
  const [tab, setTab] = useState('courses')
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)

  const totalStudents = courses.reduce((s, c) => s + c.students, 0)
  const totalRevenue = courses.reduce((s, c) => s + c.revenue, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Courses</h1>
          <p className="text-slate-500 dark:text-slate-400">Create and manage online courses</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Create Course</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: totalStudents.toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Course Revenue', value: `$${(totalRevenue/1000).toFixed(0)}K`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Active Courses', value: courses.filter(c => c.status === 'published').length, icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
          { label: 'Avg Completion', value: `${Math.round(courses.filter(c => c.completion > 0).reduce((s, c) => s + c.completion, 0) / courses.filter(c => c.completion > 0).length)}%`, icon: Award, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
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
        {['courses', 'students', 'certificates'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${tab === t ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{t}</button>
        ))}
      </div>

      {tab === 'courses' && (
        <div className="grid gap-4">
          {courses.map(c => (
            <div key={c.id} className="card p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedCourse(selectedCourse === c.id ? null : c.id)}>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-3xl flex-shrink-0">{c.image}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{c.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'}`}>{c.status}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-2">
                    <span>{c.modules} modules</span><span>•</span><span>{c.lessons} lessons</span><span>•</span><span>{c.duration}</span>
                    {c.rating > 0 && <><span>•</span><span className="flex items-center gap-0.5"><Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {c.rating}</span></>}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div><p className="text-xs text-slate-400">Students</p><p className="font-semibold text-slate-900 dark:text-white">{c.students.toLocaleString()}</p></div>
                    <div><p className="text-xs text-slate-400">Revenue</p><p className="font-semibold text-green-600">${c.revenue.toLocaleString()}</p></div>
                    <div><p className="text-xs text-slate-400">Completion</p>
                      <div className="flex items-center gap-2"><div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full"><div className="h-full bg-primary-500 rounded-full" style={{width: `${c.completion}%`}} /></div><span className="text-xs font-medium text-slate-600 dark:text-slate-400">{c.completion}%</span></div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-slate-900 dark:text-white">${c.price}</p>
                </div>
              </div>
              {selectedCourse === c.id && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Course Modules</h4>
                  <div className="space-y-2">
                    {['Introduction & Setup', 'Core Concepts', 'Advanced Strategies', 'Case Studies', 'Final Project'].slice(0, Math.min(c.modules, 5)).map((m, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                        <span className="text-sm text-slate-700 dark:text-slate-300 flex-1">{m}</span>
                        <span className="text-xs text-slate-400">{Math.floor(Math.random() * 8 + 3)} lessons</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="btn-primary text-sm flex items-center gap-1"><Edit className="w-3.5 h-3.5" /> Edit Course</button>
                    <button className="btn-secondary text-sm flex items-center gap-1"><BarChart3 className="w-3.5 h-3.5" /> Analytics</button>
                    <button className="btn-secondary text-sm flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Students</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'students' && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Student</th>
              <th className="text-center py-3 px-4 text-xs font-medium text-slate-500 uppercase">Courses</th>
              <th className="text-center py-3 px-4 text-xs font-medium text-slate-500 uppercase">Progress</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Last Active</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Joined</th>
            </tr></thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4"><p className="font-medium text-slate-900 dark:text-white">{s.name}</p><p className="text-xs text-slate-400">{s.email}</p></td>
                  <td className="py-3 px-4 text-center text-sm text-slate-600 dark:text-slate-400">{s.courses}</td>
                  <td className="py-3 px-4"><div className="flex items-center gap-2 justify-center"><div className="w-20 h-2 bg-slate-200 dark:bg-slate-700 rounded-full"><div className="h-full bg-primary-500 rounded-full" style={{width: `${s.progress}%`}} /></div><span className="text-xs font-medium text-slate-600 dark:text-slate-400">{s.progress}%</span></div></td>
                  <td className="py-3 px-4 text-sm text-slate-500">{s.lastActive}</td>
                  <td className="py-3 px-4 text-sm text-slate-500">{s.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'certificates' && (
        <div className="text-center py-12">
          <Award className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Course Certificates</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4">Create custom certificates for course completion</p>
          <button className="btn-primary">Create Certificate Template</button>
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create Course</h2>
              <button onClick={() => setShowCreate(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Course Title</label><input type="text" className="input w-full" placeholder="My Course" /></div>
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price</label><input type="number" className="input w-full" placeholder="0.00" /></div>
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label><textarea className="input w-full" rows={3} /></div>
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Access Type</label>
                <select className="input w-full"><option>One-time Purchase</option><option>Subscription</option><option>Free</option><option>Membership Required</option></select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreate(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={() => setShowCreate(false)} className="btn-primary flex-1">Create Course</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
