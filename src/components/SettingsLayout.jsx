import { Outlet, NavLink } from 'react-router-dom'
import { Settings, User, Shield, Bell, Palette, Key } from 'lucide-react'

const tabs = [
  { id: 'general', name: 'General', href: '/dashboard/settings/general', icon: Settings },
  { id: 'profile', name: 'Profile', href: '/dashboard/settings/profile', icon: User },
  { id: 'security', name: 'Security', href: '/dashboard/settings/security', icon: Shield },
  { id: 'notifications', name: 'Notifications', href: '/dashboard/settings/notifications', icon: Bell },
  { id: 'appearance', name: 'Appearance', href: '/dashboard/settings/appearance', icon: Palette },
  { id: 'api-keys', name: 'API Keys', href: '/dashboard/settings/api-keys', icon: Key },
]

export default function SettingsLayout() {
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
              <NavLink
                key={tab.id}
                to={tab.href}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`
                }
              >
                <tab.icon className="w-5 h-5" />
                {tab.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
