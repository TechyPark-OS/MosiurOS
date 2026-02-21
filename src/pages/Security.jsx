import { useState } from 'react'
import { Shield, Key, Smartphone, Monitor, Save } from 'lucide-react'

export default function Security() {
  const [passwords, setPasswords] = useState({ current: '', new_password: '', confirm: '' })
  const [twoFactor, setTwoFactor] = useState(false)
  const [saving, setSaving] = useState(false)

  const sessions = [
    { id: 1, device: 'Chrome on macOS', ip: '192.168.1.100', location: 'New York, US', last_active: '2 minutes ago', current: true },
    { id: 2, device: 'Safari on iPhone', ip: '192.168.1.101', location: 'New York, US', last_active: '1 hour ago', current: false },
    { id: 3, device: 'Firefox on Windows', ip: '10.0.0.50', location: 'London, UK', last_active: '3 days ago', current: false },
  ]

  const loginHistory = [
    { date: '2024-01-15 10:30', ip: '192.168.1.100', device: 'Chrome', status: 'success' },
    { date: '2024-01-14 16:45', ip: '192.168.1.101', device: 'Safari', status: 'success' },
    { date: '2024-01-13 09:00', ip: '10.0.0.50', device: 'Firefox', status: 'success' },
    { date: '2024-01-12 22:15', ip: '203.0.113.50', device: 'Unknown', status: 'failed' },
  ]

  const changePassword = () => {
    if (passwords.new_password !== passwords.confirm) { alert('Passwords do not match'); return }
    setSaving(true); setTimeout(() => { setSaving(false); setPasswords({ current: '', new_password: '', confirm: '' }); alert('Password updated') }, 1000)
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Security Settings</h1><p className="text-slate-500 text-sm mt-1">Manage your account security</p></div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 max-w-2xl space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2"><Key className="w-5 h-5" /> Change Password</h2>
        <div><label className="block text-sm font-medium mb-1">Current Password</label><input type="password" value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
        <div><label className="block text-sm font-medium mb-1">New Password</label><input type="password" value={passwords.new_password} onChange={e => setPasswords({...passwords, new_password: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
        <div><label className="block text-sm font-medium mb-1">Confirm New Password</label><input type="password" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
        <button onClick={changePassword} disabled={saving} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm disabled:opacity-50">{saving ? 'Updating...' : 'Update Password'}</button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 max-w-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3"><Smartphone className="w-5 h-5 text-blue-500" /><div><h2 className="text-lg font-semibold text-slate-900 dark:text-white">Two-Factor Authentication</h2><p className="text-sm text-slate-500">Add an extra layer of security</p></div></div>
          <div className={`w-10 h-6 rounded-full transition-colors ${twoFactor ? 'bg-blue-600' : 'bg-slate-300'} relative cursor-pointer`} onClick={() => setTwoFactor(!twoFactor)}><div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${twoFactor ? 'translate-x-5' : 'translate-x-1'}`} /></div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 max-w-2xl">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4"><Monitor className="w-5 h-5" /> Active Sessions</h2>
        <div className="space-y-3">
          {sessions.map(s => (
            <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
              <div><p className="text-sm font-medium text-slate-900 dark:text-white">{s.device} {s.current && <span className="text-xs text-green-600">(Current)</span>}</p><p className="text-xs text-slate-500">{s.ip} &middot; {s.location} &middot; {s.last_active}</p></div>
              {!s.current && <button className="text-xs text-red-600 hover:underline">Revoke</button>}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 max-w-2xl">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4"><Shield className="w-5 h-5" /> Login History</h2>
        <div className="space-y-2">
          {loginHistory.map((l, i) => (
            <div key={i} className="flex items-center justify-between p-2 text-sm">
              <span className="text-slate-500">{l.date}</span><span className="text-slate-600 dark:text-slate-300">{l.device} ({l.ip})</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${l.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{l.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
