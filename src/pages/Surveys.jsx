import { useState } from 'react'
import { Plus, Search, ClipboardList, BarChart3, Users, CheckCircle, Eye, Edit, Trash2, Copy, ExternalLink, Clock, TrendingUp, Star } from 'lucide-react'

const surveys = [
  { id: 1, name: 'Customer Satisfaction Survey', status: 'active', responses: 456, views: 1200, completionRate: 38, avgTime: '3 min', created: '2024-01-10', questions: 8 },
  { id: 2, name: 'Product Feedback Form', status: 'active', responses: 234, views: 800, completionRate: 29, avgTime: '5 min', created: '2024-01-08', questions: 12 },
  { id: 3, name: 'Onboarding Experience', status: 'active', responses: 890, views: 2100, completionRate: 42, avgTime: '2 min', created: '2023-12-20', questions: 5 },
  { id: 4, name: 'Feature Request Poll', status: 'draft', responses: 0, views: 0, completionRate: 0, avgTime: '-', created: '2024-01-14', questions: 6 },
  { id: 5, name: 'Exit Survey', status: 'active', responses: 67, views: 150, completionRate: 45, avgTime: '4 min', created: '2024-01-05', questions: 10 },
]

const statusColors = { active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', draft: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400', closed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' }

const sampleResults = [
  { question: 'How satisfied are you with our product?', type: 'rating', data: [{ label: '5 Stars', value: 45 }, { label: '4 Stars', value: 30 }, { label: '3 Stars', value: 15 }, { label: '2 Stars', value: 7 }, { label: '1 Star', value: 3 }] },
  { question: 'Which feature do you use most?', type: 'choice', data: [{ label: 'Funnels', value: 35 }, { label: 'Email Marketing', value: 28 }, { label: 'Courses', value: 20 }, { label: 'E-commerce', value: 12 }, { label: 'Other', value: 5 }] },
  { question: 'Would you recommend us?', type: 'nps', data: [{ label: 'Promoters (9-10)', value: 62 }, { label: 'Passives (7-8)', value: 25 }, { label: 'Detractors (0-6)', value: 13 }] },
]

export default function Surveys() {
  const [tab, setTab] = useState('surveys')

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Surveys</h1>
          <p className="text-slate-500 dark:text-slate-400">Create surveys, collect feedback, and analyze responses</p>
        </div>
        <button className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Create Survey</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Surveys', value: surveys.filter(s => s.status === 'active').length, icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Total Responses', value: surveys.reduce((s, sv) => s + sv.responses, 0).toLocaleString(), icon: Users, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Avg Completion', value: '38%', icon: CheckCircle, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
          { label: 'NPS Score', value: '49', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
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
        {['surveys', 'results', 'templates'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${tab === t ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{t}</button>
        ))}
      </div>

      {tab === 'surveys' && (
        <div className="space-y-3">
          {surveys.map(s => (
            <div key={s.id} className="card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center"><ClipboardList className="w-5 h-5 text-primary-600" /></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{s.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[s.status]}`}>{s.status}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>{s.questions} questions</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {s.responses} responses</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {s.views} views</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {s.avgTime}</span>
                    <span>Completion: {s.completionRate}%</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><BarChart3 className="w-4 h-4 text-slate-400" /></button>
                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Copy className="w-4 h-4 text-slate-400" /></button>
                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Edit className="w-4 h-4 text-slate-400" /></button>
                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Trash2 className="w-4 h-4 text-slate-400" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'results' && (
        <div className="space-y-6">
          {sampleResults.map((r, i) => (
            <div key={i} className="card p-5">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">{r.question}</h3>
              <div className="space-y-2">
                {r.data.map((d, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 dark:text-slate-400 w-36">{d.label}</span>
                    <div className="flex-1 h-6 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                      <div className={`h-full rounded-lg flex items-center px-2 ${r.type === 'nps' ? (j === 0 ? 'bg-green-500' : j === 1 ? 'bg-yellow-500' : 'bg-red-500') : 'bg-primary-500'}`} style={{ width: `${d.value}%` }}>
                        <span className="text-xs font-medium text-white">{d.value}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'templates' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Customer Satisfaction', desc: 'Measure customer happiness', icon: '😊', questions: 8 },
            { name: 'Net Promoter Score', desc: 'Would they recommend you?', icon: '📊', questions: 3 },
            { name: 'Product Feedback', desc: 'Collect feature requests', icon: '💡', questions: 10 },
            { name: 'Exit Survey', desc: 'Why are they leaving?', icon: '👋', questions: 6 },
            { name: 'Event Feedback', desc: 'Post-event satisfaction', icon: '🎪', questions: 7 },
            { name: 'Employee Engagement', desc: 'Team satisfaction pulse', icon: '👥', questions: 12 },
          ].map((t, i) => (
            <div key={i} className="card p-5 hover:shadow-md transition-shadow cursor-pointer">
              <span className="text-3xl mb-3 block">{t.icon}</span>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{t.name}</h3>
              <p className="text-sm text-slate-500 mb-2">{t.desc}</p>
              <p className="text-xs text-slate-400">{t.questions} questions</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
