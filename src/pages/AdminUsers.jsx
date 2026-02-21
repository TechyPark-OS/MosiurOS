import { useState, useEffect } from 'react'
import { Users, Search, Shield, Eye, Ban, CheckCircle, X } from 'lucide-react'
import api from '../lib/api'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editUser, setEditUser] = useState(null)

  useEffect(() => { load() }, [])
  const load = async () => {
    try { const d = await api.getAdminUsers(); setUsers(Array.isArray(d) ? d : d.users || []) }
    catch { setUsers([
      { id: 1, name: 'Mosiur Rahman', email: 'mosiur@beverlyhillspublishing.com', role: 'Admin', plan: 'Premium Pro', status: 'active', last_login: '2024-01-15 10:30', created: '2024-01-01' },
      { id: 2, name: 'Alice Johnson', email: 'alice@example.com', role: 'User', plan: 'Professional', status: 'active', last_login: '2024-01-15 09:15', created: '2024-01-05' },
      { id: 3, name: 'Bob Smith', email: 'bob@example.com', role: 'User', plan: 'Starter', status: 'active', last_login: '2024-01-14 16:45', created: '2024-01-08' },
      { id: 4, name: 'Carol White', email: 'carol@example.com', role: 'User', plan: 'Professional', status: 'suspended', last_login: '2024-01-10 11:00', created: '2024-01-03' },
      { id: 5, name: 'David Brown', email: 'david@example.com', role: 'User', plan: 'Starter', status: 'trial', last_login: '2024-01-15 08:00', created: '2024-01-12' },
    ]) } finally { setLoading(false) }
  }

  const impersonate = (user) => { if (confirm(`Impersonate ${user.name}? You will see the platform as this user.`)) { localStorage.setItem('impersonating', JSON.stringify(user)); alert(`Now impersonating ${user.name}. Refresh to see changes.`) } }
  const toggleStatus = (userId) => { setUsers(users.map(u => u.id === userId ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u)) }
  const updateRole = (userId, role) => { setUsers(users.map(u => u.id === userId ? { ...u, role } : u)); try { api.updateUserRole(userId, role) } catch {} }

  const statusColor = (s) => ({ active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', suspended: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', trial: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' }[s] || 'bg-slate-100 text-slate-600')
  const filtered = users.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h1><p className="text-slate-500 text-sm mt-1">{users.length} total users</p></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"><p className="text-xs text-slate-500">Total Users</p><p className="text-2xl font-bold text-slate-900 dark:text-white">{users.length}</p></div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"><p className="text-xs text-slate-500">Active</p><p className="text-2xl font-bold text-green-600">{users.filter(u => u.status === 'active').length}</p></div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"><p className="text-xs text-slate-500">On Trial</p><p className="text-2xl font-bold text-blue-600">{users.filter(u => u.status === 'trial').length}</p></div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"><p className="text-xs text-slate-500">Suspended</p><p className="text-2xl font-bold text-red-600">{users.filter(u => u.status === 'suspended').length}</p></div>
      </div>

      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm" /></div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full"><thead><tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">User</th>
          <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Role</th>
          <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Plan</th>
          <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
          <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Last Login</th>
          <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">Actions</th>
        </tr></thead><tbody>
          {filtered.map(user => (
            <tr key={user.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30">
              <td className="px-4 py-3"><div><p className="font-medium text-sm text-slate-900 dark:text-white">{user.name}</p><p className="text-xs text-slate-500">{user.email}</p></div></td>
              <td className="px-4 py-3"><select value={user.role} onChange={e => updateRole(user.id, e.target.value)} className="px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs"><option value="Admin">Admin</option><option value="User">User</option><option value="Reseller">Reseller</option></select></td>
              <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{user.plan}</td>
              <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(user.status)}`}>{user.status}</span></td>
              <td className="px-4 py-3 text-sm text-slate-500">{user.last_login}</td>
              <td className="px-4 py-3 text-right"><div className="flex items-center justify-end gap-1">
                <button onClick={() => impersonate(user)} title="Impersonate" className="p-1.5 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"><Eye className="w-4 h-4 text-blue-500" /></button>
                <button onClick={() => toggleStatus(user.id)} title={user.status === 'active' ? 'Suspend' : 'Activate'} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700">{user.status === 'active' ? <Ban className="w-4 h-4 text-red-500" /> : <CheckCircle className="w-4 h-4 text-green-500" />}</button>
              </div></td>
            </tr>
          ))}
        </tbody></table>
      </div>
    </div>
  )
}
