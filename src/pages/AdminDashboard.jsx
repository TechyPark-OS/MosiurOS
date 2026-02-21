import { useState, useEffect } from 'react';
import {
  Users, Shield, Activity, Settings, Search, MoreVertical,
  Edit, Trash2, Eye, UserPlus, ToggleLeft, ToggleRight,
  LogIn, Clock, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import api from '../lib/api';

export default function AdminDashboard() {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userModules, setUserModules] = useState([]);
  const [availableModules, setAvailableModules] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersRes, statsRes, logsRes, modulesRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/admin/users`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/admin/stats`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/admin/logs?limit=50`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/admin/modules`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      const usersData = await usersRes.json();
      const statsData = await statsRes.json();
      const logsData = await logsRes.json();
      const modulesData = await modulesRes.json();

      setUsers(usersData.users || []);
      setStats(statsData.stats || {});
      setLogs(logsData.logs || []);
      setAvailableModules(modulesData.modules || []);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserModules = async (userId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/admin/users/${userId}/modules`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setUserModules(data.modules || []);
    } catch (error) {
      console.error('Error loading user modules:', error);
    }
  };

  const toggleModule = async (userId, moduleId, currentlyEnabled) => {
    try {
      const action = currentlyEnabled ? 'disable' : 'enable';
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/admin/users/${userId}/modules/${moduleId}/${action}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      await loadUserModules(userId);
    } catch (error) {
      console.error('Error toggling module:', error);
      alert('Failed to toggle module');
    }
  };

  const impersonateUser = async (userId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/admin/impersonate/${userId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      const data = await res.json();
      
      // Store impersonation data
      localStorage.setItem('impersonationToken', data.impersonationToken);
      localStorage.setItem('originalToken', localStorage.getItem('token'));
      localStorage.setItem('token', data.userSession);
      
      // Reload page to show user's view
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error starting impersonation:', error);
      alert('Failed to impersonate user');
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      await loadData();
      setSelectedUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Super Admin Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage users, modules, and platform settings</p>
        </div>
        <Shield className="w-8 h-8 text-primary-600" />
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'blue' },
            { label: 'Admin Users', value: stats.adminUsers, icon: Shield, color: 'purple' },
            { label: 'Regular Users', value: stats.regularUsers, icon: Users, color: 'green' },
            { label: 'Active Impersonations', value: stats.activeImpersonations, icon: LogIn, color: 'orange' },
          ].map((stat, i) => (
            <div key={i} className="card p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-${stat.color}-50 dark:bg-${stat.color}-900/20 flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
        {['users', 'modules', 'activity'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${
              tab === t
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {tab === 'users' && (
        <div className="space-y-4">
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Created</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">{user.name || user.email}</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'Admin'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              loadUserModules(user.id);
                            }}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                            title="Manage Modules"
                          >
                            <Settings className="w-4 h-4 text-slate-400" />
                          </button>
                          {user.role !== 'Admin' && (
                            <button
                              onClick={() => impersonateUser(user.id)}
                              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                              title="Login as User"
                            >
                              <LogIn className="w-4 h-4 text-slate-400" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Module Management Modal */}
          {selectedUser && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="card max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Manage Modules for {selectedUser.name || selectedUser.email}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Enable or disable modules for this user
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                  >
                    <XCircle className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <div className="space-y-2">
                  {userModules.map(module => (
                    <div
                      key={module.id}
                      className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-slate-900 dark:text-white">{module.name}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">{module.description}</div>
                      </div>
                      <button
                        onClick={() => toggleModule(selectedUser.id, module.id, module.enabled)}
                        className="ml-4"
                      >
                        {module.enabled ? (
                          <ToggleRight className="w-8 h-8 text-green-600" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-slate-400" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modules Tab */}
      {tab === 'modules' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableModules.map(module => (
            <div key={module.id} className="card p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
                  <Settings className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{module.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{module.description}</p>
                  <span className="inline-block mt-2 px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs font-medium text-slate-600 dark:text-slate-300">
                    {module.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Activity Tab */}
      {tab === 'activity' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Action</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Admin</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Target User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">{log.admin_id}</td>
                    <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">{log.target_user_id || '-'}</td>
                    <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
