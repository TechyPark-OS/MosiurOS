import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Plus, Trash2, ChevronUp, ChevronDown, Play, Pause, Zap, GitBranch, Mail, Clock, Filter } from 'lucide-react'
import api from '../lib/api'

const STEP_TYPES = [
  { type: 'trigger', label: 'Trigger', icon: Zap, color: 'yellow' },
  { type: 'action', label: 'Action', icon: Play, color: 'blue' },
  { type: 'condition', label: 'Condition', icon: GitBranch, color: 'purple' },
  { type: 'delay', label: 'Delay', icon: Clock, color: 'orange' },
  { type: 'email', label: 'Send Email', icon: Mail, color: 'green' },
  { type: 'filter', label: 'Filter', icon: Filter, color: 'slate' },
]

export default function WorkflowBuilder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [workflow, setWorkflow] = useState({ name: '', description: '', status: 'inactive' })
  const [steps, setSteps] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showAddStep, setShowAddStep] = useState(false)

  useEffect(() => {
    (async () => {
      try { const d = await api.getWorkflow(id); setWorkflow(d); setSteps(d.steps || []) }
      catch {
        setWorkflow({ name: 'Welcome Automation', description: 'Onboard new subscribers', status: 'active' })
        setSteps([
          { id: 1, type: 'trigger', label: 'New Subscriber', config: { event: 'subscriber.created' } },
          { id: 2, type: 'delay', label: 'Wait 1 hour', config: { duration: 60, unit: 'minutes' } },
          { id: 3, type: 'email', label: 'Send Welcome Email', config: { template: 'welcome', subject: 'Welcome!' } },
          { id: 4, type: 'condition', label: 'Opened Email?', config: { field: 'email_opened', operator: 'equals', value: 'true' } },
          { id: 5, type: 'action', label: 'Tag as Engaged', config: { action: 'add_tag', tag: 'engaged' } },
        ])
      } finally { setLoading(false) }
    })()
  }, [id])

  const save = async () => { setSaving(true); try { await api.updateWorkflow(id, { ...workflow, steps }) } catch {} finally { setSaving(false) } }
  const addStep = (type) => { setSteps([...steps, { id: Date.now(), type, label: STEP_TYPES.find(s => s.type === type)?.label || 'Step', config: {} }]); setShowAddStep(false) }
  const removeStep = (stepId) => setSteps(steps.filter(s => s.id !== stepId))
  const moveStep = (i, dir) => { const n = [...steps]; const t = i + dir; if (t < 0 || t >= n.length) return; [n[i], n[t]] = [n[t], n[i]]; setSteps(n) }
  const toggleActive = () => setWorkflow({ ...workflow, status: workflow.status === 'active' ? 'inactive' : 'active' })

  const getStepColor = (type) => ({ trigger: 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20', action: 'border-blue-300 bg-blue-50 dark:bg-blue-900/20', condition: 'border-purple-300 bg-purple-50 dark:bg-purple-900/20', delay: 'border-orange-300 bg-orange-50 dark:bg-orange-900/20', email: 'border-green-300 bg-green-50 dark:bg-green-900/20', filter: 'border-slate-300 bg-slate-50 dark:bg-slate-700/50' }[type] || 'border-slate-300 bg-slate-50')
  const getIconColor = (type) => ({ trigger: 'text-yellow-600', action: 'text-blue-600', condition: 'text-purple-600', delay: 'text-orange-600', email: 'text-green-600', filter: 'text-slate-600' }[type] || 'text-slate-600')

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard/workflows')} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"><ArrowLeft className="w-5 h-5" /></button>
          <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">{workflow.name}</h1><p className="text-sm text-slate-500">{steps.length} steps</p></div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggleActive} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${workflow.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {workflow.status === 'active' ? <><Pause className="w-4 h-4" /> Active</> : <><Play className="w-4 h-4" /> Inactive</>}
          </button>
          <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm disabled:opacity-50"><Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {steps.map((step, i) => {
            const StepIcon = STEP_TYPES.find(s => s.type === step.type)?.icon || Zap
            return (
              <div key={step.id}>
                <div className={`flex items-center gap-3 p-4 rounded-xl border-2 ${getStepColor(step.type)} transition-colors`}>
                  <div className="flex flex-col gap-1">
                    <button onClick={() => moveStep(i, -1)} disabled={i === 0} className="p-0.5 rounded hover:bg-white/50 disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
                    <button onClick={() => moveStep(i, 1)} disabled={i === steps.length - 1} className="p-0.5 rounded hover:bg-white/50 disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
                  </div>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getIconColor(step.type)}`}><StepIcon className="w-5 h-5" /></div>
                  <div className="flex-1">
                    <input value={step.label} onChange={e => setSteps(steps.map(s => s.id === step.id ? {...s, label: e.target.value} : s))} className="font-medium text-slate-900 dark:text-white bg-transparent border-none outline-none w-full" />
                    <p className="text-xs text-slate-500 capitalize">{step.type}</p>
                  </div>
                  <button onClick={() => removeStep(step.id)} className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20"><Trash2 className="w-4 h-4 text-red-500" /></button>
                </div>
                {i < steps.length - 1 && <div className="flex justify-center py-1"><div className="w-0.5 h-6 bg-slate-300 dark:bg-slate-600" /></div>}
              </div>
            )
          })}

          <div className="flex justify-center pt-4">
            {showAddStep ? (
              <div className="grid grid-cols-3 gap-2 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                {STEP_TYPES.map(st => (
                  <button key={st.type} onClick={() => addStep(st.type)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white dark:hover:bg-slate-600 text-sm"><st.icon className={`w-4 h-4 ${getIconColor(st.type)}`} />{st.label}</button>
                ))}
              </div>
            ) : (
              <button onClick={() => setShowAddStep(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-400 text-sm text-slate-500 hover:text-blue-600"><Plus className="w-4 h-4" /> Add Step</button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
