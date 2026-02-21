import { useState, useEffect } from 'react'
import { Save, User, Camera } from 'lucide-react'
import api from '../lib/api'

export default function Profile() {
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', bio: '', avatar_url: '', website: '', twitter: '', linkedin: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('techypark_user')
    if (stored) { try { const u = JSON.parse(stored); setProfile(p => ({...p, name: u.name || '', email: u.email || ''})) } catch {} }
  }, [])

  const save = async () => { setSaving(true); try { await api.updateProfile(profile) } catch {} finally { setSaving(false) } }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile Settings</h1><p className="text-slate-500 text-sm mt-1">Manage your personal information</p></div>
        <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm disabled:opacity-50"><Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}</button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 max-w-2xl">
        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center overflow-hidden">
              {profile.avatar_url ? <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" /> : <User className="w-10 h-10 text-blue-500" />}
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center"><Camera className="w-3.5 h-3.5" /></button>
          </div>
          <div><p className="font-medium text-slate-900 dark:text-white">{profile.name || 'Your Name'}</p><p className="text-sm text-slate-500">{profile.email}</p></div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Full Name</label><input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1">Email</label><input value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">Phone</label><input value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Bio</label><textarea value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Avatar URL</label><input value={profile.avatar_url} onChange={e => setProfile({...profile, avatar_url: e.target.value})} placeholder="https://..." className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
          <hr className="border-slate-200 dark:border-slate-700" />
          <h3 className="font-semibold text-slate-900 dark:text-white">Social Links</h3>
          <div><label className="block text-sm font-medium mb-1">Website</label><input value={profile.website} onChange={e => setProfile({...profile, website: e.target.value})} placeholder="https://..." className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Twitter</label><input value={profile.twitter} onChange={e => setProfile({...profile, twitter: e.target.value})} placeholder="@username" className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1">LinkedIn</label><input value={profile.linkedin} onChange={e => setProfile({...profile, linkedin: e.target.value})} placeholder="linkedin.com/in/..." className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" /></div>
          </div>
        </div>
      </div>
    </div>
  )
}
