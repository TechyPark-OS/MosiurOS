import { useState } from 'react'
import { Plus, Search, Users, MessageCircle, Heart, Share2, BookmarkPlus, MoreVertical, Image, Video, Link, Pin, TrendingUp, Award, Star, Eye, ThumbsUp, Clock } from 'lucide-react'

const groups = [
  { id: 1, name: 'Marketing Mastermind', members: 2450, posts: 890, active: true, description: 'Share marketing strategies and tips', image: '🎯' },
  { id: 2, name: 'Funnel Builders', members: 1800, posts: 650, active: true, description: 'Everything about building high-converting funnels', image: '🏗️' },
  { id: 3, name: 'E-commerce Success', members: 3200, posts: 1200, active: true, description: 'Grow your online store', image: '🛒' },
  { id: 4, name: 'VIP Inner Circle', members: 150, posts: 420, active: true, description: 'Exclusive group for premium members', image: '👑' },
]

const posts = [
  { id: 1, author: 'Alice Johnson', avatar: 'AJ', group: 'Marketing Mastermind', time: '2 hours ago', content: 'Just hit $100K in revenue this month using the funnel strategies we discussed! Here\'s what worked for me...', likes: 89, comments: 23, shares: 12, pinned: true },
  { id: 2, author: 'Bob Smith', avatar: 'BS', group: 'Funnel Builders', time: '4 hours ago', content: 'Has anyone tested the new 2-step checkout vs 1-step? I\'m seeing a 15% increase in conversions with the 2-step approach.', likes: 45, comments: 18, shares: 5, pinned: false },
  { id: 3, author: 'Carol White', avatar: 'CW', group: 'E-commerce Success', time: '6 hours ago', content: 'New case study: How I scaled from $0 to $50K/month with a simple product funnel. Full breakdown in the comments 👇', likes: 156, comments: 67, shares: 34, pinned: false },
  { id: 4, author: 'David Brown', avatar: 'DB', group: 'Marketing Mastermind', time: '1 day ago', content: 'Quick tip: Adding urgency timers to your landing pages can increase conversions by 20-30%. But make sure they\'re genuine!', likes: 72, comments: 15, shares: 8, pinned: false },
  { id: 5, author: 'Eva Green', avatar: 'EG', group: 'VIP Inner Circle', time: '1 day ago', content: 'Exclusive webinar replay is now available in the resources section. We covered advanced email segmentation strategies.', likes: 34, comments: 8, shares: 2, pinned: false },
]

const leaderboard = [
  { name: 'Carol White', points: 12500, badge: '🏆', rank: 1 },
  { name: 'Alice Johnson', points: 10200, badge: '🥈', rank: 2 },
  { name: 'Bob Smith', points: 8900, badge: '🥉', rank: 3 },
  { name: 'David Brown', points: 7500, badge: '⭐', rank: 4 },
  { name: 'Eva Green', points: 6800, badge: '⭐', rank: 5 },
]

export default function Community() {
  const [tab, setTab] = useState('feed')
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)

  const totalMembers = groups.reduce((s, g) => s + g.members, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Community</h1>
          <p className="text-slate-500 dark:text-slate-400">Groups, discussions, and member engagement</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> New Post</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Members', value: totalMembers.toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Active Groups', value: groups.length, icon: MessageCircle, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Posts This Week', value: '156', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
          { label: 'Engagement Rate', value: '78%', icon: Heart, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
        ].map((s, i) => (
          <div key={i} className="card p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
              <div><p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p><p className="text-lg font-bold text-slate-900 dark:text-white">{s.value}</p></div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
        {['feed', 'groups', 'leaderboard', 'moderation'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${tab === t ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{t}</button>
        ))}
      </div>

      {tab === 'feed' && (
        <div className="space-y-4">
          {posts.map(p => (
            <div key={p.id} className="card p-5 hover:shadow-md transition-shadow">
              {p.pinned && <div className="flex items-center gap-1 text-xs text-orange-600 mb-2"><Pin className="w-3 h-3" /> Pinned Post</div>}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-sm font-bold text-primary-600">{p.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white">{p.author}</span>
                    <span className="text-xs text-slate-400">in {p.group}</span>
                    <span className="text-xs text-slate-400">• {p.time}</span>
                  </div>
                </div>
                <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><MoreVertical className="w-4 h-4 text-slate-400" /></button>
              </div>
              <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">{p.content}</p>
              <div className="flex items-center gap-6 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 transition-colors"><Heart className="w-4 h-4" /> {p.likes}</button>
                <button className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-500 transition-colors"><MessageCircle className="w-4 h-4" /> {p.comments}</button>
                <button className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-green-500 transition-colors"><Share2 className="w-4 h-4" /> {p.shares}</button>
                <button className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-purple-500 transition-colors ml-auto"><BookmarkPlus className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'groups' && (
        <div className="grid sm:grid-cols-2 gap-4">
          {groups.map(g => (
            <div key={g.id} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-2xl">{g.image}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{g.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{g.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex gap-4 text-slate-500">
                  <span>{g.members.toLocaleString()} members</span>
                  <span>{g.posts} posts</span>
                </div>
                <button className="btn-secondary text-sm">Manage</button>
              </div>
            </div>
          ))}
          <div className="card p-5 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center cursor-pointer hover:border-primary-500 transition-colors">
            <div className="text-center"><Plus className="w-8 h-8 text-slate-400 mx-auto mb-2" /><p className="text-sm font-medium text-slate-500">Create Group</p></div>
          </div>
        </div>
      )}

      {tab === 'leaderboard' && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Top Contributors</h3>
          <div className="space-y-3">
            {leaderboard.map(l => (
              <div key={l.rank} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <span className="text-2xl w-8 text-center">{l.badge}</span>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 dark:text-white">{l.name}</p>
                  <p className="text-xs text-slate-400">{l.points.toLocaleString()} points</p>
                </div>
                <span className="text-sm font-bold text-slate-500">#{l.rank}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'moderation' && (
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Reported Content</h3>
            <div className="text-center py-6 text-slate-400"><CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-400" /><p>No reported content. All clear!</p></div>
          </div>
          <div className="card p-5">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Pending Approvals</h3>
            <div className="text-center py-6 text-slate-400"><CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-400" /><p>No pending approvals</p></div>
          </div>
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">New Post</h2>
              <button onClick={() => setShowCreate(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Group</label><select className="input w-full">{groups.map(g => <option key={g.id}>{g.name}</option>)}</select></div>
              <div><textarea className="input w-full" rows={4} placeholder="What's on your mind?" /></div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Image className="w-5 h-5 text-slate-400" /></button>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Video className="w-5 h-5 text-slate-400" /></button>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Link className="w-5 h-5 text-slate-400" /></button>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreate(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={() => setShowCreate(false)} className="btn-primary flex-1">Post</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
