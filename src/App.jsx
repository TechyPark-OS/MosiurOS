import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useState, createContext, useContext, useEffect } from 'react'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Servers from './pages/Servers'
import ServerDetail from './pages/ServerDetail'
import Sites from './pages/Sites'
import SiteDetail from './pages/SiteDetail'
import DNS from './pages/DNS'
import Email from './pages/Email'
import SSL from './pages/SSL'
import Firewall from './pages/Firewall'
import Files from './pages/Files'
import Databases from './pages/Databases'
import Backups from './pages/Backups'
import Containers from './pages/Containers'
import AppStore from './pages/AppStore'
import Monitoring from './pages/Monitoring'
import Alerts from './pages/Alerts'
import Users from './pages/Users'
import Organizations from './pages/Organizations'
import CRM from './pages/CRM'
import Billing from './pages/Billing'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Verify from './pages/Verify'
import Invite from './pages/Invite'
// ClickFunnels Feature Pages
import Funnels from './pages/Funnels'
import LandingPages from './pages/LandingPages'
import EcomStore from './pages/EcomStore'
import GlobalProducts from './pages/GlobalProducts'
import SmartCheckout from './pages/SmartCheckout'
import Courses from './pages/Courses'
import Memberships from './pages/Memberships'
import EmailMarketing from './pages/EmailMarketing'
import Workflows from './pages/Workflows'
import Opportunities from './pages/Opportunities'
import Appointments from './pages/Appointments'
import Contacts from './pages/Contacts'
import MessageHub from './pages/MessageHub'
import Community from './pages/Community'
import Blog from './pages/Blog'
import CustomerCenter from './pages/CustomerCenter'
import Analytics from './pages/Analytics'
import Surveys from './pages/Surveys'
import Countdown from './pages/Countdown'
import Affiliates from './pages/Affiliates'
import ShortLinks from './pages/ShortLinks'
import ABTesting from './pages/ABTesting'
import DevConsole from './pages/DevConsole'
import EmailTemplates from './pages/EmailTemplates'
import Payments from './pages/Payments'
import Landing from './pages/Landing'
import Pricing from './pages/Pricing'
import Features from './pages/Features'
import CaseStudies from './pages/CaseStudies'

const API_URL = import.meta.env.VITE_API_URL || 'https://3000-ira245erppsrdirm200d8-23969b88.us1.manus.computer';

// Auth Context
const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

// Theme Context
const ThemeContext = createContext()

export function useTheme() {
  return useContext(ThemeContext)
}

// Mock Data Context
const DataContext = createContext()

export function useData() {
  return useContext(DataContext)
}

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

