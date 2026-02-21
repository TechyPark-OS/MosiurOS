import { useState, useEffect } from 'react'
import { Save, Globe } from 'lucide-react'
import api from '../lib/api'

export default function General() {
  const [settings, setSettings] = useState({ site_name: 'TechyPark Engine', site_url: 'https://app.mosiur.com', timezone: 'UTC', language: 'en', date_format: 'YYYY-MM-DD', currency: 'USD' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { (async () => { try { const d = await api.getSettings(); if (d) setSettings(s => ({...s, ...d})) } catch {} })() }, [])

  const save = async () => { setSaving(true); try { await api.updateSettings(settings) } catch {} finally { setSaving(false) } }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">General Settings</h1><p className="text-slate-500 text-sm mt-1">Configure your platform settings</p></div>
        <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm disabled:opacity-50"><Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}</button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-6 max-w-2xl">
        <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Site Name</label><input value={settings.site_name} onChange={e => setSettings({...settings, site_name: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
        <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Site URL</label><div className="flex items-center gap-2"><Globe className="w-5 h-5 text-slate-400" /><input value={settings.site_url} onChange={e => setSettings({...settings, site_url: e.target.value})} className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Timezone</label><select value={settings.timezone} onChange={e => setSettings({...settings, timezone: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"><option value="UTC">UTC</option><option value="America/New_York">Eastern Time</option><option value="America/Chicago">Central Time</option><option value="America/Denver">Mountain Time</option><option value="America/Los_Angeles">Pacific Time</option><option value="Europe/London">London</option><option value="Asia/Tokyo">Tokyo</option></select></div>
          <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Language</label><select value={settings.language} onChange={e => setSettings({...settings, language: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"><option value="en">English</option><option value="es">Spanish</option><option value="fr">French</option><option value="de">German</option><option value="ja">Japanese</option></select></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date Format</label><select value={settings.date_format} onChange={e => setSettings({...settings, date_format: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"><option value="YYYY-MM-DD">2024-01-15</option><option value="MM/DD/YYYY">01/15/2024</option><option value="DD/MM/YYYY">15/01/2024</option><option value="MMM DD, YYYY">Jan 15, 2024</option></select></div>
          <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Currency</label><select value={settings.currency} onChange={e => setSettings({...settings, currency: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"><option value="USD">USD ($)</option><option value="EUR">EUR (€)</option><option value="GBP">GBP (£)</option><option value="JPY">JPY (¥)</option><option value="AUD">AUD (A$)</option></select></div>
        </div>
      </div>
    </div>
  )
}
