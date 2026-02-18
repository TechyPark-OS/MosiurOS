import { useState, useEffect } from 'react'
import { useData, useAuth } from '../App'
import { Users as UsersIcon, Plus, Search, Shield, Edit, Trash2, Mail, Key, UserCheck, UserX, Send, Clock, CheckCircle, XCircle, RefreshCw, Loader2, X } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'https://3000-i2koko878nh6heogpew1t-0dc26023.us2.manus.computer';

const roles = [
  { id: 1, name: 'Super Admin', users: 2, permissions: 'Full access to all features' },
  { id: 2, name: 'Admin', users: 5, permissions: 'Manage servers, sites, and users' },
  { id: 3, name: 'Reseller', users: 12, permissions: 'Create and manage client accounts' },
  { id: 4, name: 'Client', users: 45, permissions: 'Manage own sites and services' },
]

function InviteModal({ isOpen, onClose, onInviteSent }) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('User')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const sessionToken = localStorage.getItem('techypark_session')
      const response = await fetch(`${API_URL}/api/invitations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`
        },
        body: JSON.stringify({ email, role, message })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send invitation')
      }

      setSuccess(true)
      onInviteSent()
      setTimeout(() => {
        setEmail('')
        setRole('User')
        setMessage('')
        setSuccess(false)
        onClose()
      }, 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Invite Team Member</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Send an invitation via email</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Invitation Sent!</h3>
            <p className="text-slate-500 dark:text-slate-400">An invitation email has been sent to {email}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="input pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input"
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
                <option value="Reseller">Reseller</option>
                <option value="Client">Client</option>
                <option value="Support">Support</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Personal Message (optional)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hey! I'd like you to join our team on TechyPark Engine..."
                className="input min-h-[80px] resize-none"
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !email}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                ) : (
                  <><Send className="w-4 h-4" /> Send Invitation</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default function Users() {
  const { data } = useData()
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('users')
  const [filter, setFilter] = useState('all')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [invitations, setInvitations] = useState([])
  const [dbUsers, setDbUsers] = useState([])
  const [loadingInvitations, setLoadingInvitations] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [actionLoading, setActionLoading] = useState(null)

  const sessionToken = localStorage.getItem('techypark_session')

  // Fetch real users from database
  const fetchUsers = async () => {
    setLoadingUsers(true)
    try {
      const response = await fetch(`${API_URL}/api/users`, {
        headers: { 'Authorization': `Bearer ${sessionToken}` }
      })
      if (response.ok) {
        const data = await response.json()
        setDbUsers(data.users)
      }
    } catch (err) {
      console.error('Failed to fetch users:', err)
    } finally {
      setLoadingUsers(false)
    }
  }

  // Fetch invitations
  const fetchInvitations = async () => {
    setLoadingInvitations(true)
    try {
      const response = await fetch(`${API_URL}/api/invitations`, {
        headers: { 'Authorization': `Bearer ${sessionToken}` }
      })
      if (response.ok) {
        const data = await response.json()
        setInvitations(data.invitations)
      }
    } catch (err) {
      console.error('Failed to fetch invitations:', err)
    } finally {
      setLoadingInvitations(false)
    }
  }

  useEffect(() => {
    fetchUsers()
    fetchInvitations()
  }, [])

  // Revoke invitation
  const handleRevokeInvitation = async (id) => {
    setActionLoading(id)
    try {
      const response = await fetch(`${API_URL}/api/invitations/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${sessionToken}` }
      })
      if (response.ok) {
        fetchInvitations()
      }
    } catch (err) {
      console.error('Failed to revoke invitation:', err)
    } finally {
      setActionLoading(null)
    }
  }

  // Resend invitation
  const handleResendInvitation = async (id) => {
    setActionLoading(`resend-${id}`)
    try {
      const response = await fetch(`${API_URL}/api/invitations/${id}/resend`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${sessionToken}` }
      })
      if (response.ok) {
        alert('Invitation resent successfully!')
      }
    } catch (err) {
      console.error('Failed to resend invitation:', err)
    } finally {
      setActionLoading(null)
    }
  }

  // Delete user
  const handleDeleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    setActionLoading(`delete-${id}`)
    try {
      const response = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${sessionToken}` }
      })
      if (response.ok) {
        fetchUsers()
      }
    } catch (err) {
      console.error('Failed to delete user:', err)
    } finally {
      setActionLoading(null)
    }
  }

  // Use database users if available, fall back to mock data
  const displayUsers = dbUsers.length > 0 ? dbUsers : data.users

  const filteredUsers = displayUsers.filter(user => {
    const matchesSearch = (user.name || '').toLowerCase().includes(search.toLowerCase()) ||
                         (user.email || '').toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || (user.role || '').toLowerCase() === filter.toLowerCase()
    return matchesSearch && matchesFilter
  })

  const stats = {
    total: displayUsers.length,
    active: displayUsers.filter(u => u.status === 'active').length,
    admins: displayUsers.filter(u => u.role === 'Admin' || u.role === 'Super Admin').length,
    pendingInvites: invitations.filter(i => i.status === 'pending').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Users</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage users, invitations, and access control</p>
        </div>
        <button onClick={() => setShowInviteModal(true)} className="btn-primary flex items-center gap-2">
          <Send className="w-4 h-4" /> Invite User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Users</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Active</p>
          <p className="text-2xl font-bold text-green-500">{stats.active}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Administrators</p>
          <p className="text-2xl font-bold text-primary-500">{stats.admins}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Pending Invites</p>
          <p className="text-2xl font-bold text-amber-500">{stats.pendingInvites}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="flex gap-4">
          {['users', 'invitations', 'roles', 'activity'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 border-b-2 transition-colors capitalize ${
                activeTab === tab
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {tab}
              {tab === 'invitations' && stats.pendingInvites > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs rounded-full font-medium">
                  {stats.pendingInvites}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="card">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input pl-10"
                />
              </div>
              <div className="flex gap-2">
                {['all', 'admin', 'reseller', 'client', 'user'].map(role => (
                  <button
                    key={role}
                    onClick={() => setFilter(role)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                      filter === role
                        ? 'bg-primary-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loadingUsers ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto mb-3" />
              <p className="text-slate-500">Loading users...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">User</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Role</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Provider</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Last Login</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Status</th>
                    <th className="text-right p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                            <span className="text-white font-medium">{(u.name || u.email || '?').charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{u.name || 'Unnamed'}</p>
                            <p className="text-sm text-slate-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`badge ${
                          u.role === 'Admin' || u.role === 'Super Admin' ? 'badge-info' :
                          u.role === 'Reseller' ? 'badge-warning' : 'badge-success'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-slate-500 dark:text-slate-400 capitalize">{u.provider || 'email'}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-slate-500">{u.lastLogin || u.last_login || 'Never'}</span>
                      </td>
                      <td className="p-4">
                        <span className={`badge ${u.status === 'active' ? 'badge-success' : 'badge-error'}`}>
                          {u.status || 'active'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700" title="Edit">
                            <Edit className="w-4 h-4 text-slate-500" />
                          </button>
                          {u.id !== user?.id && (
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              disabled={actionLoading === `delete-${u.id}`}
                              className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                              title="Delete"
                            >
                              {actionLoading === `delete-${u.id}` ? (
                                <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                              ) : (
                                <Trash2 className="w-4 h-4 text-red-500" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        No users found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Invitations Tab */}
      {activeTab === 'invitations' && (
        <div className="card">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900 dark:text-white">Invitations</h3>
            <div className="flex gap-2">
              <button onClick={fetchInvitations} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700" title="Refresh">
                <RefreshCw className={`w-4 h-4 text-slate-500 ${loadingInvitations ? 'animate-spin' : ''}`} />
              </button>
              <button onClick={() => setShowInviteModal(true)} className="btn-primary text-sm flex items-center gap-2">
                <Send className="w-4 h-4" /> New Invitation
              </button>
            </div>
          </div>

          {loadingInvitations ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto mb-3" />
              <p className="text-slate-500">Loading invitations...</p>
            </div>
          ) : invitations.length === 0 ? (
            <div className="p-12 text-center">
              <Mail className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No invitations yet</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-4">Invite team members to collaborate on TechyPark Engine.</p>
              <button onClick={() => setShowInviteModal(true)} className="btn-primary inline-flex items-center gap-2">
                <Send className="w-4 h-4" /> Send First Invitation
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {invitations.map(inv => (
                <div key={inv.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        inv.status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/30' :
                        inv.status === 'accepted' ? 'bg-green-100 dark:bg-green-900/30' :
                        'bg-red-100 dark:bg-red-900/30'
                      }`}>
                        {inv.status === 'pending' ? <Clock className="w-5 h-5 text-amber-500" /> :
                         inv.status === 'accepted' ? <CheckCircle className="w-5 h-5 text-green-500" /> :
                         <XCircle className="w-5 h-5 text-red-500" />}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{inv.email}</p>
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                          <span>Role: {inv.role}</span>
                          <span>·</span>
                          <span>Invited by {inv.inviterName || inv.inviterEmail || 'Admin'}</span>
                          <span>·</span>
                          <span>{new Date(inv.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`badge ${
                        inv.status === 'pending' ? 'badge-warning' :
                        inv.status === 'accepted' ? 'badge-success' : 'badge-error'
                      }`}>
                        {inv.status}
                      </span>
                      {inv.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleResendInvitation(inv.id)}
                            disabled={actionLoading === `resend-${inv.id}`}
                            className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                            title="Resend"
                          >
                            {actionLoading === `resend-${inv.id}` ? (
                              <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                            ) : (
                              <RefreshCw className="w-4 h-4 text-slate-500" />
                            )}
                          </button>
                          <button
                            onClick={() => handleRevokeInvitation(inv.id)}
                            disabled={actionLoading === inv.id}
                            className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                            title="Revoke"
                          >
                            {actionLoading === inv.id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                            ) : (
                              <Trash2 className="w-4 h-4 text-red-500" />
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Roles Tab */}
      {activeTab === 'roles' && (
        <div className="card">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900 dark:text-white">User Roles</h3>
            <button className="btn-primary text-sm flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Role
            </button>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {roles.map(role => (
              <div key={role.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{role.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{role.permissions}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="badge badge-info">{role.users} users</span>
                    <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
                      <Edit className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="card">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {[
              { user: 'John Doe', action: 'Logged in', time: '2 minutes ago', icon: UserCheck },
              { user: 'Jane Smith', action: 'Created new site', time: '15 minutes ago', icon: Plus },
              { user: 'Mike Johnson', action: 'Updated SSL certificate', time: '1 hour ago', icon: Shield },
              { user: 'Sarah Wilson', action: 'Accepted invitation', time: '2 hours ago', icon: Mail },
              { user: 'Tom Brown', action: 'Logged out', time: '3 hours ago', icon: UserX },
            ].map((activity, index) => (
              <div key={index} className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  <activity.icon className="w-5 h-5 text-slate-500" />
                </div>
                <div className="flex-1">
                  <p className="text-slate-900 dark:text-white">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-sm text-slate-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invite Modal */}
      <InviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onInviteSent={fetchInvitations}
      />
    </div>
  )
}
