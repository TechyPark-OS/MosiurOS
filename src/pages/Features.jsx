import React from 'react';
import { Zap, BarChart3, Users, Rocket, Lock, Smartphone, Mail, Workflow, ShoppingCart, BookOpen, TrendingUp, Globe } from 'lucide-react';


export default function Features() {
  const featureCategories = [
    {
      title: 'Funnel Building',
      icon: Rocket,
      features: [
        'Drag-and-drop page builder',
        'Pre-built funnel templates',
        'Multi-step sales funnels',
        'Countdown timers',
        'Order bumps & upsells',
        'A/B split testing'
      ]
    },
    {
      title: 'Email Marketing',
      icon: Mail,
      features: [
        'Email campaign builder',
        'Automation workflows',
        'Segmentation & tagging',
        'Subscriber management',
        'Email templates',
        'Delivery analytics'
      ]
    },
    {
      title: 'Ecommerce',
      icon: ShoppingCart,
      features: [
        'Product catalog',
        'Shopping cart',
        'Payment processing',
        'Inventory management',
        'Order management',
        'Discount codes'
      ]
    },
    {
      title: 'Courses & Memberships',
      icon: BookOpen,
      features: [
        'Course builder',
        'Membership sites',
        'Drip-feed content',
        'Student progress tracking',
        'Certificates',
        'Access control'
      ]
    },
    {
      title: 'CRM & Sales',
      icon: Users,
      features: [
        'Contact management',
        'Sales pipeline',
        'Appointment scheduling',
        'Deal tracking',
        'Task management',
        'Team collaboration'
      ]
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      features: [
        'Real-time analytics',
        'Conversion tracking',
        'Funnel analytics',
        'Traffic sources',
        'Custom reports',
        'Data export'
      ]
    },
    {
      title: 'Automation',
      icon: Workflow,
      features: [
        'Workflow builder',
        'Conditional logic',
        'Trigger-based actions',
        'Email sequences',
        'Integration automation',
        'Custom webhooks'
      ]
    },
    {
      title: 'Security',
      icon: Lock,
      features: [
        'SSL encryption',
        'Two-factor auth',
        'Role-based access',
        'Data backups',
        'GDPR compliant',
        'Audit logs'
      ]
    },
  ];

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-800 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">Powerful Features</h1>
          <p className="text-xl text-slate-300">Everything you need to build, launch, and scale your business</p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {featureCategories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <div key={idx} className="p-8 bg-slate-700/50 border border-slate-600 rounded-xl hover:border-blue-500/50 transition-all hover:bg-slate-700/80">
                <Icon className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-4">{category.title}</h3>
                <ul className="space-y-2">
                  {category.features.map((feature, i) => (
                    <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Detailed Features */}
        <div className="space-y-16">
          {/* Funnel Builder */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Build Funnels in Minutes</h2>
              <p className="text-slate-300 mb-6">
                Our drag-and-drop funnel builder makes it easy to create high-converting sales funnels without any coding. Choose from pre-built templates or start from scratch.
              </p>
              <ul className="space-y-3">
                {['Multi-step funnels', 'Pre-built templates', 'Drag-and-drop editor', 'Mobile responsive'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <Zap className="w-5 h-5 text-blue-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-8 h-64 flex items-center justify-center">
              <div className="text-center">
                <Rocket className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <p className="text-slate-400">Funnel Builder Preview</p>
              </div>
            </div>
          </div>

          {/* Email Marketing */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-8 h-64 flex items-center justify-center order-2 md:order-1">
              <div className="text-center">
                <Mail className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <p className="text-slate-400">Email Automation Preview</p>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold text-white mb-4">Powerful Email Marketing</h2>
              <p className="text-slate-300 mb-6">
                Create automated email sequences that nurture leads and convert them into customers. Build complex workflows with conditional logic.
              </p>
              <ul className="space-y-3">
                {['Email sequences', 'Automation workflows', 'Segmentation', 'A/B testing'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <Mail className="w-5 h-5 text-purple-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Analytics */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Real-Time Analytics</h2>
              <p className="text-slate-300 mb-6">
                Track every visitor, click, and conversion with our advanced analytics dashboard. Get insights that help you optimize your funnels.
              </p>
              <ul className="space-y-3">
                {['Real-time tracking', 'Conversion metrics', 'Traffic sources', 'Custom reports'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <BarChart3 className="w-5 h-5 text-green-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-8 h-64 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <p className="text-slate-400">Analytics Dashboard Preview</p>
              </div>
            </div>
          </div>

          {/* Integrations */}
          <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Integrations</h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Connect with your favorite tools and services. We integrate with 500+ apps including payment processors, CRMs, email providers, and more.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Stripe', 'PayPal', 'Zapier', 'Slack', 'HubSpot', 'Mailchimp', 'Google Analytics', 'Facebook'].map((app, i) => (
                <div key={i} className="p-4 bg-slate-600/50 rounded-lg text-slate-300">
                  {app}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to explore all features?</h2>
          <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all">
            Start Your Free Trial
          </button>
        </div>
      </div>
    </div>
  )
}
