import { useState } from 'react'
import { Users, Plus, Search, Mail, Phone, Building, DollarSign, Calendar, ChevronRight, Star, Edit, Trash2 } from 'lucide-react'

const customers = [
  { id: 1, name: 'Acme Corp', email: 'contact@acme.com', phone: '+1 555-0101', plan: 'Enterprise', mrr: 2500, status: 'active', sites: 12, since: '2022-03-15' },
  { id: 2, name: 'TechStart Inc', email: 'hello@techstart.io', phone: '+1 555-0102', plan: 'Business', mrr: 500, status: 'active', sites: 5, since: '2023-01-20' },
  { id: 3, name: 'Global Media', email: 'info@globalmedia.com', phone: '+1 555-0103', plan: 'Enterprise', mrr: 3500, status: 'active', sites: 25, since: '2021-08-10' },
  { id: 4, name: 'Local Shop', email: 'owner@localshop.com', phone: '+1 555-0104', plan: 'Starter', mrr: 50, status: 'active', sites: 1, since: '2024-01-05' },
  { id: 5, name: 'DevAgency', email: 'team@devagency.co', phone: '+1 555-0105', plan: 'Business', mrr: 750, status: 'churned', sites: 8, since: '2022-11-30' },
]

const deals = [
  { id: 1, name: 'Enterprise Migration', customer: 'BigCorp Ltd', value: 15000, stage: 'negotiation', probability: 75 },
  { id: 2, name: 'Annual Renewal', customer: 'Acme Corp', value: 30000, stage: 'proposal', probability: 90 },
  { id: 3, name: 'New Hosting Package', customer: 'StartupXYZ', value: 5000, stage: 'qualification', probability: 40 },
  { id: 4, name: 'Managed Services', customer: 'MediumBiz', value: 12000, stage: 'closed-won', probability: 100 },
]

export default function CRM() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('customers')

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(search.toLowerCase()) ||
    customer.email.toLowerCase().includes(search.toLowerCase())
  )

  const totalMRR = customers.filter(c => c.status === 'active').reduce((sum, c) => sum + c.mrr, 0)
  const pipelineValue = deals.filter(d => d.stage !== 'closed-won').reduce((sum, d) => sum + d.value, 0)

  const stageColors = {
    qualification: 'bg-slate-100 dark:bg-slate-700',
    proposal: 'bg-blue-100 dark:bg-blue-900/30',
    negotiation: 'bg-yellow-100 dark:bg-yellow-900/30',
    'closed-won': 'bg-green-100 dark:bg-green-900/30',
    'closed-lost': 'bg-red-100 dark:bg-red-900/30',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">CRM</h1>
          <p className="text-slate-500 dark:text-slate-400">Customer relationship management</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Customer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Customers</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{customers.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Monthly Revenue</p>
          <p className="text-2xl font-bold text-green-500">${totalMRR.toLocaleString()}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Pipeline Value</p>
          <p className="text-2xl font-bold text-primary-500">${pipelineValue.toLocaleString()}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Active Deals</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{deals.filter(d => d.stage !== 'closed-won').length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="flex gap-4">
          {['customers', 'deals', 'tickets'].map(tab => (
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

      {/* Customers Tab */}
      {activeTab === 'customers' && (
        <div className="card">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search customers..."
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
                  <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Customer</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Plan</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">MRR</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Sites</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Status</th>
                  <th className="text-right p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map(customer => (
                  <tr key={customer.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                          <Building className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{customer.name}</p>
                          <p className="text-sm text-slate-500">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`badge ${
                        customer.plan === 'Enterprise' ? 'badge-info' :
                        customer.plan === 'Business' ? 'badge-warning' : 'badge-success'
                      }`}>
                        {customer.plan}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-slate-900 dark:text-white">${customer.mrr}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-slate-600 dark:text-slate-300">{customer.sites}</span>
                    </td>
                    <td className="p-4">
                      <span className={`badge ${customer.status === 'active' ? 'badge-success' : 'badge-error'}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
                          <Mail className="w-4 h-4 text-slate-500" />
                        </button>
                        <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
                          <Edit className="w-4 h-4 text-slate-500" />
                        </button>
                        <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
                          <ChevronRight className="w-4 h-4 text-slate-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Deals Tab */}
      {activeTab === 'deals' && (
        <div className="card">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900 dark:text-white">Sales Pipeline</h3>
            <button className="btn-primary text-sm flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Deal
            </button>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {deals.map(deal => (
              <div key={deal.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stageColors[deal.stage]}`}>
                      <DollarSign className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{deal.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{deal.customer}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-slate-900 dark:text-white">${deal.value.toLocaleString()}</p>
                      <p className="text-sm text-slate-500">{deal.probability}% probability</p>
                    </div>
                    <span className={`badge ${
                      deal.stage === 'closed-won' ? 'badge-success' :
                      deal.stage === 'negotiation' ? 'badge-warning' :
                      deal.stage === 'proposal' ? 'badge-info' : 'badge-secondary'
                    }`}>
                      {deal.stage}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tickets Tab */}
      {activeTab === 'tickets' && (
        <div className="card p-6">
          <div className="text-center py-8">
            <Users className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Support Tickets</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">No open tickets at this time</p>
            <button className="btn-primary">Create Ticket</button>
          </div>
        </div>
      )}
    </div>
  )
}
