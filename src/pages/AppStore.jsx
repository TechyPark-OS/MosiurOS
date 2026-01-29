import { useState } from 'react'
import { Search, Download, Star, ExternalLink } from 'lucide-react'

const apps = [
  { id: 1, name: 'WordPress', category: 'CMS', description: 'Popular blogging and CMS platform', icon: '📝', installs: '10M+', rating: 4.8 },
  { id: 2, name: 'Redis', category: 'Database', description: 'In-memory data structure store', icon: '🔴', installs: '5M+', rating: 4.9 },
  { id: 3, name: 'MongoDB', category: 'Database', description: 'NoSQL document database', icon: '🍃', installs: '3M+', rating: 4.7 },
  { id: 4, name: 'n8n', category: 'Automation', description: 'Workflow automation platform', icon: '⚡', installs: '500K+', rating: 4.6 },
  { id: 5, name: 'Elasticsearch', category: 'Search', description: 'Distributed search and analytics', icon: '🔍', installs: '2M+', rating: 4.5 },
  { id: 6, name: 'PostgreSQL', category: 'Database', description: 'Advanced open source database', icon: '🐘', installs: '4M+', rating: 4.9 },
  { id: 7, name: 'Nginx', category: 'Web Server', description: 'High-performance web server', icon: '🌐', installs: '8M+', rating: 4.8 },
  { id: 8, name: 'Grafana', category: 'Monitoring', description: 'Analytics and monitoring', icon: '📊', installs: '1M+', rating: 4.7 },
  { id: 9, name: 'Joomla', category: 'CMS', description: 'Flexible content management', icon: '🔷', installs: '2M+', rating: 4.3 },
  { id: 10, name: 'Drupal', category: 'CMS', description: 'Enterprise CMS platform', icon: '💧', installs: '1.5M+', rating: 4.4 },
  { id: 11, name: 'RabbitMQ', category: 'Messaging', description: 'Message broker', icon: '🐰', installs: '1M+', rating: 4.6 },
  { id: 12, name: 'Minio', category: 'Storage', description: 'S3-compatible object storage', icon: '📦', installs: '800K+', rating: 4.5 },
]

const categories = ['All', 'CMS', 'Database', 'Automation', 'Search', 'Web Server', 'Monitoring', 'Messaging', 'Storage']

export default function AppStore() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase()) ||
                         app.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'All' || app.category === category
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">App Store</h1>
        <p className="text-slate-500 dark:text-slate-400">One-click deployment of popular applications</p>
      </div>

      {/* Search and Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search applications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === cat
                  ? 'bg-primary-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* App Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredApps.map(app => (
          <div key={app.id} className="card p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-2xl">
                {app.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 dark:text-white truncate">{app.name}</h3>
                <span className="badge badge-info text-xs">{app.category}</span>
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
              {app.description}
            </p>
            <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-4">
              <span className="flex items-center gap-1">
                <Download className="w-4 h-4" /> {app.installs}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> {app.rating}
              </span>
            </div>
            <button className="btn-primary w-full text-sm">Deploy</button>
          </div>
        ))}
      </div>

      {filteredApps.length === 0 && (
        <div className="card p-12 text-center">
          <Search className="w-12 h-12 mx-auto mb-4 text-slate-400" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No apps found</h3>
          <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}
