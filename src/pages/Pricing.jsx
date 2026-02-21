import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, X, ArrowRight, Rocket, Zap, Star, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
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

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-700/50 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left bg-slate-800/40 hover:bg-slate-800/60 transition-colors"
      >
        <span className="font-semibold text-white text-sm">{question}</span>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 bg-slate-800/20">
          <p className="text-slate-400 text-sm leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function Pricing() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [ref, inView] = useInView(0.1);

  const handleCheckout = async (tier) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/stripe/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tier })
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const plans = [
    {
      name: 'Starter',
      tier: 'starter',
      icon: Zap,
      monthlyPrice: 97,
      yearlyPrice: 97,
      description: 'Perfect for small businesses getting started',
      color: 'from-slate-500 to-slate-600',
      features: [
        { name: '3 Funnels', included: true },
        { name: '10 Landing Pages', included: true },
        { name: '1,000 Contacts', included: true },
        { name: 'Email Marketing', included: true },
        { name: 'Basic Analytics', included: true },
        { name: 'Community Support', included: true },
        { name: 'Advanced automation', included: false },
        { name: 'A/B testing', included: false },
        { name: 'Priority support', included: false },
        { name: 'White-label', included: false },
      ],
      cta: 'Start 14-Day Free Trial',
      ctaStyle: 'bg-slate-700 hover:bg-slate-600 text-white',
    },
    {
      name: 'Professional',
      tier: 'professional',
      icon: Rocket,
      monthlyPrice: 997,
      yearlyPrice: 997,
      description: 'For growing businesses that need unlimited',
      color: 'from-blue-500 to-purple-600',
      highlighted: true,
      features: [
        { name: 'Unlimited Funnels', included: true },
        { name: 'Unlimited Landing Pages', included: true },
        { name: '25,000 Contacts', included: true },
        { name: 'Advanced Email Automation', included: true },
        { name: 'A/B Testing', included: true },
        { name: 'CRM & Pipeline', included: true },
        { name: 'Courses & Memberships', included: true },
        { name: 'Priority Support', included: true },
        { name: 'Custom Integrations', included: true },
        { name: 'White-label', included: false },
      ],
      cta: 'Start 14-Day Free Trial',
      ctaStyle: 'bg-white text-blue-600 hover:bg-slate-100',
    },
    {
      name: 'Premium Pro',
      tier: 'premium_pro',
      icon: Star,
      monthlyPrice: 4997,
      yearlyPrice: 4997,
      description: 'Done-for-you managed service',
      color: 'from-purple-500 to-pink-600',
      features: [
        { name: 'Everything in Professional', included: true },
        { name: 'Unlimited Contacts', included: true },
        { name: 'Dedicated Account Manager', included: true },
        { name: 'Custom integrations', included: true },
        { name: 'Unlimited custom domains', included: true },
        { name: 'Email marketing', included: true },
        { name: 'Advanced automation', included: true },
        { name: 'A/B testing', included: true },
        { name: '24/7 phone support', included: true },
        { name: 'White-label', included: true },
      ],
      cta: 'Contact Sales',
      ctaStyle: 'bg-slate-700 hover:bg-slate-600 text-white',
    },
  ];

  const comparison = [
    { category: 'Funnels', starter: '3', pro: 'Unlimited', enterprise: 'Unlimited + DFY' },
    { category: 'Landing Pages', starter: '5', pro: 'Unlimited', enterprise: 'Unlimited' },
    { category: 'Contacts', starter: '100', pro: 'Unlimited', enterprise: 'Unlimited' },
    { category: 'Email Campaigns', starter: '—', pro: 'Unlimited', enterprise: 'Unlimited' },
    { category: 'Automation Workflows', starter: '—', pro: '50', enterprise: 'Unlimited' },
    { category: 'Courses', starter: '—', pro: '3', enterprise: 'Unlimited' },
    { category: 'Team Members', starter: '1', pro: '5', enterprise: 'Unlimited' },
    { category: 'Custom Domains', starter: '1', pro: 'Unlimited', enterprise: 'Unlimited' },
    { category: 'API Access', starter: '—', pro: '✓', enterprise: '✓' },
    { category: 'Analytics', starter: 'Basic', pro: 'Advanced', enterprise: 'Advanced' },
    { category: 'Support', starter: 'Community', pro: 'Priority', enterprise: 'Dedicated Manager' },
    { category: 'White-label', starter: '—', pro: '—', enterprise: '✓' },
  ];

  const faqs = [
    { q: 'Can I change plans anytime?', a: 'Yes! You can upgrade or downgrade your plan at any time. Upgrades take effect immediately, and downgrades apply at the start of your next billing cycle.' },
    { q: 'Is there a free trial?', a: 'Absolutely! All paid plans come with a 14-day free trial. No credit card required to get started. You\'ll have full access to all features during the trial.' },
    { q: 'What payment methods do you accept?', a: 'We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and bank transfers for Enterprise customers. All payments are processed securely through Stripe.' },
    { q: 'Do you offer refunds?', a: 'Yes, we offer a 30-day money-back guarantee if you\'re not satisfied with our service. No questions asked — just contact our support team.' },
    { q: 'What happens to my data if I cancel?', a: 'Your data remains accessible for 30 days after cancellation. You can export everything during this period. After 30 days, data is permanently deleted per our privacy policy.' },
    { q: 'Do you offer discounts for nonprofits or startups?', a: 'Yes! We offer special pricing for nonprofits, educational institutions, and early-stage startups. Contact our sales team to learn more about our discount programs.' },
    { q: 'Can I use TechyPark for multiple businesses?', a: 'Each account is for one business. If you need to manage multiple businesses, you\'ll need separate accounts or our Enterprise plan which supports multi-organization management.' },
    { q: 'Is there a setup fee?', a: 'No setup fees, ever. You only pay the monthly or annual subscription fee. Everything you need to get started is included in your plan.' },
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
            <a href="/features" className="text-slate-400 hover:text-white text-sm transition-colors">Features</a>
            <button onClick={() => navigate('/login')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-sm font-semibold mb-6">
            Simple, Transparent Pricing
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Choose Your
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Growth Plan</span>
          </h1>
          <p className="text-xl text-slate-400 mb-8">
            Start free. Upgrade when you're ready. No hidden fees, no surprises.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-1 p-1 bg-slate-800/60 border border-slate-700/50 rounded-xl">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                billingCycle === 'monthly'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center gap-2 ${
                billingCycle === 'yearly'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Yearly
              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, idx) => {
              const Icon = plan.icon;
              const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
              return (
                <div
                  key={idx}
                  className={`relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 ${
                    plan.highlighted
                      ? 'bg-gradient-to-br from-blue-600/90 to-purple-600/90 border-2 border-blue-400/50 shadow-2xl shadow-blue-500/20 scale-105'
                      : 'bg-slate-800/60 border border-slate-700/50 hover:border-slate-600/80'
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full text-xs font-bold text-slate-900 shadow-lg">
                      ⭐ MOST POPULAR
                    </div>
                  )}

                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-1">{plan.name}</h3>
                  <p className={`text-sm mb-6 ${plan.highlighted ? 'text-blue-100' : 'text-slate-400'}`}>
                    {plan.description}
                  </p>

                  <div className="mb-6">
                    {price === null ? (
                      <div>
                        <div className="text-4xl font-bold text-white">Custom</div>
                        <div className={`text-sm mt-1 ${plan.highlighted ? 'text-blue-200' : 'text-slate-500'}`}>Contact for pricing</div>
                      </div>
                    ) : price === 0 ? (
                      <div>
                        <div className="text-4xl font-bold text-white">Free</div>
                        <div className={`text-sm mt-1 ${plan.highlighted ? 'text-blue-200' : 'text-slate-500'}`}>Forever free</div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-end gap-1">
                          <span className={`text-lg ${plan.highlighted ? 'text-blue-200' : 'text-slate-400'}`}>$</span>
                          <span className="text-5xl font-bold text-white">{price}</span>
                          <span className={`text-lg mb-1 ${plan.highlighted ? 'text-blue-200' : 'text-slate-400'}`}>/mo</span>
                        </div>
                        {billingCycle === 'yearly' && (
                          <div className="text-sm text-green-400 mt-1">Billed annually (${price * 12}/yr)</div>
                        )}
                        {billingCycle === 'monthly' && (
                          <div className={`text-sm mt-1 ${plan.highlighted ? 'text-blue-200' : 'text-slate-500'}`}>Billed monthly</div>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={async () => {
                      const token = localStorage.getItem('token');
                      if (!token) {
                        navigate('/login?redirect=/pricing');
                        return;
                      }
                      
                      const tierMap = { 'Starter': 'starter', 'Professional': 'professional', 'Premium Pro': 'premium' };
                      const tier = tierMap[plan.name];
                      
                      if (tier === 'starter') {
                        navigate('/dashboard');
                        return;
                      }
                      
                      try {
                        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/stripe/checkout`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                          },
                          body: JSON.stringify({ tier })
                        });
                        
                        const data = await response.json();
                        if (data.url) {
                          window.location.href = data.url;
                        }
                      } catch (error) {
                        console.error('Error:', error);
                        alert('Error starting checkout');
                      }
                    }}
                    className={`w-full py-3 rounded-xl font-semibold mb-8 transition-all duration-200 hover:scale-105 ${plan.ctaStyle}`}
                  >
                    {plan.cta}
                  </button>

                  <div className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        {feature.included ? (
                          <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlighted ? 'text-white' : 'text-green-400'}`} />
                        ) : (
                          <X className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlighted ? 'text-white/30' : 'text-slate-600'}`} />
                        )}
                        <span className={`text-sm ${
                          feature.included
                            ? (plan.highlighted ? 'text-white' : 'text-slate-300')
                            : (plan.highlighted ? 'text-white/40' : 'text-slate-600')
                        }`}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Money back guarantee */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-sm">
              <CheckCircle className="w-4 h-4" />
              30-day money-back guarantee on all paid plans
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Detailed Comparison</h2>
            <p className="text-slate-400">See exactly what's included in each plan.</p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-slate-700/50">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-800/80 border-b border-slate-700/50">
                  <th className="px-6 py-4 text-left font-semibold text-slate-300">Feature</th>
                  <th className="px-6 py-4 text-center font-semibold text-slate-300">Starter</th>
                  <th className="px-6 py-4 text-center font-semibold text-blue-400">Professional</th>
                  <th className="px-6 py-4 text-center font-semibold text-purple-400">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-3 text-slate-300 text-sm">{row.category}</td>
                    <td className="px-6 py-3 text-center text-slate-400 text-sm">{row.starter}</td>
                    <td className="px-6 py-3 text-center text-white font-semibold text-sm">{row.pro}</td>
                    <td className="px-6 py-3 text-center text-slate-300 text-sm">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">What Our Customers Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah J.', role: 'E-commerce Founder', text: 'Switched from ClickFunnels and saved $200/month while getting MORE features. Best decision ever.', rating: 5 },
              { name: 'Mike C.', role: 'Digital Marketer', text: 'The Professional plan is an absolute steal. I replaced 5 different tools and my productivity doubled.', rating: 5 },
              { name: 'Emma D.', role: 'Course Creator', text: 'The 14-day trial was enough to see the value. Upgraded immediately. ROI was 10x in the first month.', rating: 5 },
            ].map((t, i) => (
              <div key={i} className="p-6 bg-slate-800/60 border border-slate-700/50 rounded-2xl">
                <div className="flex gap-1 mb-3">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-slate-300 text-sm mb-4">"{t.text}"</p>
                <div>
                  <div className="font-semibold text-white text-sm">{t.name}</div>
                  <div className="text-slate-500 text-xs">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-400">Everything you need to know about our pricing.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm">
              Still have questions?{' '}
              <a href="#" className="text-blue-400 hover:text-blue-300">Contact our support team</a>
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600"></div>
            <div className="relative p-12 text-center">
              <h2 className="text-4xl font-bold text-white mb-4">Ready to get started?</h2>
              <p className="text-blue-100 mb-8">Join thousands of entrepreneurs building profitable businesses with TechyPark Engine.</p>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-slate-100 hover:scale-105 transition-all duration-200 inline-flex items-center gap-2"
              >
                Start Your Free Trial <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-blue-200 text-sm mt-4">No credit card required • 14-day free trial • Cancel anytime</p>
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
