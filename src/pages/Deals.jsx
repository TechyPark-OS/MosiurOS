import { useState, useEffect } from 'react'
import { DollarSign, Plus, Search, X } from 'lucide-react'
import api from '../lib/api'

const STAGES = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost']
const STAGE_COLORS = { Lead: 'bg-blue-500', Qualified: 'bg-purple-500', Proposal: 'bg-yellow-500', Negotiation: 'bg-orange-500', Won: 'bg-green-500', Lost: 'bg-red-500' }

export default function Deals() {
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ name: '', value: '', contact: '', stage: 'Lead' })

  useEffect(() => { load() }, [])
  const load = async () => {
    try { const d = await api.getDeals(); setDeals(Array.isArray(d) ? d : d.deals || []) }
    catch { setDeals([
      { id: 1, name: 'Enterprise Plan', value: 50000, contact: 'Alice Johnson', stage: 'Proposal', probability: 60 },
      { id: 2, name: 'Consulting Package', value: 15000, contact: 'Bob Smith', stage: 'Qualified', probability: 40 },
      { id: 3, name: 'Annual License', value: 120000, contact: 'Carol White', stage: 'Negotiation', probability: 75 },
      { id: 4, name: 'Starter Plan', value: 5000, contact: 'David Brown', stage: 'Lead', probability: 20 },
      { id: 5, name: 'Premium Upgrade', value: 25000, contact: 'Eve Davis', stage: 'Won', probability: 100 },
      { id: 6, name: 'Basic Package', value: 8000, contact: 'Frank Miller', stage: 'Lost', probability: 0 },
      { id: 7, name: 'Custom Integration', value: 35000, contact: 'Grace Lee', stage: 'Proposal', probability: 50 },
    ]) } finally { setLoading(false) }
  }

  const create = async () => {
    try { await api.createDeal(form) } catch {}
    setDeals([...deals, { id: Date.now(), ...form, value: parseFloat(form.value) || 0, probability: 20 }])
    setShowCreate(false); setForm({ name: '', value: '', contact: '', stage: 'Lead' })
  }

  const moveToStage = (dealId, newStage) => {
    setDeals(deals.map(d => d.id === dealId ? { ...d, stage: newStage } : d))
  }

  const totalByStage = (stage) => deals.filter(d => d.stage === stage).reduce((a, d) => a + (d.value || 0), 0)

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Deals Pipeline</h1><p className="text-slate-500 text-sm mt-1">{deals.length} deals &middot; ${deals.reduce((a, d) => a + (d.value || 0), 0).toLocaleString()} total value</p></div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"><Plus className="w-4 h-4" /> New Deal</button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map(stage => (
          <div key={stage} className="min-w-[280px] flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${STAGE_COLORS[stage]}`} />
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{stage}</h3>
                <span className="text-xs text-slate-500">({deals.filter(d => d.stage === stage).length})</span>
              </div>
              <span className="text-xs font-medium text-slate-500">${totalByStage(stage).toLocaleString()}</span>
            </div>
            <div className="space-y-2 min-h-[200px] p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              {deals.filter(d => d.stage === stage).map(deal => (
                <div key={deal.id} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3 cursor-pointer hover:shadow-md transition-shadow">
                  <p className="font-medium text-sm text-slate-900 dark:text-white mb-1">{deal.name}</p>
                  <p className="text-xs text-slate-500 mb-2">{deal.contact}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-green-600">${deal.value?.toLocaleString()}</span>
                    <span className="text-xs text-slate-400">{deal.probability}%</span>
                  </div>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {STAGES.filter(s => s !== stage).map(s => (
                      <button key={s} onClick={() => moveToStage(deal.id, s)} className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-blue-100 hover:text-blue-600">{s}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showCreate && <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"><div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold">New Deal</h3><button onClick={() => setShowCreate(false)}><X className="w-5 h-5" /></button></div>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Deal Name</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Value ($)</label><input type="number" value={form.value} onChange={e => setForm({...form, value: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Contact</label><input value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Stage</label><select value={form.stage} onChange={e => setForm({...form, stage: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">{STAGES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
          <button onClick={create} className="w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm">Create Deal</button>
        </div>
      </div></div>}
    </div>
  )
}
