import { useState } from 'react'
import { Settings as SettingsIcon, User, Shield, Bell, Palette, Globe, Key, Save, Upload } from 'lucide-react'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general')

  const tabs = [
    { id: 'general', name: 'General', icon: SettingsIcon },
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'api', name: 'API Keys', icon: Key },
  ]

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
              
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">JD</span>
                </div>
                <button className="btn-secondary flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Upload Photo
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    First Name
                  </label>
                  <input type="text" className="input" defaultValue="John" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Last Name
                  </label>
                  <input type="text" className="input" defaultValue="Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Email
                  </label>
                  <input type="email" className="input" defaultValue="john@techypark.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Phone
                  </label>
                  <input type="tel" className="input" defaultValue="+1 555-0123" />
                </div>
              </div>

              <button className="btn-primary flex items-center gap-2">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card p-6 space-y-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Security Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Current Password
                  </label>
                  <input type="password" className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    New Password
                  </label>
                  <input type="password" className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Confirm New Password
                  </label>
                  <input type="password" className="input" />
                </div>
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

              <button className="btn-primary flex items-center gap-2">
                <Save className="w-4 h-4" /> Update Password
              </button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card p-6 space-y-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Notification Preferences</h2>
              
              <div className="space-y-4">
                {[
                  { title: 'Email Notifications', desc: 'Receive email alerts for important events' },
                  { title: 'Server Alerts', desc: 'Get notified when servers have issues' },
                  { title: 'Billing Reminders', desc: 'Receive payment and invoice notifications' },
                  { title: 'Security Alerts', desc: 'Get notified about security events' },
                  { title: 'Weekly Reports', desc: 'Receive weekly summary reports' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{item.title}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={index < 4} />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                ))}
              </div>

              <button className="btn-primary flex items-center gap-2">
                <Save className="w-4 h-4" /> Save Preferences
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
                {[
                  { name: 'Production API Key', key: 'sk_live_****************************1234', created: '2024-01-10' },
                  { name: 'Development API Key', key: 'sk_test_****************************5678', created: '2024-01-15' },
                ].map((apiKey, index) => (
                  <div key={index} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-slate-900 dark:text-white">{apiKey.name}</p>
                      <span className="text-sm text-slate-500">Created {apiKey.created}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 p-2 bg-slate-100 dark:bg-slate-600 rounded font-mono text-sm text-slate-600 dark:text-slate-300">
                        {apiKey.key}
                      </code>
                      <button className="btn-secondary text-sm">Copy</button>
                      <button className="btn-secondary text-sm text-red-500">Revoke</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Warning:</strong> Keep your API keys secure. Never share them publicly or commit them to version control.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
