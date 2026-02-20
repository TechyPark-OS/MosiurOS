import { useState } from 'react'
import { Plus, BarChart3, TrendingUp, Users, Target, CheckCircle, Pause, Clock, Edit, Trash2, ChevronRight, ArrowRight, Zap, Trophy, AlertCircle, Play, X } from 'lucide-react'

const tests = [
  {
    id: 1,
    name: 'Hero Headline Test',
    funnel: 'Product Launch Funnel',
    status: 'running',
    startDate: 'Jan 15, 2024',
    visitors: 8420,
    confidence: 94,
    variants: [
      { name: 'Control (A)', headline: 'Launch Your Dream Business Today', visitors: 4210, conversions: 189, convRate: 4.49, isWinner: false },
      { name: 'Variant B', headline: 'Build a 6-Figure Business in 90 Days', visitors: 4210, conversions: 248, convRate: 5.89, isWinner: true },
    ],
    metric: 'Opt-in Rate',
    improvement: '+31.2%',
  },
  {
    id: 2,
    name: 'CTA Button Color Test',
    funnel: 'Lead Magnet Funnel',
    status: 'running',
    startDate: 'Jan 18, 2024',
    visitors: 3200,
    confidence: 72,
    variants: [
      { name: 'Control (A)', headline: 'Blue Button (#0066FF)', visitors: 1600, conversions: 128, convRate: 8.0, isWinner: false },
      { name: 'Variant B', headline: 'Orange Button (#FF6B35)', visitors: 1600, conversions: 144, convRate: 9.0, isWinner: false },
    ],
    metric: 'Click Rate',
    improvement: '+12.5%',
  },
  {
    id: 3,
    name: 'Pricing Page Layout',
    funnel: 'Free Trial Funnel',
    status: 'completed',
    startDate: 'Dec 20, 2023',
    endDate: 'Jan 10, 2024',
    visitors: 15600,
    confidence: 99,
    variants: [
      { name: 'Control (A)', headline: '3-column pricing cards', visitors: 7800, conversions: 312, convRate: 4.0, isWinner: false },
      { name: 'Variant B', headline: 'Highlighted center plan', visitors: 7800, conversions: 468, convRate: 6.0, isWinner: true },
    ],
    metric: 'Signup Rate',
    improvement: '+50.0%',
  },
  {
    id: 4,
    name: 'Email Subject Line Test',
    funnel: 'Welcome Sequence',
    status: 'paused',
    startDate: 'Jan 12, 2024',
    visitors: 1800,
    confidence: 45,
    variants: [
      { name: 'Control (A)', headline: 'Welcome to TechyPark!', visitors: 900, conversions: 495, convRate: 55.0, isWinner: false },
      { name: 'Variant B', headline: '🚀 Your account is ready — let\'s go!', visitors: 900, conversions: 513, convRate: 57.0, isWinner: false },
    ],
    metric: 'Open Rate',
    improvement: '+3.6%',
  },
]

const statusConfig = {
  running: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: Play, label: 'Running' },
  completed: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: CheckCircle, label: 'Completed' },
  paused: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Pause, label: 'Paused' },
  draft: { color: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400', icon: Clock, label: 'Draft' },
}

