import { useState } from 'react'
import { useData } from '../App'
import { Activity, Cpu, MemoryStick, HardDrive, Network, Clock, Server } from 'lucide-react'
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const cpuData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  value: Math.floor(Math.random() * 40) + 30
}))

const memoryData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  value: Math.floor(Math.random() * 30) + 50
}))

const diskData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  read: Math.floor(Math.random() * 100),
  write: Math.floor(Math.random() * 80)
}))

const networkData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  inbound: Math.floor(Math.random() * 500),
  outbound: Math.floor(Math.random() * 300)
}))

export default function Monitoring() {
  const { data } = useData()
  const [timeRange, setTimeRange] = useState('24h')
  const [selectedServer, setSelectedServer] = useState('all')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Monitoring</h1>
          <p className="text-slate-500 dark:text-slate-400">Real-time server metrics and performance</p>
        </div>
        <div className="flex gap-2">
          <select 
            className="input w-auto"
            value={selectedServer}
            onChange={(e) => setSelectedServer(e.target.value)}
          >
            <option value="all">All Servers</option>
            {data.servers.map(server => (
              <option key={server.id} value={server.id}>{server.name}</option>
            ))}
          </select>
          <select 
            className="input w-auto"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="1h">Last 1 hour</option>
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Avg CPU</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">42%</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <MemoryStick className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Avg Memory</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">65%</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
              <HardDrive className="w-5 h-5 text-teal-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Disk I/O</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">45 MB/s</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Network className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Network</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">125 Mbps</p>
            </div>
          </div>
        </div>
      </div>

      {/* CPU and Memory Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-4">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">CPU Usage</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cpuData}>
                <defs>
                  <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} unit="%" domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Area type="monotone" dataKey="value" stroke="#3B82F6" fill="url(#cpuGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-4">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Memory Usage</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={memoryData}>
                <defs>
                  <linearGradient id="memGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} unit="%" domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Area type="monotone" dataKey="value" stroke="#8B5CF6" fill="url(#memGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Disk I/O and Network Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-4">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Disk I/O</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={diskData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} unit=" MB/s" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Line type="monotone" dataKey="read" stroke="#10B981" strokeWidth={2} dot={false} name="Read" />
                <Line type="monotone" dataKey="write" stroke="#F59E0B" strokeWidth={2} dot={false} name="Write" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-slate-600 dark:text-slate-300">Read</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-sm text-slate-600 dark:text-slate-300">Write</span>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Network Traffic</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={networkData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} unit=" Mbps" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Line type="monotone" dataKey="inbound" stroke="#0066FF" strokeWidth={2} dot={false} name="Inbound" />
                <Line type="monotone" dataKey="outbound" stroke="#14B8A6" strokeWidth={2} dot={false} name="Outbound" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary-500"></div>
              <span className="text-sm text-slate-600 dark:text-slate-300">Inbound</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-teal-500"></div>
              <span className="text-sm text-slate-600 dark:text-slate-300">Outbound</span>
            </div>
          </div>
        </div>
      </div>

      {/* Uptime Status */}
      <div className="card p-4">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Uptime Status</h3>
        <div className="space-y-3">
          {data.servers.slice(0, 4).map(server => (
            <div key={server.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
              <div className="flex items-center gap-3">
                <Server className="w-5 h-5 text-slate-500" />
                <span className="font-medium text-slate-900 dark:text-white">{server.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: 30 }, (_, i) => (
                    <div 
                      key={i} 
                      className={`w-1.5 h-6 rounded-sm ${
                        Math.random() > 0.05 ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    ></div>
                  ))}
                </div>
                <span className="text-sm font-medium text-green-500">99.9%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
