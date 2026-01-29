import { useData } from '../App'
import { NavLink } from 'react-router-dom'
import {
  Server, Globe, Container, Mail, Shield, Activity,
  AlertTriangle, CheckCircle, XCircle, ArrowUpRight,
  TrendingUp, Users, HardDrive, Cpu, MemoryStick
} from 'lucide-react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const cpuData = [
  { time: '00:00', value: 35 },
  { time: '04:00', value: 28 },
  { time: '08:00', value: 45 },
  { time: '12:00', value: 62 },
  { time: '16:00', value: 55 },
  { time: '20:00', value: 48 },
  { time: 'Now', value: 45 },
]

const trafficData = [
  { day: 'Mon', visits: 12400 },
  { day: 'Tue', visits: 15200 },
  { day: 'Wed', visits: 18900 },
  { day: 'Thu', visits: 16700 },
  { day: 'Fri', visits: 21300 },
  { day: 'Sat', visits: 14500 },
  { day: 'Sun', visits: 11200 },
]

const COLORS = ['#10B981', '#F59E0B', '#EF4444']

export default function Dashboard() {
  const { data } = useData()
  
  const serverStats = {
    online: data.servers.filter(s => s.status === 'online').length,
    warning: data.servers.filter(s => s.status === 'warning').length,
    offline: data.servers.filter(s => s.status === 'offline').length,
  }
  
  const pieData = [
    { name: 'Online', value: serverStats.online },
    { name: 'Warning', value: serverStats.warning },
    { name: 'Offline', value: serverStats.offline },
  ]

  const totalVisits = data.sites.reduce((sum, site) => sum + site.visits, 0)
  const unreadAlerts = data.alerts.filter(a => !a.read)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Welcome back, John. Here's your infrastructure overview.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary text-sm">
            Export Report
          </button>
          <button className="btn-primary text-sm">
            Add Server
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <NavLink to="/servers" className="stat-card hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 text-sm">Servers</span>
            <Server className="w-5 h-5 text-primary-500" />
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{data.servers.length}</span>
            <div className="flex gap-1">
              <span className="badge badge-success">{serverStats.online} online</span>
            </div>
          </div>
        </NavLink>

        <NavLink to="/sites" className="stat-card hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 text-sm">Sites</span>
            <Globe className="w-5 h-5 text-blue-500" />
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{data.sites.length}</span>
            <span className="text-sm text-green-500 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> +12%
            </span>
          </div>
        </NavLink>

        <NavLink to="/containers" className="stat-card hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 text-sm">Containers</span>
            <Container className="w-5 h-5 text-teal-500" />
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{data.containers.length}</span>
            <span className="badge badge-success">{data.containers.filter(c => c.status === 'running').length} running</span>
          </div>
        </NavLink>

        <NavLink to="/email" className="stat-card hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 text-sm">Mailboxes</span>
            <Mail className="w-5 h-5 text-purple-500" />
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{data.mailboxes.length}</span>
            <span className="text-sm text-slate-500">Active</span>
          </div>
        </NavLink>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CPU Usage Chart */}
        <div className="card p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">CPU Usage (Avg)</h3>
            <select className="text-sm bg-slate-100 dark:bg-slate-700 rounded-lg px-3 py-1 border-0">
              <option>Last 24 hours</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cpuData}>
                <defs>
                  <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0066FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} unit="%" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Area type="monotone" dataKey="value" stroke="#0066FF" fill="url(#cpuGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Server Status Pie */}
        <div className="card p-4">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Server Status</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-slate-600 dark:text-slate-300">Online</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-sm text-slate-600 dark:text-slate-300">Warning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-slate-600 dark:text-slate-300">Offline</span>
            </div>
          </div>
        </div>
      </div>

      {/* Traffic and Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Chart */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Weekly Traffic</h3>
            <span className="text-sm text-slate-500">{totalVisits.toLocaleString()} total visits</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Line type="monotone" dataKey="visits" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Recent Alerts</h3>
            <NavLink to="/alerts" className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1">
              View all <ArrowUpRight className="w-4 h-4" />
            </NavLink>
          </div>
          <div className="space-y-3">
            {unreadAlerts.slice(0, 4).map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                {alert.type === 'error' && <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
                {alert.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />}
                {alert.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />}
                {alert.type === 'info' && <Activity className="w-5 h-5 text-blue-500 flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{alert.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{alert.message}</p>
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0">{alert.time}</span>
              </div>
            ))}
            {unreadAlerts.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                <p>All caught up! No new alerts.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-4">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <button className="flex flex-col items-center gap-2 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <Server className="w-6 h-6 text-primary-500" />
            <span className="text-sm text-slate-700 dark:text-slate-300">Add Server</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <Globe className="w-6 h-6 text-blue-500" />
            <span className="text-sm text-slate-700 dark:text-slate-300">Create Site</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <Shield className="w-6 h-6 text-green-500" />
            <span className="text-sm text-slate-700 dark:text-slate-300">Issue SSL</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <HardDrive className="w-6 h-6 text-purple-500" />
            <span className="text-sm text-slate-700 dark:text-slate-300">Run Backup</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <Container className="w-6 h-6 text-teal-500" />
            <span className="text-sm text-slate-700 dark:text-slate-300">Deploy App</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <Mail className="w-6 h-6 text-orange-500" />
            <span className="text-sm text-slate-700 dark:text-slate-300">Add Mailbox</span>
          </button>
        </div>
      </div>
    </div>
  )
}
