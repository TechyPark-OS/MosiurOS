import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Plus, Trash2, ChevronDown, ChevronRight, GripVertical, BookOpen, Video, FileText, Eye } from 'lucide-react'
import api from '../lib/api'

export default function CourseBuilder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState({ title: '', description: '', status: 'draft', price: '' })
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [expandedModule, setExpandedModule] = useState(null)

  useEffect(() => {
    (async () => {
      try { const d = await api.getCourse(id); setCourse(d); setModules(d.modules || []) }
      catch {
        setCourse({ title: 'Marketing Mastery', description: 'Learn digital marketing from scratch', status: 'draft', price: '197' })
        setModules([
          { id: 1, title: 'Getting Started', lessons: [
            { id: 1, title: 'Welcome & Overview', type: 'video', duration: '5:00', content: '' },
            { id: 2, title: 'Setting Up Your Account', type: 'video', duration: '8:30', content: '' },
          ]},
          { id: 2, title: 'Fundamentals', lessons: [
            { id: 3, title: 'Understanding Your Audience', type: 'video', duration: '12:00', content: '' },
            { id: 4, title: 'Market Research Guide', type: 'text', duration: '', content: '' },
          ]},
          { id: 3, title: 'Advanced Strategies', lessons: [
            { id: 5, title: 'Funnel Optimization', type: 'video', duration: '15:00', content: '' },
          ]},
        ])
      } finally { setLoading(false) }
    })()
  }, [id])

  const save = async () => { setSaving(true); try { await api.updateCourse(id, { ...course, modules }) } catch {} finally { setSaving(false) } }
  const addModule = () => { setModules([...modules, { id: Date.now(), title: 'New Module', lessons: [] }]) }
  const removeModule = (mid) => setModules(modules.filter(m => m.id !== mid))
  const addLesson = (mid) => { setModules(modules.map(m => m.id === mid ? { ...m, lessons: [...m.lessons, { id: Date.now(), title: 'New Lesson', type: 'video', duration: '', content: '' }] } : m)) }
  const removeLesson = (mid, lid) => { setModules(modules.map(m => m.id === mid ? { ...m, lessons: m.lessons.filter(l => l.id !== lid) } : m)) }
  const updateModule = (mid, field, value) => setModules(modules.map(m => m.id === mid ? { ...m, [field]: value } : m))
  const updateLesson = (mid, lid, field, value) => setModules(modules.map(m => m.id === mid ? { ...m, lessons: m.lessons.map(l => l.id === lid ? { ...l, [field]: value } : l) } : m))

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard/courses')} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"><ArrowLeft className="w-5 h-5" /></button>
          <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">{course.title || 'Course Builder'}</h1><p className="text-sm text-slate-500">{modules.length} modules, {modules.reduce((a, m) => a + m.lessons.length, 0)} lessons</p></div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${course.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{course.status}</span>
          <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm disabled:opacity-50"><Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {modules.map((mod, mi) => (
            <div key={mod.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/80 cursor-pointer" onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}>
                <GripVertical className="w-4 h-4 text-slate-400" />
                {expandedModule === mod.id ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                <input value={mod.title} onChange={e => updateModule(mod.id, 'title', e.target.value)} onClick={e => e.stopPropagation()} className="flex-1 font-medium text-slate-900 dark:text-white bg-transparent border-none outline-none" />
                <span className="text-xs text-slate-500">{mod.lessons.length} lessons</span>
                <button onClick={(e) => { e.stopPropagation(); removeModule(mod.id) }} className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="w-4 h-4 text-red-500" /></button>
              </div>
              {expandedModule === mod.id && (
                <div className="p-4 space-y-2">
                  {mod.lessons.map(lesson => (
                    <div key={lesson.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                      {lesson.type === 'video' ? <Video className="w-4 h-4 text-blue-500" /> : <FileText className="w-4 h-4 text-green-500" />}
                      <input value={lesson.title} onChange={e => updateLesson(mod.id, lesson.id, 'title', e.target.value)} className="flex-1 text-sm text-slate-900 dark:text-white bg-transparent border-none outline-none" />
                      <select value={lesson.type} onChange={e => updateLesson(mod.id, lesson.id, 'type', e.target.value)} className="px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs"><option value="video">Video</option><option value="text">Text</option></select>
                      <input value={lesson.duration} onChange={e => updateLesson(mod.id, lesson.id, 'duration', e.target.value)} placeholder="Duration" className="w-20 px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs" />
                      <button onClick={() => removeLesson(mod.id, lesson.id)} className="p-1 rounded hover:bg-red-50"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
                    </div>
                  ))}
                  <button onClick={() => addLesson(mod.id)} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-400 text-sm text-slate-500 hover:text-blue-600 w-full justify-center"><Plus className="w-4 h-4" /> Add Lesson</button>
                </div>
              )}
            </div>
          ))}
          <button onClick={addModule} className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-400 text-sm text-slate-500 hover:text-blue-600 w-full justify-center"><Plus className="w-4 h-4" /> Add Module</button>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Course Details</h2>
            <div><label className="block text-sm font-medium mb-1">Title</label><input value={course.title} onChange={e => setCourse({...course, title: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={course.description} onChange={e => setCourse({...course, description: e.target.value})} rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1">Price ($)</label><input type="number" value={course.price} onChange={e => setCourse({...course, price: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1">Status</label><select value={course.status} onChange={e => setCourse({...course, status: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"><option value="draft">Draft</option><option value="published">Published</option></select></div>
          </div>
        </div>
      </div>
    </div>
  )
}
