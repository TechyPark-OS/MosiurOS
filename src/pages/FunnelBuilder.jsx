import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, GripVertical, Trash2, Save, Eye, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import api from '../lib/api'

const STEP_TYPES = ['Opt-in', 'Sales Page', 'Upsell', 'Downsell', 'Order Form', 'Thank You', 'Webinar', 'Custom']

export default function FunnelBuilder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [funnel, setFunnel] = useState(null)
  const [steps, setSteps] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingStep, setEditingStep] = useState(null)

  useEffect(() => {
    loadFunnel()
  }, [id])

  const loadFunnel = async () => {
    try {
      const data = await api.getFunnel(id)
      setFunnel(data)
      setSteps(data.steps || [
        { id: 1, name: 'Opt-in Page', type: 'Opt-in', url: '/optin', status: 'published' },
        { id: 2, name: 'Sales Page', type: 'Sales Page', url: '/sales', status: 'published' },
        { id: 3, name: 'Order Form', type: 'Order Form', url: '/order', status: 'draft' },
        { id: 4, name: 'Thank You', type: 'Thank You', url: '/thank-you', status: 'published' },
      ])
    } catch (e) {
      setFunnel({ name: 'Sales Funnel', description: 'Default funnel' })
      setSteps([
        { id: 1, name: 'Opt-in Page', type: 'Opt-in', url: '/optin', status: 'published' },
        { id: 2, name: 'Sales Page', type: 'Sales Page', url: '/sales', status: 'published' },
        { id: 3, name: 'Order Form', type: 'Order Form', url: '/order', status: 'draft' },
        { id: 4, name: 'Thank You', type: 'Thank You', url: '/thank-you', status: 'published' },
      ])
    } finally { setLoading(false) }
  }

  const addStep = () => {
    const newStep = { id: Date.now(), name: 'New Step', type: 'Custom', url: '/new-step', status: 'draft' }
    setSteps([...steps, newStep])
    setEditingStep(newStep.id)
  }

  const removeStep = (stepId) => { setSteps(steps.filter(s => s.id !== stepId)) }

  const updateStep = (stepId, field, value) => {
    setSteps(steps.map(s => s.id === stepId ? { ...s, [field]: value } : s))
  }

  const moveStep = (index, direction) => {
    const newSteps = [...steps]
    const target = index + direction
    if (target < 0 || target >= newSteps.length) return
    ;[newSteps[index], newSteps[target]] = [newSteps[target], newSteps[index]]
    setSteps(newSteps)
  }

  const saveFunnel = async () => {
    setSaving(true)
    try { await api.updateFunnel(id, { ...funnel, steps }) } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard/funnels')} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{funnel?.name || 'Funnel Builder'}</h1>
            <p className="text-sm text-slate-500">{steps.length} steps</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm"><Eye className="w-4 h-4" /> Preview</button>
          <button onClick={saveFunnel} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm disabled:opacity-50"><Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>

      {/* Funnel Pipeline */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Funnel Steps</h2>
          <button onClick={addStep} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-sm"><Plus className="w-4 h-4" /> Add Step</button>
        </div>

        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
              <div className="flex flex-col gap-1 pt-1">
                <button onClick={() => moveStep(index, -1)} disabled={index === 0} className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
                <GripVertical className="w-4 h-4 text-slate-400 mx-auto" />
                <button onClick={() => moveStep(index, 1)} disabled={index === steps.length - 1} className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 text-xs font-bold">{index + 1}</span>
                  {editingStep === step.id ? (
                    <input value={step.name} onChange={(e) => updateStep(step.id, 'name', e.target.value)} onBlur={() => setEditingStep(null)} autoFocus className="flex-1 px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
                  ) : (
                    <span onClick={() => setEditingStep(step.id)} className="flex-1 font-medium text-slate-900 dark:text-white cursor-pointer hover:text-blue-600">{step.name}</span>
                  )}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${step.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>{step.status}</span>
                </div>
                <div className="flex items-center gap-4 ml-10">
                  <select value={step.type} onChange={(e) => updateStep(step.id, 'type', e.target.value)} className="px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs">
                    {STEP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <div className="flex items-center gap-1 text-xs text-slate-500"><ExternalLink className="w-3 h-3" /><span>{step.url}</span></div>
                </div>
              </div>

              <button onClick={() => removeStep(step.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>

        {steps.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <p className="text-lg font-medium mb-2">No steps yet</p>
            <p className="text-sm mb-4">Add your first funnel step to get started</p>
            <button onClick={addStep} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700">Add First Step</button>
          </div>
        )}
      </div>
    </div>
  )
}
