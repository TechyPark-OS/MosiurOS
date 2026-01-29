import { useParams, NavLink } from 'react-router-dom'
import { useData } from '../App'
import {
  Server, ArrowLeft, Cpu, MemoryStick, HardDrive, Globe, Container,
  RefreshCw, Power, Terminal, Settings, Activity, Clock, Network,
  Play, Square, RotateCcw, Trash2
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const cpuHistory = [
  { time: '00:00', value: 35 }, { time: '02:00', value: 42 }, { time: '04:00', value: 28 },
  { time: '06:00', value: 38 }, { time: '08:00', value: 55 }, { time: '10:00', value: 62 },
  { time: '12:00', value: 58 }, { time: '14:00', value: 45 }, { time: '16:00', value: 52 },
  { time: '18:00', value: 48 }, { time: '20:00', value: 42 }, { time: 'Now', value: 45 },
]

const ramHistory = [
  { time: '00:00', value: 55 }, { time: '02:00', value: 58 }, { time: '04:00', value: 52 },
  { time: '06:00', value: 60 }, { time: '08:00', value: 65 }, { time: '10:00', value: 72 },
  { time: '12:00', value: 68 }, { time: '14:00', value: 62 }, { time: '16:00', value: 65 },
  { time: '18:00', value: 60 }, { time: '20:00', value: 58 }, { time: 'Now', value: 62 },
]

const services = [
  { name: 'OpenLiteSpeed', status: 'running', port: 80 },
  { name: 'MySQL', status: 'running', port: 3306 },
  { name: 'Redis', status: 'running', port: 6379 },
  { name: 'Postfix', status: 'running', port: 25 },
  { name: 'Dovecot', status: 'running', port: 993 },
  { name: 'Docker', status: 'running', port: null },
]

const recentLogs = [
  { time: '11:45:32', level: 'info', message: 'Backup completed successfully' },
  { time: '11:42:15', level: 'warning', message: 'High memory usage detected (85%)' },
  { time: '11:38:00', level: 'info', message: 'SSL certificate renewed for techypark.com' },
  { time: '11:30:22', level: 'info', message: 'WordPress updated to version 6.4.2' },
  { time: '11:25:10', level: 'error', message: 'Failed login attempt from 192.168.1.100' },
]

export default function ServerDetail() {
  const { id } = useParams()
  const { data } = useData()
  const server = data.servers.find(s => s.id === parseInt(id))

  if (!server) {
    return (
      <div className="card p-12 text-center">
        <Server className="w-12 h-12 mx-auto mb-4 text-slate-400" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Server not found</h3>
        <NavLink to="/servers" className="btn-primary">Back to Servers</NavLink>
      </div>
    )
  }

  const statusColors = {
    online: 'bg-green-500',
    warning: 'bg-yellow-500',
    offline: 'bg-red-500',
  }

  const getProgressColor = (value) => {
    if (value >= 80) return 'bg-red-500'
    if (value >= 60) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <NavLink to="/servers" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </NavLink>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
              <Server className="w-6 h-6 text-slate-600 dark:text-slate-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{server.name}</h1>
                <span className={`w-3 h-3 rounded-full ${statusColors[server.status]}`}></span>
              </div>
              <p className="text-slate-500 dark:text-slate-400">{server.ip} • {server.os}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center gap-2">
            <Terminal className="w-4 h-4" /> SSH Console
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Restart
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Settings className="w-4 h-4" /> Configure
          </button>
        </div>
      </div>

      {/* Resource Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary-500" />
              <span className="font-medium text-slate-900 dark:text-white">CPU Usage</span>
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{server.cpu}%</span>
          </div>
          <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className={`h-full ${getProgressColor(server.cpu)} transition-all`} style={{ width: `${server.cpu}%` }}></div>
          </div>
          <p className="text-sm text-slate-500 mt-2">4 cores @ 2.4 GHz</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MemoryStick className="w-5 h-5 text-purple-500" />
              <span className="font-medium text-slate-900 dark:text-white">Memory</span>
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{server.ram}%</span>
          </div>
          <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className={`h-full ${getProgressColor(server.ram)} transition-all`} style={{ width: `${server.ram}%` }}></div>
          </div>
          <p className="text-sm text-slate-500 mt-2">4.96 GB / 8 GB</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-teal-500" />
              <span className="font-medium text-slate-900 dark:text-white">Disk</span>
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{server.disk}%</span>
          </div>
          <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className={`h-full ${getProgressColor(server.disk)} transition-all`} style={{ width: `${server.disk}%` }}></div>
          </div>
          <p className="text-sm text-slate-500 mt-2">28 GB / 100 GB</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-4">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">CPU History (24h)</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cpuHistory}>
                <defs>
                  <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0066FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} unit="%" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Area type="monotone" dataKey="value" stroke="#0066FF" fill="url(#cpuGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-4">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Memory History (24h)</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ramHistory}>
                <defs>
                  <linearGradient id="ramGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} unit="%" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Area type="monotone" dataKey="value" stroke="#8B5CF6" fill="url(#ramGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Services and Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Services */}
        <div className="card p-4">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Services</h3>
          <div className="space-y-2">
            {services.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${service.status === 'running' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="font-medium text-slate-900 dark:text-white">{service.name}</span>
                  {service.port && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">:{service.port}</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-600">
                    <RotateCcw className="w-4 h-4 text-slate-500" />
                  </button>
                  <button className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-600">
                    {service.status === 'running' ? (
                      <Square className="w-4 h-4 text-slate-500" />
                    ) : (
                      <Play className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Logs */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Recent Logs</h3>
            <button className="text-sm text-primary-500 hover:text-primary-600">View All</button>
          </div>
          <div className="space-y-2">
            {recentLogs.map((log, index) => (
              <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <span className="text-xs text-slate-400 font-mono whitespace-nowrap">{log.time}</span>
                <span className={`badge ${
                  log.level === 'error' ? 'badge-error' :
                  log.level === 'warning' ? 'badge-warning' : 'badge-info'
                }`}>
                  {log.level}
                </span>
                <span className="text-sm text-slate-600 dark:text-slate-300 truncate">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Server Info */}
      <div className="card p-4">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Server Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Hostname</p>
            <p className="font-medium text-slate-900 dark:text-white">{server.name}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">IP Address</p>
            <p className="font-medium text-slate-900 dark:text-white">{server.ip}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Operating System</p>
            <p className="font-medium text-slate-900 dark:text-white">{server.os}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Uptime</p>
            <p className="font-medium text-slate-900 dark:text-white">{server.uptime}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Sites Hosted</p>
            <p className="font-medium text-slate-900 dark:text-white">{server.sites}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Containers</p>
            <p className="font-medium text-slate-900 dark:text-white">{server.containers}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Kernel</p>
            <p className="font-medium text-slate-900 dark:text-white">5.15.0-91-generic</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Timezone</p>
            <p className="font-medium text-slate-900 dark:text-white">UTC</p>
          </div>
        </div>
      </div>
    </div>
  )
}
