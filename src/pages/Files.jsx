import { useState } from 'react'
import { 
  FolderOpen, File, Upload, Download, Plus, Search, Trash2, Edit, 
  Copy, Scissors, Archive, ChevronRight, Home, RefreshCw, MoreVertical
} from 'lucide-react'

const mockFiles = [
  { id: 1, name: 'public_html', type: 'folder', size: '-', modified: '2024-01-15 10:30', permissions: 'drwxr-xr-x' },
  { id: 2, name: 'logs', type: 'folder', size: '-', modified: '2024-01-15 11:00', permissions: 'drwxr-x---' },
  { id: 3, name: 'backups', type: 'folder', size: '-', modified: '2024-01-14 02:00', permissions: 'drwxr-xr-x' },
  { id: 4, name: 'ssl', type: 'folder', size: '-', modified: '2024-01-10 15:20', permissions: 'drwx------' },
  { id: 5, name: '.htaccess', type: 'file', size: '1.2 KB', modified: '2024-01-12 09:15', permissions: '-rw-r--r--' },
  { id: 6, name: 'wp-config.php', type: 'file', size: '3.8 KB', modified: '2024-01-08 14:30', permissions: '-rw-r-----' },
  { id: 7, name: 'robots.txt', type: 'file', size: '256 B', modified: '2024-01-05 11:00', permissions: '-rw-r--r--' },
  { id: 8, name: 'error_log', type: 'file', size: '45.2 KB', modified: '2024-01-15 11:45', permissions: '-rw-r-----' },
]

export default function Files() {
  const [currentPath, setCurrentPath] = useState('/home/techypark')
  const [selectedFiles, setSelectedFiles] = useState([])
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState('list')

  const filteredFiles = mockFiles.filter(file =>
    file.name.toLowerCase().includes(search.toLowerCase())
  )

  const toggleSelect = (id) => {
    setSelectedFiles(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  const pathParts = currentPath.split('/').filter(Boolean)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">File Manager</h1>
          <p className="text-slate-500 dark:text-slate-400">Browse and manage your files</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center gap-2">
            <Upload className="w-4 h-4" /> Upload
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Folder
          </button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="card p-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button 
            onClick={() => setCurrentPath('/home/techypark')}
            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <Home className="w-4 h-4 text-slate-500" />
          </button>
          {pathParts.map((part, index) => (
            <div key={index} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-slate-400" />
              <button className="text-sm text-slate-600 dark:text-slate-300 hover:text-primary-500">
                {part}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="card p-3">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            {selectedFiles.length > 0 && (
              <>
                <button className="btn-secondary text-sm flex items-center gap-1">
                  <Copy className="w-4 h-4" /> Copy
                </button>
                <button className="btn-secondary text-sm flex items-center gap-1">
                  <Scissors className="w-4 h-4" /> Cut
                </button>
                <button className="btn-secondary text-sm flex items-center gap-1">
                  <Archive className="w-4 h-4" /> Compress
                </button>
                <button className="btn-secondary text-sm text-red-500 flex items-center gap-1">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </>
            )}
            <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
              <RefreshCw className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>
      </div>

      {/* File List */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="w-8 p-4">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFiles(filteredFiles.map(f => f.id))
                      } else {
                        setSelectedFiles([])
                      }
                    }}
                  />
                </th>
                <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Name</th>
                <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Size</th>
                <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Modified</th>
                <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Permissions</th>
                <th className="text-right p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map(file => (
                <tr 
                  key={file.id} 
                  className={`border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer ${
                    selectedFiles.includes(file.id) ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                  }`}
                  onDoubleClick={() => file.type === 'folder' && setCurrentPath(`${currentPath}/${file.name}`)}
                >
                  <td className="p-4">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300"
                      checked={selectedFiles.includes(file.id)}
                      onChange={() => toggleSelect(file.id)}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {file.type === 'folder' ? (
                        <FolderOpen className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <File className="w-5 h-5 text-slate-400" />
                      )}
                      <span className="font-medium text-slate-900 dark:text-white">{file.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-slate-500">{file.size}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-slate-500">{file.modified}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-xs text-slate-500">{file.permissions}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      {file.type === 'file' && (
                        <>
                          <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700" title="Edit">
                            <Edit className="w-4 h-4 text-slate-500" />
                          </button>
                          <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700" title="Download">
                            <Download className="w-4 h-4 text-slate-500" />
                          </button>
                        </>
                      )}
                      <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
                        <MoreVertical className="w-4 h-4 text-slate-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Storage Info */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">Storage Used</span>
          <span className="text-sm font-medium text-slate-900 dark:text-white">28.5 GB / 100 GB</span>
        </div>
        <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-primary-500" style={{ width: '28.5%' }}></div>
        </div>
      </div>
    </div>
  )
}