// Initial mock data
const initialData = {
  servers: [
    { id: 1, name: 'prod-web-01', ip: '192.168.1.10', status: 'online', os: 'Ubuntu 22.04', cpu: 45, ram: 62, disk: 28, uptime: '45 days', sites: 12, containers: 5 },
    { id: 2, name: 'prod-db-01', ip: '192.168.1.11', status: 'online', os: 'Ubuntu 22.04', cpu: 32, ram: 78, disk: 45, uptime: '45 days', sites: 0, containers: 3 },
    { id: 3, name: 'staging-01', ip: '192.168.1.20', status: 'warning', os: 'Ubuntu 22.04', cpu: 89, ram: 85, disk: 72, uptime: '12 days', sites: 8, containers: 2 },
    { id: 4, name: 'dev-01', ip: '192.168.1.30', status: 'online', os: 'Debian 12', cpu: 15, ram: 35, disk: 20, uptime: '30 days', sites: 5, containers: 8 },
    { id: 5, name: 'backup-01', ip: '192.168.1.40', status: 'offline', os: 'Ubuntu 22.04', cpu: 0, ram: 0, disk: 95, uptime: '0 days', sites: 0, containers: 0 },
  ],
  sites: [
    { id: 1, domain: 'techypark.com', server: 'prod-web-01', ssl: true, php: '8.2', type: 'WordPress', status: 'active', visits: 15420, storage: '2.4 GB' },
    { id: 2, domain: 'api.techypark.com', server: 'prod-web-01', ssl: true, php: '8.2', type: 'Laravel', status: 'active', visits: 89500, storage: '1.2 GB' },
    { id: 3, domain: 'docs.techypark.com', server: 'prod-web-01', ssl: true, php: null, type: 'Static', status: 'active', visits: 5200, storage: '450 MB' },
    { id: 4, domain: 'staging.techypark.com', server: 'staging-01', ssl: true, php: '8.1', type: 'WordPress', status: 'maintenance', visits: 120, storage: '1.8 GB' },
    { id: 5, domain: 'blog.techypark.com', server: 'prod-web-01', ssl: true, php: '8.2', type: 'WordPress', status: 'active', visits: 8900, storage: '3.1 GB' },
    { id: 6, domain: 'shop.techypark.com', server: 'prod-web-01', ssl: true, php: '8.2', type: 'WooCommerce', status: 'active', visits: 12300, storage: '5.6 GB' },
  ],
  dnsZones: [
    { id: 1, domain: 'techypark.com', records: 15, provider: 'Built-in', status: 'active' },
    { id: 2, domain: 'techypark.io', records: 8, provider: 'Cloudflare', status: 'active' },
    { id: 3, domain: 'techypark.dev', records: 5, provider: 'Built-in', status: 'active' },
  ],
  mailboxes: [
    { id: 1, email: 'admin@techypark.com', storage: '2.1 GB', quota: '5 GB', status: 'active' },
    { id: 2, email: 'support@techypark.com', storage: '4.2 GB', quota: '10 GB', status: 'active' },
    { id: 3, email: 'sales@techypark.com', storage: '1.5 GB', quota: '5 GB', status: 'active' },
    { id: 4, email: 'dev@techypark.com', storage: '800 MB', quota: '5 GB', status: 'active' },
  ],
  certificates: [
    { id: 1, domain: 'techypark.com', type: "Let's Encrypt", expires: '2024-03-15', status: 'valid', autoRenew: true },
    { id: 2, domain: '*.techypark.com', type: "Let's Encrypt", expires: '2024-03-15', status: 'valid', autoRenew: true },
    { id: 3, domain: 'techypark.io', type: 'Custom', expires: '2024-02-01', status: 'expiring', autoRenew: false },
  ],
  containers: [
    { id: 1, name: 'redis-cache', image: 'redis:7-alpine', status: 'running', cpu: 5, ram: 128, ports: '6379:6379', server: 'prod-web-01' },
    { id: 2, name: 'mongodb', image: 'mongo:6', status: 'running', cpu: 15, ram: 512, ports: '27017:27017', server: 'prod-db-01' },
    { id: 3, name: 'n8n-workflows', image: 'n8nio/n8n:latest', status: 'running', cpu: 8, ram: 256, ports: '5678:5678', server: 'prod-web-01' },
    { id: 4, name: 'elasticsearch', image: 'elasticsearch:8.11', status: 'stopped', cpu: 0, ram: 0, ports: '9200:9200', server: 'prod-db-01' },
  ],
  alerts: [
    { id: 1, type: 'warning', title: 'High CPU Usage', message: 'Server staging-01 CPU at 89%', server: 'staging-01', time: '5 min ago', read: false },
    { id: 2, type: 'error', title: 'Server Offline', message: 'Server backup-01 is not responding', server: 'backup-01', time: '2 hours ago', read: false },
    { id: 3, type: 'info', title: 'SSL Expiring Soon', message: 'Certificate for techypark.io expires in 30 days', time: '1 day ago', read: true },
    { id: 4, type: 'success', title: 'Backup Completed', message: 'Daily backup for prod-web-01 completed', server: 'prod-web-01', time: '6 hours ago', read: true },
  ],
  users: [
    { id: 1, name: 'John Admin', email: 'john@techypark.com', role: 'Admin', status: 'active', lastLogin: '2024-01-15 10:30' },
    { id: 2, name: 'Sarah Manager', email: 'sarah@techypark.com', role: 'Reseller', status: 'active', lastLogin: '2024-01-15 09:15' },
    { id: 3, name: 'Mike Developer', email: 'mike@techypark.com', role: 'Client', status: 'active', lastLogin: '2024-01-14 16:45' },
    { id: 4, name: 'Lisa Support', email: 'lisa@techypark.com', role: 'Support', status: 'active', lastLogin: '2024-01-15 11:00' },
  ],
  organizations: [
    { id: 1, name: 'TechyPark Inc', plan: 'Enterprise', servers: 5, sites: 25, users: 10, status: 'active' },
    { id: 2, name: 'Acme Corp', plan: 'Business', servers: 2, sites: 8, users: 5, status: 'active' },
    { id: 3, name: 'StartupXYZ', plan: 'Starter', servers: 1, sites: 3, users: 2, status: 'active' },
  ],
  contacts: [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', company: 'Tech Solutions', status: 'lead', value: 15000 },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', company: 'Digital Agency', status: 'qualified', value: 25000 },
    { id: 3, name: 'Carol White', email: 'carol@example.com', company: 'E-commerce Plus', status: 'customer', value: 50000 },
    { id: 4, name: 'David Brown', email: 'david@example.com', company: 'Cloud Services', status: 'negotiation', value: 35000 },
  ],
  backups: [
    { id: 1, name: 'Full Backup - prod-web-01', type: 'full', size: '15.2 GB', date: '2024-01-15 02:00', status: 'completed', target: 'S3' },
    { id: 2, name: 'Database Backup - prod-db-01', type: 'database', size: '2.8 GB', date: '2024-01-15 03:00', status: 'completed', target: 'Local' },
    { id: 3, name: 'Incremental - prod-web-01', type: 'incremental', size: '1.2 GB', date: '2024-01-15 14:00', status: 'in_progress', target: 'S3' },
  ],
}

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [data, setData] = useState(initialData)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const validateSession = async () => {
      const sessionToken = localStorage.getItem('techypark_session')
      
      if (sessionToken) {
        try {
          const response = await fetch(`${API_URL}/api/auth/session`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionToken }),
          })

          if (response.ok) {
            const data = await response.json()
            if (data.valid && data.user) {
              setUser(data.user)
              localStorage.setItem('techypark_user', JSON.stringify(data.user))
            } else {
              localStorage.removeItem('techypark_session')
              localStorage.removeItem('techypark_user')
            }
          } else {
            localStorage.removeItem('techypark_session')
            localStorage.removeItem('techypark_user')
          }
        } catch (error) {
          console.error('Session validation error:', error)
          const storedUser = localStorage.getItem('techypark_user')
          if (storedUser) {
            try { setUser(JSON.parse(storedUser)) } catch (e) { localStorage.removeItem('techypark_user') }
          }
        }
      }
      
      setIsLoading(false)
    }

    validateSession()
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('techypark_user', JSON.stringify(userData))
  }

  const logout = async () => {
    const sessionToken = localStorage.getItem('techypark_session')
    
    if (sessionToken) {
      try {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionToken }),
        })
      } catch (error) {
        console.error('Logout error:', error)
      }
    }
    
    setUser(null)
    localStorage.removeItem('techypark_user')
    localStorage.removeItem('techypark_session')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
        <DataContext.Provider value={{ data, setData }}>
          <div className={darkMode ? 'dark' : ''}>
            <Routes>
              {/* Public Landing Pages */}
              <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Landing />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/features" element={<Features />} />
              <Route path="/case-studies" element={<CaseStudies />} />
              
              {/* Public Routes */}
              <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/invite" element={<Invite />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                {/* Infrastructure */}
                <Route path="servers" element={<Servers />} />
                <Route path="servers/:id" element={<ServerDetail />} />
                <Route path="sites" element={<Sites />} />
                <Route path="sites/:id" element={<SiteDetail />} />
                <Route path="containers" element={<Containers />} />
                <Route path="app-store" element={<AppStore />} />
                {/* Domains & Email */}
                <Route path="dns" element={<DNS />} />
                <Route path="email" element={<Email />} />
                {/* Security */}
                <Route path="ssl" element={<SSL />} />
                <Route path="firewall" element={<Firewall />} />
                {/* Storage */}
                <Route path="files" element={<Files />} />
                <Route path="databases" element={<Databases />} />
                <Route path="backups" element={<Backups />} />
                {/* Monitoring */}
                <Route path="monitoring" element={<Monitoring />} />
                <Route path="alerts" element={<Alerts />} />
                {/* Funnels & Pages */}
                <Route path="funnels" element={<Funnels />} />
                <Route path="landing-pages" element={<LandingPages />} />
                {/* Store & Products */}
                <Route path="store" element={<EcomStore />} />
                <Route path="products" element={<GlobalProducts />} />
                <Route path="checkout" element={<SmartCheckout />} />
                {/* Courses & Memberships */}
                <Route path="courses" element={<Courses />} />
                <Route path="memberships" element={<Memberships />} />
                {/* Marketing */}
                <Route path="email-marketing" element={<EmailMarketing />} />
                <Route path="workflows" element={<Workflows />} />
                <Route path="countdown" element={<Countdown />} />
               <Route path="/ab-testing" element={<ABTesting />} />
          <Route path="/dev-console" element={<DevConsole />} />
                <Route path="email-templates" element={<EmailTemplates />} />
                {/* CRM & Sales */}
                <Route path="contacts" element={<Contacts />} />
                <Route path="opportunities" element={<Opportunities />} />
                <Route path="appointments" element={<Appointments />} />
                <Route path="message-hub" element={<MessageHub />} />
                {/* Community & Content */}
                <Route path="community" element={<Community />} />
                <Route path="blog" element={<Blog />} />
                <Route path="customer-center" element={<CustomerCenter />} />
                {/* Analytics & Tools */}
                <Route path="analytics" element={<Analytics />} />
                <Route path="surveys" element={<Surveys />} />
                <Route path="short-links" element={<ShortLinks />} />
                {/* Business */}
                <Route path="affiliates" element={<Affiliates />} />
                <Route path="payments" element={<Payments />} />
                <Route path="crm" element={<CRM />} />
                <Route path="billing" element={<Billing />} />
                {/* Management */}
                <Route path="users" element={<Users />} />
                <Route path="organizations" element={<Organizations />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </div>
        </DataContext.Provider>
      </ThemeContext.Provider>
    </AuthContext.Provider>
  )
}

export default App