function ConfidenceMeter({ value }) {
  const color = value >= 95 ? 'bg-green-500' : value >= 80 ? 'bg-yellow-500' : 'bg-slate-400'
  const label = value >= 95 ? 'Statistically Significant' : value >= 80 ? 'Getting There' : 'Need More Data'
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-500 dark:text-slate-400">Statistical Confidence</span>
        <span className={`text-xs font-semibold ${value >= 95 ? 'text-green-600' : value >= 80 ? 'text-yellow-600' : 'text-slate-500'}`}>{value}%</span>
      </div>
      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${value}%` }}></div>
      </div>
      <p className="text-xs text-slate-400 mt-1">{label}</p>
    </div>
  )
}

export default function ABTesting() {
  const [showCreate, setShowCreate] = useState(false)
  const [selectedTest, setSelectedTest] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')

  const filtered = tests.filter(t => filterStatus === 'all' || t.status === filterStatus)
  const running = tests.filter(t => t.status === 'running').length
  const completed = tests.filter(t => t.status === 'completed').length
  const totalVisitors = tests.reduce((s, t) => s + t.visitors, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">A/B Testing</h1>
          <p className="text-slate-500 dark:text-slate-400">Split test your pages, emails, and funnels to maximize conversions</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New A/B Test
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Running Tests', value: running, icon: Play, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Completed Tests', value: completed, icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Total Visitors Tested', value: totalVisitors.toLocaleString(), icon: Users, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
          { label: 'Avg Improvement', value: '+28.3%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
        ].map((s, i) => (
          <div key={i} className="card p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['all', 'running', 'completed', 'paused', 'draft'].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 text-sm rounded-lg capitalize transition-colors ${
              filterStatus === s
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Tests List */}
      <div className="space-y-4">
        {filtered.map(test => {
          const status = statusConfig[test.status]
          const StatusIcon = status.icon
          const winner = test.variants.find(v => v.isWinner)
          const isExpanded = selectedTest === test.id

          return (
            <div key={test.id} className="card overflow-hidden">
              <div
                className="p-5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                onClick={() => setSelectedTest(isExpanded ? null : test.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{test.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${status.color}`}>
                        <StatusIcon className="w-3 h-3" /> {status.label}
                      </span>
                      {test.status === 'completed' && winner && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 flex items-center gap-1">
                          <Trophy className="w-3 h-3" /> Winner Found
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                      Funnel: {test.funnel} • Metric: {test.metric} • Started: {test.startDate}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <p className="text-xs text-slate-400">Total Visitors</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{test.visitors.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Variants</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{test.variants.length}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Confidence</p>
                        <p className={`font-semibold ${test.confidence >= 95 ? 'text-green-600' : test.confidence >= 80 ? 'text-yellow-600' : 'text-slate-500'}`}>
                          {test.confidence}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Improvement</p>
                        <p className="font-semibold text-green-600">{test.improvement}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg" onClick={e => e.stopPropagation()}>
                      <Edit className="w-4 h-4 text-slate-400" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg" onClick={e => e.stopPropagation()}>
                      <Trash2 className="w-4 h-4 text-slate-400" />
                    </button>
                    <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-slate-200 dark:border-slate-700 p-5 space-y-4 bg-slate-50/50 dark:bg-slate-800/30">
                  <ConfidenceMeter value={test.confidence} />

                  <div className="grid sm:grid-cols-2 gap-4">
                    {test.variants.map((variant, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          variant.isWinner
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                              i === 0 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                            }`}>
                              {i === 0 ? 'A' : 'B'}
                            </div>
                            <span className="font-medium text-sm text-slate-900 dark:text-white">{variant.name}</span>
                          </div>
                          {variant.isWinner && (
                            <div className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                              <Trophy className="w-3.5 h-3.5" /> Winner
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 italic">"{variant.headline}"</p>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="p-2 bg-white dark:bg-slate-700/50 rounded-lg">
                            <p className="text-xs text-slate-400">Visitors</p>
                            <p className="font-semibold text-slate-900 dark:text-white text-sm">{variant.visitors.toLocaleString()}</p>
                          </div>
                          <div className="p-2 bg-white dark:bg-slate-700/50 rounded-lg">
                            <p className="text-xs text-slate-400">Conversions</p>
                            <p className="font-semibold text-slate-900 dark:text-white text-sm">{variant.conversions}</p>
                          </div>
                          <div className="p-2 bg-white dark:bg-slate-700/50 rounded-lg">
                            <p className="text-xs text-slate-400">Conv. Rate</p>
                            <p className={`font-semibold text-sm ${variant.isWinner ? 'text-green-600' : 'text-slate-900 dark:text-white'}`}>{variant.convRate}%</p>
                          </div>
                        </div>
                        {/* Conversion bar */}
                        <div className="mt-3">
                          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${variant.isWinner ? 'bg-green-500' : 'bg-blue-500'}`}
                              style={{ width: `${Math.min(variant.convRate * 8, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    {test.status === 'running' && (
                      <>
                        <button className="btn-secondary text-sm flex items-center gap-1"><Pause className="w-3.5 h-3.5" /> Pause Test</button>
                        {test.confidence >= 95 && (
                          <button className="btn-primary text-sm flex items-center gap-1"><Trophy className="w-3.5 h-3.5" /> Declare Winner</button>
                        )}
                      </>
                    )}
                    {test.status === 'paused' && (
                      <button className="btn-primary text-sm flex items-center gap-1"><Play className="w-3.5 h-3.5" /> Resume Test</button>
                    )}
                    {test.status === 'completed' && (
                      <button className="btn-secondary text-sm flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Create Follow-up Test</button>
                    )}
                    <button className="btn-secondary text-sm flex items-center gap-1"><BarChart3 className="w-3.5 h-3.5" /> Full Report</button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Best Practices */}
      <div className="card p-6">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" /> A/B Testing Best Practices
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'Test One Variable at a Time', desc: 'Change only one element per test to accurately measure its impact on conversions.', icon: Target },
            { title: 'Wait for Statistical Significance', desc: 'Run tests until you reach at least 95% confidence before declaring a winner.', icon: BarChart3 },
            { title: 'Segment Your Audience', desc: 'Test different variants with different audience segments for more accurate results.', icon: Users },
            { title: 'Test High-Impact Elements', desc: 'Focus on headlines, CTAs, and pricing — these have the biggest impact on conversions.', icon: TrendingUp },
            { title: 'Run Tests Long Enough', desc: 'Run tests for at least 2 weeks to account for weekly traffic patterns and seasonality.', icon: Clock },
            { title: 'Document Your Learnings', desc: 'Keep a log of all tests and results to build institutional knowledge over time.', icon: CheckCircle },
          ].map((tip, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
                <tip.icon className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">{tip.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create A/B Test</h2>
              <button onClick={() => setShowCreate(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Test Name</label>
                <input type="text" placeholder="e.g. Hero Headline Test" className="input w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select Funnel</label>
                <select className="input w-full">
                  <option>Product Launch Funnel</option>
                  <option>Lead Magnet Funnel</option>
                  <option>Webinar Registration</option>
                  <option>Free Trial Funnel</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">What are you testing?</label>
                <select className="input w-full">
                  <option>Headline / Copy</option>
                  <option>CTA Button</option>
                  <option>Page Layout</option>
                  <option>Image / Video</option>
                  <option>Pricing</option>
                  <option>Email Subject Line</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Primary Metric</label>
                <select className="input w-full">
                  <option>Opt-in Rate</option>
                  <option>Click-through Rate</option>
                  <option>Conversion Rate</option>
                  <option>Revenue per Visitor</option>
                  <option>Email Open Rate</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Traffic Split</label>
                <div className="flex gap-2">
                  {['50/50', '60/40', '70/30', '80/20'].map(split => (
                    <button key={split} className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${split === '50/50' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700' : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-slate-300'}`}>
                      {split}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreate(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={() => setShowCreate(false)} className="btn-primary flex-1">Create Test</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
