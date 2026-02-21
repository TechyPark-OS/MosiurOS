import { useState, useEffect } from 'react'
import { Check, Star, Zap, Crown } from 'lucide-react'
import api from '../lib/api'

const PLANS = [
  { id: 'starter', name: 'Starter', price: 97, icon: Zap, color: 'blue', features: ['5 Funnels', '20 Pages', '10,000 Contacts', 'Email Marketing', 'Basic Analytics', 'Community Support'] },
  { id: 'professional', name: 'Professional', price: 997, icon: Star, color: 'purple', popular: true, features: ['Unlimited Funnels', 'Unlimited Pages', '100,000 Contacts', 'Advanced Email Marketing', 'Workflows & Automation', 'A/B Testing', 'Priority Support', 'Custom Domains', 'API Access'] },
  { id: 'premium', name: 'Premium Pro', price: 4997, icon: Crown, color: 'amber', features: ['Everything in Professional', 'Unlimited Contacts', 'Dedicated Account Manager', 'White-label Branding', 'Custom Integrations', 'SLA Guarantee', 'Phone Support', 'Managed Services'] },
]

export default function Plans() {
  const [currentPlan, setCurrentPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [billing, setBilling] = useState('monthly')

  useEffect(() => {
    (async () => {
      try { const d = await api.getSubscription(); setCurrentPlan(d?.plan || 'starter') }
      catch { setCurrentPlan('starter') }
      finally { setLoading(false) }
    })()
  }, [])

  const handleUpgrade = async (planId) => {
    if (planId === currentPlan) return
    if (!confirm(`Switch to ${PLANS.find(p => p.id === planId)?.name} plan?`)) return
    try { await api.updateSubscription({ plan: planId }) } catch {}
    setCurrentPlan(planId)
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Subscription Plans</h1>
        <p className="text-slate-500 text-sm mt-1">Choose the plan that fits your business</p>
        <div className="flex items-center justify-center gap-3 mt-4">
          <button onClick={() => setBilling('monthly')} className={`px-4 py-2 rounded-lg text-sm ${billing === 'monthly' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}>Monthly</button>
          <button onClick={() => setBilling('annual')} className={`px-4 py-2 rounded-lg text-sm ${billing === 'annual' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}>Annual (Save 20%)</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {PLANS.map(plan => {
          const price = billing === 'annual' ? Math.round(plan.price * 0.8) : plan.price
          const isCurrent = currentPlan === plan.id
          return (
            <div key={plan.id} className={`bg-white dark:bg-slate-800 rounded-xl border-2 p-6 relative ${plan.popular ? 'border-purple-500 shadow-lg' : 'border-slate-200 dark:border-slate-700'} ${isCurrent ? 'ring-2 ring-blue-500' : ''}`}>
              {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-purple-500 text-white text-xs font-medium">Most Popular</div>}
              {isCurrent && <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-blue-500 text-white text-xs font-medium">Current Plan</div>}
              <div className="text-center mb-6">
                <plan.icon className={`w-10 h-10 mx-auto mb-3 text-${plan.color}-500`} />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                <div className="mt-2"><span className="text-4xl font-bold text-slate-900 dark:text-white">${price}</span><span className="text-slate-500">/mo</span></div>
                {billing === 'annual' && <p className="text-xs text-green-600 mt-1">Save ${(plan.price - price) * 12}/year</p>}
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((f, i) => <li key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><Check className="w-4 h-4 text-green-500 flex-shrink-0" />{f}</li>)}
              </ul>
              <button onClick={() => handleUpgrade(plan.id)} disabled={isCurrent} className={`w-full py-2.5 rounded-lg text-sm font-medium ${isCurrent ? 'bg-slate-100 dark:bg-slate-700 text-slate-500 cursor-default' : plan.popular ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                {isCurrent ? 'Current Plan' : currentPlan && PLANS.findIndex(p => p.id === plan.id) < PLANS.findIndex(p => p.id === currentPlan) ? 'Downgrade' : 'Upgrade'}
              </button>
            </div>
          )
        })}
      </div>

      <div className="text-center text-sm text-slate-500">
        <p>All plans include a 14-day free trial. Cancel anytime.</p>
      </div>
    </div>
  )
}
