import React, { useState, useEffect, useRef } from 'react';
import { Zap, BarChart3, Users, Rocket, Lock, Mail, Workflow, ShoppingCart, BookOpen, TrendingUp, Globe, Server, Shield, Database, Container, Bell, CreditCard, Target, MessageSquare, Calendar, Star, ArrowRight, CheckCircle, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function FeatureSection({ title, description, features, icon: Icon, gradient, reverse, mockup }) {
  const [ref, inView] = useInView(0.15);
  return (
    <div
      ref={ref}
      className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-700 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className={reverse ? 'order-2 md:order-1' : ''}>
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${gradient} bg-opacity-10 border border-current/20 mb-4`}>
          <Icon className="w-4 h-4" />
          <span className="text-sm font-semibold">{title}</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">{description.headline}</h2>
        <p className="text-slate-400 mb-6 leading-relaxed">{description.body}</p>
        <ul className="space-y-3">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-3 text-slate-300">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </div>
      <div className={`${reverse ? 'order-1 md:order-2' : ''}`}>
        {mockup}
      </div>
    </div>
  );
}

export default function Features() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const featureCategories = [
    { icon: Rocket, title: 'Funnel Builder', color: 'text-blue-400', gradient: 'from-blue-500/20 to-cyan-500/20', features: ['Drag-and-drop page builder', 'Pre-built funnel templates', 'Multi-step sales funnels', 'Countdown timers', 'Order bumps & upsells', 'A/B split testing'] },
    { icon: Mail, title: 'Email Marketing', color: 'text-purple-400', gradient: 'from-purple-500/20 to-pink-500/20', features: ['Email campaign builder', 'Automation workflows', 'Segmentation & tagging', 'Subscriber management', 'Email templates', 'Delivery analytics'] },
    { icon: ShoppingCart, title: 'Ecommerce', color: 'text-orange-400', gradient: 'from-orange-500/20 to-red-500/20', features: ['Product catalog', 'Shopping cart', 'Payment processing', 'Inventory management', 'Order management', 'Discount codes'] },
    { icon: BookOpen, title: 'Courses', color: 'text-green-400', gradient: 'from-green-500/20 to-emerald-500/20', features: ['Course builder', 'Membership sites', 'Drip-feed content', 'Student progress tracking', 'Certificates', 'Access control'] },
    { icon: Users, title: 'CRM & Sales', color: 'text-teal-400', gradient: 'from-teal-500/20 to-blue-500/20', features: ['Contact management', 'Sales pipeline', 'Appointment scheduling', 'Deal tracking', 'Task management', 'Team collaboration'] },
    { icon: BarChart3, title: 'Analytics', color: 'text-yellow-400', gradient: 'from-yellow-500/20 to-orange-500/20', features: ['Real-time analytics', 'Conversion tracking', 'Funnel analytics', 'Traffic sources', 'Custom reports', 'Data export'] },
    { icon: Server, title: 'Infrastructure', color: 'text-indigo-400', gradient: 'from-indigo-500/20 to-purple-500/20', features: ['Server management', 'Site hosting', 'Container orchestration', 'DNS management', 'Email hosting', 'App store'] },
    { icon: Lock, title: 'Security', color: 'text-red-400', gradient: 'from-red-500/20 to-pink-500/20', features: ['SSL encryption', 'Two-factor auth', 'Role-based access', 'Data backups', 'GDPR compliant', 'Audit logs'] },
  ];

  const comparisons = [
    { feature: 'Funnel Builder', us: true, cf: true, kartra: true, kajabi: false },
    { feature: 'Server Management', us: true, cf: false, kartra: false, kajabi: false },
    { feature: 'Email Marketing', us: true, cf: true, kartra: true, kajabi: true },
    { feature: 'Course Builder', us: true, cf: true, kartra: true, kajabi: true },
    { feature: 'DNS Management', us: true, cf: false, kartra: false, kajabi: false },
    { feature: 'Container Hosting', us: true, cf: false, kartra: false, kajabi: false },
    { feature: 'CRM', us: true, cf: true, kartra: true, kajabi: false },
    { feature: 'Affiliate Center', us: true, cf: true, kartra: true, kajabi: true },
    { feature: 'White Label', us: true, cf: false, kartra: true, kajabi: false },
    { feature: 'API Access', us: true, cf: true, kartra: false, kajabi: true },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">TechyPark</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-slate-400 hover:text-white text-sm transition-colors">Home</a>
            <a href="/pricing" className="text-slate-400 hover:text-white text-sm transition-colors">Pricing</a>
            <button onClick={() => navigate('/login')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm font-semibold mb-6">
            Complete Feature Overview
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            Every Tool You Need to
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Dominate Online</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
            TechyPark Engine combines 15+ tools into one unified platform. Stop paying for multiple subscriptions.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105 transition-all duration-200 inline-flex items-center gap-2"
          >
            Start Free Trial <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Feature Tabs */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {featureCategories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeTab === i
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-700/60 border border-slate-700/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.title}
                </button>
              );
            })}
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className={`p-8 rounded-2xl bg-gradient-to-br ${featureCategories[activeTab].gradient} border border-slate-700/50 backdrop-blur-sm`}>
              <div className={`w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center mb-6 ${featureCategories[activeTab].color}`}>
                {React.createElement(featureCategories[activeTab].icon, { className: 'w-8 h-8' })}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{featureCategories[activeTab].title}</h3>
              <ul className="space-y-3">
                {featureCategories[activeTab].features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <div className="p-6 bg-slate-800/60 border border-slate-700/50 rounded-2xl">
                <h4 className="text-white font-semibold mb-2">Why it matters</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {activeTab === 0 && "Our funnel builder is the cornerstone of your online business. Create high-converting sales funnels without any technical knowledge using our intuitive drag-and-drop interface."}
                  {activeTab === 1 && "Email marketing delivers the highest ROI of any marketing channel. Our platform makes it easy to create, automate, and optimize your email campaigns for maximum impact."}
                  {activeTab === 2 && "Sell products online with confidence. Our ecommerce tools handle everything from product listings to payment processing, so you can focus on growing your business."}
                  {activeTab === 3 && "Online courses are one of the most profitable business models. Our course builder makes it easy to create, sell, and deliver world-class educational content."}
                  {activeTab === 4 && "A great CRM is the backbone of any successful sales team. Track every interaction, manage your pipeline, and close more deals with our powerful CRM tools."}
                  {activeTab === 5 && "Data-driven decisions lead to better results. Our analytics platform gives you deep insights into every aspect of your business, from funnel performance to customer behavior."}
                  {activeTab === 6 && "Manage your entire infrastructure from one dashboard. No more switching between tools — servers, sites, containers, and more, all in one place."}
                  {activeTab === 7 && "Security is not optional. Our enterprise-grade security features protect your business and your customers' data with industry-leading encryption and access controls."}
                </p>
              </div>
              <div className="p-6 bg-slate-800/60 border border-slate-700/50 rounded-2xl">
                <h4 className="text-white font-semibold mb-4">Quick Stats</h4>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Avg. Setup Time', value: '< 5 min' },
                    { label: 'Templates', value: '100+' },
                    { label: 'Integrations', value: '500+' },
                    { label: 'Uptime', value: '99.9%' },
                  ].map((stat, i) => (
                    <div key={i} className="text-center p-3 bg-slate-700/50 rounded-lg">
                      <div className="text-xl font-bold text-blue-400">{stat.value}</div>
                      <div className="text-xs text-slate-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Feature Sections */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto space-y-24">
          {/* Funnel Builder */}
          <FeatureSection
            title="Funnel Builder"
            icon={Rocket}
            gradient="from-blue-400 to-cyan-400"
            description={{
              headline: 'Build Funnels That Convert in Minutes',
              body: 'Our drag-and-drop funnel builder makes it easy to create high-converting sales funnels without any coding. Choose from 100+ pre-built templates or start from scratch with our intuitive editor.'
            }}
            features={['Multi-step funnels with unlimited pages', 'Pre-built templates for every niche', 'Mobile-responsive designs', 'One-click A/B testing']}
            reverse={false}
            mockup={
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
                  <div className="flex-1 h-5 bg-slate-700/50 rounded ml-2"></div>
                </div>
                {['Landing Page', 'Opt-in Form', 'Sales Page', 'Order Form', 'Thank You'].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      i === 0 ? 'bg-blue-500 text-white' : i === 2 ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-300'
                    }`}>{i + 1}</div>
                    <div className="flex-1 h-8 bg-slate-700/50 rounded-lg flex items-center px-3">
                      <span className="text-slate-300 text-sm">{step}</span>
                    </div>
                    {i < 4 && <div className="text-slate-500 text-xs">→</div>}
                  </div>
                ))}
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
                  <span className="text-green-400 text-sm font-semibold">Conversion Rate: 4.8%</span>
                </div>
              </div>
            }
          />

          {/* Email Marketing */}
          <FeatureSection
            title="Email Marketing"
            icon={Mail}
            gradient="from-purple-400 to-pink-400"
            description={{
              headline: 'Automate Your Email Marketing at Scale',
              body: 'Create automated email sequences that nurture leads and convert them into customers. Build complex workflows with conditional logic, segmentation, and personalization.'
            }}
            features={['Visual workflow builder', 'Behavioral triggers & conditions', 'Smart segmentation & tagging', 'Deliverability optimization']}
            reverse={true}
            mockup={
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
                <div className="text-sm text-slate-400 mb-4">Email Automation Workflow</div>
                <div className="space-y-2">
                  {[
                    { label: 'Subscriber joins list', color: 'bg-blue-500', icon: '👤' },
                    { label: 'Send welcome email', color: 'bg-purple-500', icon: '✉️' },
                    { label: 'Wait 2 days', color: 'bg-slate-600', icon: '⏰' },
                    { label: 'Opened email?', color: 'bg-yellow-500', icon: '❓' },
                    { label: 'Send follow-up', color: 'bg-green-500', icon: '📧' },
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${step.color} flex items-center justify-center text-sm`}>{step.icon}</div>
                      <div className="flex-1 h-8 bg-slate-700/50 rounded-lg flex items-center px-3">
                        <span className="text-slate-300 text-sm">{step.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-slate-700/50 rounded-lg">
                    <div className="text-blue-400 font-bold">68%</div>
                    <div className="text-xs text-slate-500">Open Rate</div>
                  </div>
                  <div className="p-2 bg-slate-700/50 rounded-lg">
                    <div className="text-green-400 font-bold">24%</div>
                    <div className="text-xs text-slate-500">Click Rate</div>
                  </div>
                  <div className="p-2 bg-slate-700/50 rounded-lg">
                    <div className="text-purple-400 font-bold">8.2%</div>
                    <div className="text-xs text-slate-500">Conv. Rate</div>
                  </div>
                </div>
              </div>
            }
          />

          {/* Analytics */}
          <FeatureSection
            title="Analytics"
            icon={BarChart3}
            gradient="from-green-400 to-emerald-400"
            description={{
              headline: 'Real-Time Analytics That Drive Decisions',
              body: 'Track every visitor, click, and conversion with our advanced analytics dashboard. Get actionable insights that help you optimize your funnels and maximize ROI.'
            }}
            features={['Real-time visitor tracking', 'Funnel conversion analytics', 'Revenue attribution', 'Custom report builder']}
            reverse={false}
            mockup={
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
                <div className="text-sm text-slate-400 mb-4">Revenue Overview — Last 30 days</div>
                <div className="flex items-end gap-1 h-32 mb-4">
                  {[30, 45, 35, 60, 50, 75, 55, 80, 65, 90, 70, 95, 80, 100, 85].map((h, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-t transition-all ${i === 14 ? 'bg-blue-400' : 'bg-blue-600/60'}`}
                      style={{ height: `${h}%` }}
                    ></div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Total Revenue', value: '$48,290', change: '+23%', color: 'text-green-400' },
                    { label: 'Conversions', value: '1,847', change: '+18%', color: 'text-blue-400' },
                    { label: 'Avg. Order Value', value: '$261', change: '+4%', color: 'text-purple-400' },
                    { label: 'Traffic', value: '38,400', change: '+31%', color: 'text-orange-400' },
                  ].map((stat, i) => (
                    <div key={i} className="p-3 bg-slate-700/50 rounded-lg">
                      <div className="text-xs text-slate-500 mb-1">{stat.label}</div>
                      <div className={`font-bold ${stat.color}`}>{stat.value}</div>
                      <div className="text-xs text-green-400">{stat.change}</div>
                    </div>
                  ))}
                </div>
              </div>
            }
          />
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">How We Compare</h2>
            <p className="text-slate-400">See why TechyPark Engine is the most complete platform available.</p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-slate-700/50">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-800/80 border-b border-slate-700/50">
                  <th className="px-6 py-4 text-left text-slate-300 font-semibold">Feature</th>
                  <th className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-blue-400 font-bold">TechyPark</span>
                      <span className="text-xs text-slate-500">$97/mo</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-slate-300 font-semibold">ClickFunnels</span>
                      <span className="text-xs text-slate-500">$297/mo</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-slate-300 font-semibold">Kartra</span>
                      <span className="text-xs text-slate-500">$199/mo</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-slate-300 font-semibold">Kajabi</span>
                      <span className="text-xs text-slate-500">$149/mo</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row, i) => (
                  <tr key={i} className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-3 text-slate-300 text-sm">{row.feature}</td>
                    <td className="px-6 py-3 text-center">
                      {row.us ? <CheckCircle className="w-5 h-5 text-green-400 mx-auto" /> : <span className="text-slate-600">—</span>}
                    </td>
                    <td className="px-6 py-3 text-center">
                      {row.cf ? <CheckCircle className="w-5 h-5 text-slate-400 mx-auto" /> : <span className="text-slate-600">—</span>}
                    </td>
                    <td className="px-6 py-3 text-center">
                      {row.kartra ? <CheckCircle className="w-5 h-5 text-slate-400 mx-auto" /> : <span className="text-slate-600">—</span>}
                    </td>
                    <td className="px-6 py-3 text-center">
                      {row.kajabi ? <CheckCircle className="w-5 h-5 text-slate-400 mx-auto" /> : <span className="text-slate-600">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">500+ Integrations</h2>
          <p className="text-slate-400 mb-12">Connect with the tools you already love. No code required.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {['Stripe', 'PayPal', 'Zapier', 'Slack', 'HubSpot', 'Mailchimp', 'Google Analytics', 'Facebook Ads', 'Shopify', 'WordPress', 'Zoom', 'Calendly', 'Twilio', 'SendGrid', 'ActiveCampaign', 'ConvertKit'].map((app, i) => (
              <div key={i} className="p-4 bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-300 text-sm font-medium hover:border-blue-500/50 hover:bg-slate-800 transition-all duration-200 hover:-translate-y-0.5">
                {app}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600"></div>
            <div className="relative p-12 text-center">
              <h2 className="text-4xl font-bold text-white mb-4">Ready to explore all features?</h2>
              <p className="text-blue-100 mb-8">Start your free trial today. No credit card required.</p>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-slate-100 hover:scale-105 transition-all duration-200 inline-flex items-center gap-2"
              >
                Start Your Free Trial <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 px-4 text-center text-slate-500 text-sm">
        <p>&copy; 2026 TechyPark Engine. All rights reserved.</p>
      </footer>
    </div>
  );
}
