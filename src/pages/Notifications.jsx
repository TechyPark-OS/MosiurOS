import { useState } from 'react'
import { Bell, Save } from 'lucide-react'

export default function Notifications() {
  const [settings, setSettings] = useState({
    email_new_order: true, email_new_contact: true, email_ticket_update: true, email_campaign_complete: false,
    email_server_alert: true, email_billing: true, email_weekly_digest: true, email_product_updates: false,
    push_enabled: true, push_orders: true, push_tickets: true, push_alerts: true,
    digest: 'weekly',
  })
  const [saving, setSaving] = useState(false)

  const save = () => { setSaving(true); setTimeout(() => setSaving(false), 1000) }
  const Toggle = ({ checked, onChange }) => (
    <div className={`w-10 h-6 rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-slate-300'} relative cursor-pointer`} onClick={onChange}><div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`} /></div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notification Preferences</h1><p className="text-slate-500 text-sm mt-1">Choose what notifications you receive</p></div>
        <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm disabled:opacity-50"><Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}</button>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Email Notifications</h2>
          <div className="space-y-4">
            {[
              { key: 'email_new_order', label: 'New Orders', desc: 'Get notified when a new order is placed' },
              { key: 'email_new_contact', label: 'New Contacts', desc: 'When a new contact is added or signs up' },
              { key: 'email_ticket_update', label: 'Ticket Updates', desc: 'When a support ticket is updated' },
              { key: 'email_campaign_complete', label: 'Campaign Complete', desc: 'When an email campaign finishes sending' },
              { key: 'email_server_alert', label: 'Server Alerts', desc: 'Critical server alerts and warnings' },
              { key: 'email_billing', label: 'Billing', desc: 'Payment confirmations and billing updates' },
              { key: 'email_weekly_digest', label: 'Weekly Digest', desc: 'Weekly summary of your account activity' },
              { key: 'email_product_updates', label: 'Product Updates', desc: 'New features and platform updates' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between">
                <div><p className="text-sm font-medium text-slate-900 dark:text-white">{item.label}</p><p className="text-xs text-slate-500">{item.desc}</p></div>
                <Toggle checked={settings[item.key]} onChange={() => setSettings({...settings, [item.key]: !settings[item.key]})} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Push Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between"><div><p className="text-sm font-medium text-slate-900 dark:text-white">Enable Push Notifications</p><p className="text-xs text-slate-500">Receive browser push notifications</p></div><Toggle checked={settings.push_enabled} onChange={() => setSettings({...settings, push_enabled: !settings.push_enabled})} /></div>
            {settings.push_enabled && <>
              <div className="flex items-center justify-between"><div><p className="text-sm font-medium">Orders</p></div><Toggle checked={settings.push_orders} onChange={() => setSettings({...settings, push_orders: !settings.push_orders})} /></div>
              <div className="flex items-center justify-between"><div><p className="text-sm font-medium">Tickets</p></div><Toggle checked={settings.push_tickets} onChange={() => setSettings({...settings, push_tickets: !settings.push_tickets})} /></div>
              <div className="flex items-center justify-between"><div><p className="text-sm font-medium">Server Alerts</p></div><Toggle checked={settings.push_alerts} onChange={() => setSettings({...settings, push_alerts: !settings.push_alerts})} /></div>
            </>}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Digest Frequency</h2>
          <div className="flex gap-3">{['daily', 'weekly', 'monthly', 'never'].map(f => <button key={f} onClick={() => setSettings({...settings, digest: f})} className={`px-4 py-2 rounded-lg text-sm capitalize ${settings.digest === f ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>{f}</button>)}</div>
        </div>
      </div>
    </div>
  )
}
