import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTheme, useData, useAuth } from '../App'
import ImpersonationBanner from './ImpersonationBanner'
import { useModules } from '../hooks/useModules'
import {
  LayoutDashboard, Server, Globe, Database, Shield, FolderOpen,
  HardDrive, Container, Store, Activity, Bell, Users, Building2,
  Receipt, Settings, Menu, X, Moon, Sun, ChevronDown, ChevronRight,
  Mail, Lock, Flame, Archive, Search, LogOut,
  // ClickFunnels icons
  Zap, FileText, ShoppingCart, Package, CreditCard, GraduationCap,
  Crown, Send, GitBranch, Timer, UserCheck, DollarSign, Calendar,
  MessageSquare, MessagesSquare, BookOpen, Headphones, BarChart3,
  ClipboardList, Link2, Share2, Target, Percent
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { 
    name: 'Funnels & Pages', 
    icon: Zap,
    children: [
      { name: 'Sales Funnels', href: '/funnels', icon: Zap },
      { name: 'Landing Pages', href: '/landing-pages', icon: FileText },
      { name: 'Countdown Funnels', href: '/countdown', icon: Timer },
    ]
  },
  { 
    name: 'Store & Products', 
    icon: ShoppingCart,
    children: [
      { name: 'Ecommerce Store', href: '/store', icon: Store },
      { name: 'Products', href: '/products', icon: Package },
      { name: 'Smart Checkout', href: '/checkout', icon: CreditCard },
    ]
  },
  { 
    name: 'Courses & Members', 
    icon: GraduationCap,
    children: [
      { name: 'Online Courses', href: '/courses', icon: GraduationCap },
      { name: 'Memberships', href: '/memberships', icon: Crown },
    ]
  },
  { 
    name: 'Marketing', 
    icon: Send,
    children: [
      { name: 'Email Marketing', href: '/email-marketing', icon: Send },
      { name: 'Email Templates', href: '/email-templates', icon: FileText },
      { name: 'Workflows', href: '/workflows', icon: GitBranch },
      { name: 'A/B Testing', href: '/ab-testing', icon: Percent },
      { name: 'Surveys', href: '/surveys', icon: ClipboardList },
    ]
  },
  { 
    name: 'CRM & Sales', 
    icon: Target,
    children: [
      { name: 'Contacts', href: '/contacts', icon: UserCheck },
      { name: 'Opportunities', href: '/opportunities', icon: DollarSign },
      { name: 'Appointments', href: '/appointments', icon: Calendar },
      { name: 'Message Hub', href: '/message-hub', icon: MessageSquare },
    ]
  },
  { 
    name: 'Community & Content', 
    icon: MessagesSquare,
    children: [
      { name: 'Community', href: '/community', icon: MessagesSquare },
      { name: 'Blog', href: '/blog', icon: BookOpen },
      { name: 'Customer Center', href: '/customer-center', icon: Headphones },
    ]
  },
  { 
    name: 'Analytics & Tools', 
    icon: BarChart3,
    children: [
      { name: 'Analytics', href: '/analytics', icon: BarChart3 },
      { name: 'Short Links', href: '/short-links', icon: Link2 },
    ]
  },
  { 
    name: 'Revenue', 
    icon: DollarSign,
    children: [
      { name: 'Payments', href: '/payments', icon: CreditCard },
      { name: 'Affiliates', href: '/affiliates', icon: Share2 },
      { name: 'Billing', href: '/billing', icon: Receipt },
    ]
  },
  {
    name: 'Infrastructure',
    icon: Server,
    children: [
      { name: 'Servers', href: '/servers', icon: Server },
      { name: 'Sites', href: '/sites', icon: Globe },
      { name: 'Containers', href: '/containers', icon: Container },
      { name: 'App Store', href: '/app-store', icon: Store },
    ]
  },
  { 
    name: 'Domains & Email', 
    icon: Mail,
    children: [
      { name: 'DNS Manager', href: '/dns', icon: Globe },
      { name: 'Email Hosting', href: '/email', icon: Mail },
    ]
  },
  { 
    name: 'Security', 
    icon: Shield,
    children: [
      { name: 'SSL Certificates', href: '/ssl', icon: Lock },
      { name: 'Firewall', href: '/firewall', icon: Flame },
    ]
  },
  { 
    name: 'Storage', 
    icon: FolderOpen,
    children: [
      { name: 'File Manager', href: '/files', icon: FolderOpen },
      { name: 'Databases', href: '/databases', icon: Database },
      { name: 'Backups', href: '/backups', icon: Archive },
    ]
  },
  { 
    name: 'Monitoring', 
    icon: Activity,
    children: [
      { name: 'Metrics', href: '/monitoring', icon: Activity },
      { name: 'Alerts', href: '/alerts', icon: Bell },
    ]
  },
  { 
    name: 'Management', 
    icon: Users,
    children: [
      { name: 'Users', href: '/users', icon: Users },
      { name: 'Organizations', href: '/organizations', icon: Building2 },
      { name: 'CRM (Legacy)', href: '/crm', icon: Users },
    ]
  },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Super Admin', href: '/admin', icon: Shield, adminOnly: true },
]

