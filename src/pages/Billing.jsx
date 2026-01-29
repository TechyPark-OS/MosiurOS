import { useState } from 'react'
import { CreditCard, Plus, Search, Download, Send, CheckCircle, Clock, AlertCircle, DollarSign, TrendingUp, Receipt } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const invoices = [
  { id: 'INV-2024-001', customer: 'Acme Corp', amount: 2500, status: 'paid', date: '2024-01-15', dueDate: '2024-01-30' },
  { id: 'INV-2024-002', customer: 'TechStart Inc', amount: 500, status: 'paid', date: '2024-01-18', dueDate: '2024-02-02' },
  { id: 'INV-2024-003', customer: 'Global Media', amount: 3500, status: 'pending', date: '2024-01-20', dueDate: '2024-02-04' },
  { id: 'INV-2024-004', customer: 'Local Shop', amount: 50, status: 'overdue', date: '2024-01-05', dueDate: '2024-01-20' },
  { id: 'INV-2024-005', customer: 'DevAgency', amount: 750, status: 'pending', date: '2024-01-22', dueDate: '2024-02-06' },
]

const revenueData = [
  { month: 'Aug', revenue: 45000 },
  { month: 'Sep', revenue: 52000 },
  { month: 'Oct', revenue: 48000 },
  { month: 'Nov', revenue: 61000 },
  { month: 'Dec', revenue: 55000 },
  { month: 'Jan', revenue: 68000 },
]

const plans = [
  { id: 1, name: 'Starter', price: 29, features: ['1 Site', '5GB Storage', 'Basic Support'] },
  { id: 2, name: 'Business', price: 99, features: ['10 Sites', '50GB Storage', 'Priority Support', 'SSL Included'] },
  { id: 3, name: 'Enterprise', price: 299, features: ['Unlimited Sites', '500GB Storage', '24/7 Support', 'Dedicated IP', 'Custom Solutions'] },
]

export default function Billing() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('invoices')

  const filteredInvoices = invoices.filter(invoice =>
    invoice.id.toLowerCase().includes(search.toLowerCase()) ||
    invoice.customer.toLowerCase().includes(search.toLowerCase())
  )

  const statusColors = {
    paid: 'badge-success',
    pending: 'badge-warning',
    overdue: 'badge-error',
  }

  const statusIcons = {
    paid: CheckCircle,
    pending: Clock,
    overdue: AlertCircle,
  }

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0)
  const pendingAmount = invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0)
  const overdueAmount = invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Billing</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage invoices and payments</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Invoice
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Collected</p>
              <p className="text-xl font-bold text-green-500">${totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Pending</p>
              <p className="text-xl font-bold text-yellow-500">${pendingAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Overdue</p>
              <p className="text-xl font-bold text-red-500">${overdueAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">MRR Growth</p>
              <p className="text-xl font-bold text-primary-500">+12%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="flex gap-4">
          {['invoices', 'plans', 'revenue'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 border-b-2 transition-colors capitalize ${
                activeTab === tab
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <div className="card">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search invoices..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Invoice</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Customer</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Amount</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Date</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Status</th>
                  <th className="text-right p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map(invoice => {
                  const StatusIcon = statusIcons[invoice.status]
                  return (
                    <tr key={invoice.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Receipt className="w-5 h-5 text-primary-500" />
                          <span className="font-mono font-medium text-slate-900 dark:text-white">{invoice.id}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-slate-600 dark:text-slate-300">{invoice.customer}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-slate-900 dark:text-white">${invoice.amount.toLocaleString()}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-slate-500">{invoice.date}</span>
                      </td>
                      <td className="p-4">
                        <span className={`badge ${statusColors[invoice.status]} flex items-center gap-1 w-fit`}>
                          <StatusIcon className="w-3 h-3" />
                          {invoice.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700" title="Download">
                            <Download className="w-4 h-4 text-slate-500" />
                          </button>
                          <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700" title="Send">
                            <Send className="w-4 h-4 text-slate-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Plans Tab */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div key={plan.id} className={`card p-6 ${index === 1 ? 'ring-2 ring-primary-500' : ''}`}>
              {index === 1 && (
                <span className="badge badge-info mb-4">Most Popular</span>
              )}
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">${plan.price}</span>
                <span className="text-slate-500 dark:text-slate-400">/month</span>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className={`w-full ${index === 1 ? 'btn-primary' : 'btn-secondary'}`}>
                {index === 1 ? 'Current Plan' : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Revenue Tab */}
      {activeTab === 'revenue' && (
        <div className="card p-4">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Revenue Overview</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#0066FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
