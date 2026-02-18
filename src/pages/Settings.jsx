import { useState, useEffect, useRef } from 'react'
import { Settings as SettingsIcon, User, Shield, Bell, Palette, Key, Save, Upload, Camera, Check, X, Loader2 } from 'lucide-react'
import { useAuth } from '../App'

const API_URL = import.meta.env.VITE_API_URL || 'https://3000-i2koko878nh6heogpew1t-0dc26023.us2.manus.computer';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general')
  const { user, login } = useAuth()
  
  // Profile state
  const [profileName, setProfileName] = useState(user?.name || '')
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null)
  const [avatarFile, setAvatarFile] = useState(null)
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [profileError, setProfileError] = useState('')
  const fileInputRef = useRef(null)
  
  // Notification preferences state
  const [notifications, setNotifications] = useState({
    email_alerts: true,
    email_reports: true,
    email_marketing: false,
    push_alerts: true,
    push_updates: false
  })
  const [notifSaving, setNotifSaving] = useState(false)
  const [notifSuccess, setNotifSuccess] = useState(false)
  
  // Load user data
  useEffect(() => {
    if (user) {
      setProfileName(user.name || '')
      setAvatarPreview(user.avatar || null)
      if (user.notificationPreferences) {
        setNotifications(user.notificationPreferences)
      }
    }
  }, [user])

  const tabs = [
    { id: 'general', name: 'General', icon: SettingsIcon },
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'api', name: 'API Keys', icon: Key },
  ]

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProfileSave = async () => {
    setProfileSaving(true)
    setProfileError('')
    setProfileSuccess(false)
    
    try {
      const sessionToken = localStorage.getItem('techypark_session')
      
      // If there's a new avatar file, convert to base64
      let avatarData = avatarPreview
      if (avatarFile) {
        avatarData = avatarPreview // Already base64 from FileReader
      }
      
      const response = await fetch(`${API_URL}/api/auth/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`
        },
        body: JSON.stringify({
          name: profileName,
          avatar: avatarData
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile')
      }
      
      // Update auth context with new user data
      login({
        ...user,
        name: data.user.name,
        avatar: data.user.avatar
      })
      
      setProfileSuccess(true)
      setAvatarFile(null)
      
      setTimeout(() => setProfileSuccess(false), 3000)
      
    } catch (error) {
      console.error('Profile update error:', error)
      setProfileError(error.message)
    } finally {
      setProfileSaving(false)
    }
  }

  const handleNotificationSave = async () => {
    setNotifSaving(true)
    setNotifSuccess(false)
    
    try {
      const sessionToken = localStorage.getItem('techypark_session')
      
      const response = await fetch(`${API_URL}/api/auth/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`
        },
        body: JSON.stringify({
          notificationPreferences: notifications
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update preferences')
      }
      
      // Update auth context
      login({
        ...user,
        notificationPreferences: data.user.notificationPreferences
      })
      
      setNotifSuccess(true)
      setTimeout(() => setNotifSuccess(false), 3000)
      
    } catch (error) {
      console.error('Notification preferences update error:', error)
    } finally {
      setNotifSaving(false)
    }
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 shrink-0">
          <nav className="card p-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'general' && (
            <div className="card p-6 space-y-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">General Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Company Name
                  </label>
                  <input type="text" className="input" defaultValue="TechyPark" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Default Timezone
                  </label>
                  <select className="input">
                    <option>UTC</option>
                    <option>America/New_York</option>
                    <option>America/Los_Angeles</option>
                    <option>Europe/London</option>
                    <option>Asia/Tokyo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Default Language
                  </label>
                  <select className="input">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
              </div>

              <button className="btn-primary flex items-center gap-2">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="card p-6 space-y-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Profile Settings</h2>
              
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="Profile" 
                      className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center border-4 border-white dark:border-slate-700 shadow-lg">
                      <span className="text-white text-2xl font-bold">{getInitials(profileName || user?.name)}</span>
                    </div>
                  )}
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 hover:bg-primary-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*" 
                    onChange={handleAvatarChange}
                    className="hidden" 
                  />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-white">{user?.name || 'User'}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    {user?.provider === 'email' ? 'Signed in with Email' : 
                     user?.provider === 'google' ? 'Signed in with Google' : 
                     user?.provider === 'apple' ? 'Signed in with Apple' : 'Signed in'}
                  </p>
                </div>
              </div>

              {/* Profile Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Display Name
                  </label>
                  <input 
                    type="text" 
                    className="input" 
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="Enter your display name"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    This is how your name will appear across the platform
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    className="input bg-slate-50 dark:bg-slate-700/50" 
                    value={user?.email || ''} 
                    disabled 
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Email cannot be changed. Contact support if you need to update it.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Role
                  </label>
                  <input 
                    type="text" 
                    className="input bg-slate-50 dark:bg-slate-700/50" 
                    value={user?.role || 'User'} 
                    disabled 
                  />
                </div>
              </div>

              {/* Error/Success Messages */}
              {profileError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                  <X className="w-5 h-5" />
                  <span className="text-sm">{profileError}</span>
                </div>
              )}
              
              {profileSuccess && (
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg">
                  <Check className="w-5 h-5" />
                  <span className="text-sm">Profile updated successfully!</span>
                </div>
              )}

              <button 
                onClick={handleProfileSave}
                disabled={profileSaving}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {profileSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {profileSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card p-6 space-y-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Security Settings</h2>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  You're using passwordless authentication. Your account is secured with magic links sent to your email.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <h3 className="font-medium text-slate-900 dark:text-white mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Authenticator App</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Use an authenticator app for 2FA</p>
                  </div>
                  <button className="btn-secondary">Enable</button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <h3 className="font-medium text-slate-900 dark:text-white mb-4">Active Sessions</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Current Session</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">This device • Active now</p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded">Current</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card p-6 space-y-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Notification Preferences</h2>
              
              <div className="space-y-6">
                {/* Email Notifications */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wider">Email Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">Alert Emails</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Receive email alerts for server issues and security events</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={notifications.email_alerts}
                          onChange={(e) => setNotifications({...notifications, email_alerts: e.target.checked})}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary-500"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">Weekly Reports</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Receive weekly summary reports via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={notifications.email_reports}
                          onChange={(e) => setNotifications({...notifications, email_reports: e.target.checked})}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary-500"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">Marketing Emails</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Receive product updates and promotional content</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={notifications.email_marketing}
                          onChange={(e) => setNotifications({...notifications, email_marketing: e.target.checked})}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary-500"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Push Notifications */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wider">Push Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">Push Alerts</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Receive push notifications for critical alerts</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={notifications.push_alerts}
                          onChange={(e) => setNotifications({...notifications, push_alerts: e.target.checked})}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary-500"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">System Updates</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Get notified about system updates and maintenance</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={notifications.push_updates}
                          onChange={(e) => setNotifications({...notifications, push_updates: e.target.checked})}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {notifSuccess && (
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg">
                  <Check className="w-5 h-5" />
                  <span className="text-sm">Notification preferences saved!</span>
                </div>
              )}

              <button 
                onClick={handleNotificationSave}
                disabled={notifSaving}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {notifSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {notifSaving ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="card p-6 space-y-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Appearance</h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Theme
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {['Light', 'Dark', 'System'].map(theme => (
                    <button
                      key={theme}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        theme === 'Dark' 
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className={`w-full h-16 rounded mb-2 ${
                        theme === 'Light' ? 'bg-white border border-slate-200' :
                        theme === 'Dark' ? 'bg-slate-800' : 'bg-gradient-to-r from-white to-slate-800'
                      }`}></div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{theme}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Accent Color
                </label>
                <div className="flex gap-2">
                  {['#0066FF', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'].map(color => (
                    <button
                      key={color}
                      className={`w-10 h-10 rounded-lg ${color === '#0066FF' ? 'ring-2 ring-offset-2 ring-slate-400' : ''}`}
                      style={{ backgroundColor: color }}
                    ></button>
                  ))}
                </div>
              </div>

              <button className="btn-primary flex items-center gap-2">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="card p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">API Keys</h2>
                <button className="btn-primary text-sm">Generate New Key</button>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-900 dark:text-white">Production Key</span>
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded">Active</span>
                  </div>
                  <code className="text-sm text-slate-600 dark:text-slate-400">tp_live_••••••••••••••••</code>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Created on Jan 1, 2024</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-900 dark:text-white">Development Key</span>
                    <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded">Test</span>
                  </div>
                  <code className="text-sm text-slate-600 dark:text-slate-400">tp_test_••••••••••••••••</code>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Created on Jan 1, 2024</p>
                </div>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  <strong>Security Notice:</strong> Keep your API keys secure. Never expose them in client-side code or public repositories.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
