import { useState } from 'react'
import { Search, Save, Package } from 'lucide-react'

const MODULE_CATEGORIES = {
  'Infrastructure': ['Servers', 'Sites', 'Containers', 'App Store', 'DNS', 'Email', 'SSL', 'Firewall', 'Files', 'Databases', 'Backups', 'Monitoring', 'Alerts'],
  'Funnels & Pages': ['Funnels', 'Landing Pages', 'Page Builder'],
  'Ecommerce': ['Store', 'Products', 'Smart Checkout', 'Orders', 'Payments'],
  'Marketing': ['Email Marketing', 'Workflows', 'Campaigns', 'Countdown', 'A/B Testing', 'Email Templates', 'Short Links'],
  'CRM & Sales': ['Contacts', 'Deals', 'Opportunities', 'Tickets', 'Appointments', 'Message Hub'],
  'Content': ['Courses', 'Memberships', 'Blog', 'Community', 'Surveys', 'Customer Center'],
  'Analytics': ['Analytics', 'Revenue'],
  'Business': ['Affiliates', 'Invoices', 'Billing', 'Plans'],
  'Management': ['Users', 'Organizations', 'Settings', 'API Keys'],
}

export default function AdminModules() {
  const [modules, setModules] = useState(() => {
    const all = {}
    Object.values(MODULE_CATEGORIES).flat().forEach(m => { all[m] = true })
    return all
  })
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)

  const toggleModule = (name) => setModules({...modules, [name]: !modules[name]})
  const enableAll = () => { const all = {}; Object.values(MODULE_CATEGORIES).flat().forEach(m => { all[m] = true }); setModules(all) }
  const disableAll = () => { const all = {}; Object.values(MODULE_CATEGORIES).flat().forEach(m => { all[m] = false }); setModules(all) }
  const save = () => { setSaving(true); setTimeout(() => setSaving(false), 1000) }

  const totalModules = Object.keys(modules).length
  const enabledModules = Object.values(modules).filter(Boolean).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Module Management</h1><p className="text-slate-500 text-sm mt-1">{enabledModules} of {totalModules} modules enabled</p></div>
        <div className="flex items-center gap-3">
          <button onClick={enableAll} className="px-3 py-2 rounded-lg border border-green-300 text-green-600 hover:bg-green-50 text-sm">Enable All</button>
          <button onClick={disableAll} className="px-3 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 text-sm">Disable All</button>
          <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm disabled:opacity-50"><Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>

      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search modules..." className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm" /></div>

      <div className="space-y-6">
        {Object.entries(MODULE_CATEGORIES).map(([category, mods]) => {
          const filteredMods = mods.filter(m => m.toLowerCase().includes(search.toLowerCase()))
          if (filteredMods.length === 0) return null
          return (
            <div key={category} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{category}</h2>
                <span className="text-xs text-slate-500">{filteredMods.filter(m => modules[m]).length}/{filteredMods.length} enabled</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredMods.map(mod => (
                  <div key={mod} className={`flex items-center justify-between p-3 rounded-lg border ${modules[mod] ? 'border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800' : 'border-slate-200 bg-slate-50 dark:bg-slate-700/30 dark:border-slate-600'}`}>
                    <div className="flex items-center gap-2"><Package className={`w-4 h-4 ${modules[mod] ? 'text-green-600' : 'text-slate-400'}`} /><span className="text-sm font-medium text-slate-900 dark:text-white">{mod}</span></div>
                    <div className={`w-10 h-6 rounded-full transition-colors ${modules[mod] ? 'bg-green-500' : 'bg-slate-300'} relative cursor-pointer`} onClick={() => toggleModule(mod)}><div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${modules[mod] ? 'translate-x-5' : 'translate-x-1'}`} /></div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