function NavItem({ item, collapsed }) {
  const [expanded, setExpanded] = useState(false)
  const location = useLocation()
  
  if (item.children) {
    const isActive = item.children.some(child => location.pathname === child.href)
    
    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className={`w-full sidebar-item ${isActive ? 'sidebar-item-active' : ''}`}
        >
          <item.icon className="w-5 h-5 flex-shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left">{item.name}</span>
              {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </>
          )}
        </button>
        {expanded && !collapsed && (
          <div className="ml-4 mt-1 space-y-1">
            {item.children.map((child) => (
              <NavLink
                key={child.href}
                to={child.href}
                className={({ isActive }) =>
                  `sidebar-item text-sm ${isActive ? 'sidebar-item-active' : ''}`
                }
              >
                <child.icon className="w-4 h-4 flex-shrink-0" />
                <span>{child.name}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <NavLink
      to={item.href}
      end={item.href === '/'}
      className={({ isActive }) =>
        `sidebar-item ${isActive ? 'sidebar-item-active' : ''}`
      }
    >
      <item.icon className="w-5 h-5 flex-shrink-0" />
      {!collapsed && <span>{item.name}</span>}
    </NavLink>
  )
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const { hasAccess } = useModules()
  const navigate = useNavigate()
  const data = useData()
  
  const unreadAlerts = data.alerts.filter(a => !a.read).length

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getUserInitials = () => {
    if (!user?.name) return 'U'
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }
  return (
    <>
      <ImpersonationBanner />
      <div className="flex h-screen bg-slate-50 dark:bg-slate-900" style={{ marginTop: localStorage.getItem('impersonationToken') ? '48px' : '0' }}>
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-700">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="TechyPark" className="w-8 h-8 rounded-lg" />
              <span className="font-bold text-slate-900 dark:text-white">TechyPark</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 hidden lg:block"
          >
            <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 lg:hidden"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-0.5 overflow-y-auto h-[calc(100vh-8rem)] scrollbar-thin">
          {navigation.filter(item => !item.adminOnly || user?.role === 'Admin').map((item) => (
            <NavItem key={item.name} item={item} collapsed={!sidebarOpen} />
          ))}
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <span className="text-white font-medium">{getUserInitials()}</span>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.role || 'Member'}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Top bar */}
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 lg:hidden"
            >
              <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search funnels, products, contacts..."
                className="w-64 lg:w-80 pl-10 pr-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 border-0 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              )}
            </button>
            <NavLink
              to="/alerts"
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 relative"
            >
              <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              {unreadAlerts > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadAlerts}
                </span>
              )}
            </NavLink>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
              title="Sign out"
            >
              <LogOut className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
    </>
  )
}
