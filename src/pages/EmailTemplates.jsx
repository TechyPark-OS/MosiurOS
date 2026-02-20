import { useState } from 'react'
import { Plus, Search, Mail, Edit, Copy, Trash2, Eye, Star, Tag, Clock, CheckCircle, X, Zap, Users, ShoppingCart, BookOpen, Bell, Gift, ArrowRight } from 'lucide-react'

const categories = [
  { id: 'all', label: 'All Templates', icon: Mail },
  { id: 'welcome', label: 'Welcome', icon: Users },
  { id: 'sales', label: 'Sales & Promos', icon: ShoppingCart },
  { id: 'course', label: 'Courses', icon: BookOpen },
  { id: 'automation', label: 'Automation', icon: Zap },
  { id: 'notification', label: 'Notifications', icon: Bell },
  { id: 'holiday', label: 'Holiday', icon: Gift },
]

const templates = [
  {
    id: 1,
    name: 'Welcome Email',
    category: 'welcome',
    description: 'Warm welcome to new subscribers with a clear next step',
    subject: 'Welcome to {{company_name}}! Here\'s how to get started 🎉',
    preview: 'Hi {{first_name}}, Welcome aboard! We\'re so excited to have you...',
    tags: ['Onboarding', 'Welcome'],
    openRate: 68,
    clickRate: 24,
    uses: 2840,
    starred: true,
    color: 'blue',
    sections: ['Header with logo', 'Personal greeting', 'What to expect', 'CTA button', 'Footer'],
  },
  {
    id: 2,
    name: 'Product Launch Announcement',
    category: 'sales',
    description: 'Build excitement and drive sales for a new product launch',
    subject: '🚀 {{product_name}} is finally here — and it\'s everything you\'ve been waiting for',
    preview: 'After months of development, we\'re thrilled to announce...',
    tags: ['Launch', 'Sales', 'Announcement'],
    openRate: 52,
    clickRate: 18,
    uses: 1240,
    starred: true,
    color: 'purple',
    sections: ['Hero image', 'Headline', 'Product benefits', 'Social proof', 'CTA', 'FAQ', 'Footer'],
  },
  {
    id: 3,
    name: 'Flash Sale',
    category: 'sales',
    description: 'Create urgency with a time-limited discount offer',
    subject: '⏰ 24 hours only: {{discount}}% off everything (ends tonight)',
    preview: 'This is your last chance to grab our biggest sale of the year...',
    tags: ['Sale', 'Urgency', 'Discount'],
    openRate: 61,
    clickRate: 31,
    uses: 980,
    starred: false,
    color: 'orange',
    sections: ['Countdown timer', 'Sale headline', 'Featured products', 'Discount code', 'CTA', 'Footer'],
  },
  {
    id: 4,
    name: 'Abandoned Cart Recovery',
    category: 'automation',
    description: 'Win back customers who left items in their cart',
    subject: 'You left something behind... 🛒',
    preview: 'Hi {{first_name}}, We noticed you left some items in your cart...',
    tags: ['Automation', 'Recovery', 'Ecommerce'],
    openRate: 45,
    clickRate: 28,
    uses: 3200,
    starred: true,
    color: 'green',
    sections: ['Cart reminder', 'Product images', 'Urgency message', 'Discount offer', 'CTA', 'Footer'],
  },
  {
    id: 5,
    name: 'Course Welcome',
    category: 'course',
    description: 'Onboard new students with everything they need to succeed',
    subject: '🎓 Your course access is ready — let\'s get started!',
    preview: 'Congratulations on enrolling in {{course_name}}! Here\'s everything you need...',
    tags: ['Course', 'Onboarding', 'Education'],
    openRate: 74,
    clickRate: 42,
    uses: 1560,
    starred: false,
    color: 'teal',
    sections: ['Congratulations header', 'Course overview', 'Getting started steps', 'Community invite', 'CTA', 'Footer'],
  },
  {
    id: 6,
    name: 'Weekly Newsletter',
    category: 'welcome',
    description: 'Engage your audience with curated weekly content',
    subject: '📬 This week in {{industry}}: {{headline}}',
    preview: 'Here\'s what we\'ve been reading, building, and thinking about this week...',
    tags: ['Newsletter', 'Content', 'Weekly'],
    openRate: 38,
    clickRate: 12,
    uses: 4200,
    starred: false,
    color: 'indigo',
    sections: ['Week intro', 'Featured article', 'Quick tips', 'Product updates', 'Community spotlight', 'Footer'],
  },
  {
    id: 7,
    name: 'Re-engagement Campaign',
    category: 'automation',
    description: 'Win back inactive subscribers with a compelling offer',
    subject: 'We miss you, {{first_name}} — here\'s 30% off to come back',
    preview: 'It\'s been a while since we\'ve heard from you. We wanted to reach out...',
    tags: ['Re-engagement', 'Win-back', 'Automation'],
    openRate: 29,
    clickRate: 15,
    uses: 890,
    starred: false,
    color: 'pink',
    sections: ['Personal message', 'What\'s new', 'Special offer', 'CTA', 'Unsubscribe option', 'Footer'],
  },
  {
    id: 8,
    name: 'Order Confirmation',
    category: 'notification',
    description: 'Professional order confirmation with all purchase details',
    subject: '✅ Order confirmed! Your {{product_name}} is on its way',
    preview: 'Thank you for your purchase! Here\'s a summary of your order...',
    tags: ['Transactional', 'Order', 'Confirmation'],
    openRate: 82,
    clickRate: 8,
    uses: 5600,
    starred: true,
    color: 'green',
    sections: ['Order summary', 'Product details', 'Shipping info', 'Support contact', 'Upsell', 'Footer'],
  },
  {
    id: 9,
    name: 'Holiday Sale',
    category: 'holiday',
    description: 'Festive email template for holiday promotions',
    subject: '🎄 Happy Holidays! Your exclusive gift inside...',
    preview: 'Wishing you and your family a wonderful holiday season...',
    tags: ['Holiday', 'Seasonal', 'Sale'],
    openRate: 55,
    clickRate: 22,
    uses: 720,
    starred: false,
    color: 'red',
    sections: ['Holiday header', 'Seasonal message', 'Gift offer', 'Featured deals', 'CTA', 'Footer'],
  },
]

