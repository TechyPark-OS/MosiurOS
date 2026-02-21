import { useState } from 'react'
import { Sun, Moon, Monitor, Save, Palette } from 'lucide-react'

export default function Appearance() {
  const [settings, setSettings] = useState({ theme: 'light', accent: '#2563eb', sidebar: 'left', compact: false, font_size: 'medium' })
  const [saving, setSaving] = useState(false)

  const save = () => { setSaving(true); setTimeout(() => setSaving(false), 1000) }

  const themes = [
    { id: 'light', label: 'Light', icon: Sun, preview: 'bg-white border-slate-200' },
    { id: 'dark', label: 'Dark', icon: Moon, preview: 'bg-slate-900 border-slate-700' },
    { id: 'system', label: 'System', icon: Monitor, preview: 'bg-gradient-to-r from-white to-slate-900 border-slate-400' },
  ]

  const accents = ['#2563eb', '#7c3aed', '#059669', '#dc2626', '#ea580c', '#0891b2', '#4f46e5', '#be185d']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Appearance</h1><p className="text-slate-500 text-sm mt-1">Customize the look and feel</p></div>
        <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm disabled:opacity-50"><Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}</button>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Theme</h2>
          <div className="grid grid-cols-3 gap-4">
            {themes.map(t => (
              <button key={t.id} onClick={() => setSettings({...settings, theme: t.id})} className={`p-4 rounded-xl border-2 transition-colors ${settings.theme === t.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}>
                <div className={`w-full h-16 rounded-lg mb-3 border ${t.preview}`} />
                <div className="flex items-center gap-2 justify-center"><t.icon className="w-4 h-4" /><span className="text-sm font-medium">{t.label}</span></div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Palette className="w-5 h-5" /> Accent Color</h2>
          <div className="flex gap-3 flex-wrap">
            {accents.map(c => (
              <button key={c} onClick={() => setSettings({...settings, accent: c})} className={`w-10 h-10 rounded-full border-2 transition-transform ${settings.accent === c ? 'border-slate-900 dark:border-white scale-110' : 'border-transparent hover:scale-105'}`} style={{ backgroundColor: c }} />
            ))}
            <div className="flex items-center gap-2 ml-2"><input type="color" value={settings.accent} onChange={e => setSettings({...settings, accent: e.target.value})} className="w-10 h-10 rounded-full border-0 cursor-pointer" /><span className="text-sm text-slate-500">Custom</span></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Layout</h2>
          <div className="flex items-center justify-between"><div><p className="text-sm font-medium text-slate-900 dark:text-white">Sidebar Position</p><p className="text-xs text-slate-500">Choose which side the navigation appears</p></div>
            <div className="flex gap-2">{['left', 'right'].map(s => <button key={s} onClick={() => setSettings({...settings, sidebar: s})} className={`px-3 py-1.5 rounded-lg text-sm capitalize ${settings.sidebar === s ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600'}`}>{s}</button>)}</div>
          </div>
          <div className="flex items-center justify-between"><div><p className="text-sm font-medium text-slate-900 dark:text-white">Compact Mode</p><p className="text-xs text-slate-500">Reduce spacing for more content</p></div>
            <div className={`w-10 h-6 rounded-full transition-colors ${settings.compact ? 'bg-blue-600' : 'bg-slate-300'} relative cursor-pointer`} onClick={() => setSettings({...settings, compact: !settings.compact})}><div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${settings.compact ? 'translate-x-5' : 'translate-x-1'}`} /></div>
          </div>
          <div className="flex items-center justify-between"><div><p className="text-sm font-medium text-slate-900 dark:text-white">Font Size</p><p className="text-xs text-slate-500">Adjust the base font size</p></div>
            <div className="flex gap-2">{['small', 'medium', 'large'].map(s => <button key={s} onClick={() => setSettings({...settings, font_size: s})} className={`px-3 py-1.5 rounded-lg text-sm capitalize ${settings.font_size === s ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600'}`}>{s}</button>)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