const colorMap = {
  blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
  purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600',
  orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600',
  green: 'bg-green-100 dark:bg-green-900/30 text-green-600',
  teal: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600',
  indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600',
  pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600',
  red: 'bg-red-100 dark:bg-red-900/30 text-red-600',
}

function TemplatePreviewModal({ template, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-800 z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{template.name}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{template.description}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-5">
          {/* Subject Line */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Subject Line</label>
            <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-sm text-slate-900 dark:text-white font-medium">
              {template.subject}
            </div>
          </div>

          {/* Email Preview */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Email Preview</label>
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              {/* Email header */}
              <div className={`p-6 ${colorMap[template.color]} text-center`}>
                <div className="w-12 h-12 bg-white/80 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="h-4 bg-white/60 rounded-full w-48 mx-auto mb-2"></div>
                <div className="h-3 bg-white/40 rounded-full w-32 mx-auto"></div>
              </div>
              {/* Email body */}
              <div className="p-6 bg-white dark:bg-slate-800 space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded-full w-3/4"></div>
                <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full w-full"></div>
                <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full w-5/6"></div>
                <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full w-4/5"></div>
                <div className="py-2"></div>
                <div className="h-10 bg-blue-500 rounded-lg w-40 mx-auto flex items-center justify-center">
                  <div className="h-3 bg-white/80 rounded-full w-24"></div>
                </div>
                <div className="py-2"></div>
                <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full w-full"></div>
                <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full w-3/4"></div>
              </div>
              {/* Email footer */}
              <div className="p-4 bg-slate-50 dark:bg-slate-700/50 text-center">
                <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded-full w-48 mx-auto mb-2"></div>
                <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded-full w-32 mx-auto"></div>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Template Sections</label>
            <div className="flex flex-wrap gap-2">
              {template.sections.map((section, i) => (
                <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  {section}
                </div>
              ))}
            </div>
          </div>

          {/* Performance */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Average Performance</label>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-center">
                <p className="text-lg font-bold text-blue-600">{template.openRate}%</p>
                <p className="text-xs text-slate-500">Open Rate</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-center">
                <p className="text-lg font-bold text-green-600">{template.clickRate}%</p>
                <p className="text-xs text-slate-500">Click Rate</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-center">
                <p className="text-lg font-bold text-purple-600">{template.uses.toLocaleString()}</p>
                <p className="text-xs text-slate-500">Times Used</p>
              </div>
            </div>
          </div>

          {/* Variables */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Personalization Variables</label>
            <div className="flex flex-wrap gap-2">
              {['{{first_name}}', '{{last_name}}', '{{company_name}}', '{{email}}', '{{product_name}}'].map(v => (
                <code key={v} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs rounded-md border border-blue-200 dark:border-blue-800">
                  {v}
                </code>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="btn-secondary flex-1">Close</button>
            <button onClick={onClose} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <Edit className="w-4 h-4" /> Use This Template
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EmailTemplates() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [previewTemplate, setPreviewTemplate] = useState(null)
  const [showCreate, setShowCreate] = useState(false)

  const filtered = templates.filter(t => {
    if (activeCategory !== 'all' && t.category !== activeCategory) return false
    if (search && !t.name.toLowerCase().includes(search.toLowerCase()) && !t.description.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const starred = templates.filter(t => t.starred)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Email Templates</h1>
          <p className="text-slate-500 dark:text-slate-400">Pre-built, high-converting email templates for every use case</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Template
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Templates', value: templates.length, icon: Mail, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Starred', value: starred.length, icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
          { label: 'Avg Open Rate', value: `${Math.round(templates.reduce((s, t) => s + t.openRate, 0) / templates.length)}%`, icon: Eye, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Total Uses', value: templates.reduce((s, t) => s + t.uses, 0).toLocaleString(), icon: CheckCircle, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
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

      {/* Starred Templates */}
      {starred.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> Starred Templates
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {starred.map(t => (
              <div
                key={t.id}
                className="flex-shrink-0 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/50 rounded-xl cursor-pointer hover:shadow-md transition-shadow w-48"
                onClick={() => setPreviewTemplate(t)}
              >
                <div className={`w-10 h-10 rounded-lg ${colorMap[t.color]} flex items-center justify-center mb-3`}>
                  <Mail className="w-5 h-5" />
                </div>
                <h4 className="font-medium text-sm text-slate-900 dark:text-white mb-1">{t.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t.openRate}% open rate</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map(cat => {
          const Icon = cat.icon
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* Templates Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(template => (
          <div key={template.id} className="card p-5 hover:shadow-md transition-all duration-200 group cursor-pointer" onClick={() => setPreviewTemplate(template)}>
            <div className="flex items-start justify-between mb-3">
              <div className={`w-12 h-12 rounded-xl ${colorMap[template.color]} flex items-center justify-center`}>
                <Mail className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1">
                {template.starred && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => { e.stopPropagation(); }}>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>

            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{template.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">{template.description}</p>

            <div className="flex flex-wrap gap-1 mb-3">
              {template.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-slate-100 dark:border-slate-700">
              <div>
                <p className="text-sm font-semibold text-blue-600">{template.openRate}%</p>
                <p className="text-xs text-slate-400">Open Rate</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-green-600">{template.clickRate}%</p>
                <p className="text-xs text-slate-400">Click Rate</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-purple-600">{template.uses >= 1000 ? `${(template.uses/1000).toFixed(1)}K` : template.uses}</p>
                <p className="text-xs text-slate-400">Uses</p>
              </div>
            </div>

            <button className="mt-3 w-full py-2 text-sm font-medium text-primary-600 bg-primary-50 dark:bg-primary-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
              Preview & Use <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Mail className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">No templates found matching your search.</p>
        </div>
      )}

      {/* Preview Modal */}
      {previewTemplate && (
        <TemplatePreviewModal template={previewTemplate} onClose={() => setPreviewTemplate(null)} />
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create Email Template</h2>
              <button onClick={() => setShowCreate(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Template Name</label>
                <input type="text" placeholder="e.g. Black Friday Email" className="input w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select className="input w-full">
                  {categories.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject Line</label>
                <input type="text" placeholder="Enter your email subject..." className="input w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start from</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Blank Template', 'Duplicate Existing'].map(opt => (
                    <button key={opt} className={`p-3 border-2 rounded-xl text-sm transition-colors ${opt === 'Blank Template' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700' : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-slate-300'}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreate(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={() => setShowCreate(false)} className="btn-primary flex-1">Create Template</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
