import React, { useState } from 'react';
import { CheckCircle, X, ArrowRight } from 'lucide-react';


export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: 'Starter',
      price: 0,
      billedPrice: 'Free',
      description: 'Perfect for getting started',
      features: [
        { name: 'Up to 3 funnels', included: true },
        { name: 'Basic analytics', included: true },
        { name: 'Email support', included: true },
        { name: 'Community access', included: true },
        { name: 'Email marketing', included: false },
        { name: 'Advanced automation', included: false },
        { name: 'A/B testing', included: false },
        { name: 'Priority support', included: false },
      ],
      cta: 'Get Started',
    },
    {
      name: 'Professional',
      price: billingCycle === 'monthly' ? 97 : 97 * 12 * 0.8,
      billedPrice: billingCycle === 'monthly' ? '$97/month' : '$932/year',
      description: 'For growing businesses',
      features: [
        { name: 'Unlimited funnels', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'Priority email support', included: true },
        { name: 'Community access', included: true },
        { name: 'Email marketing', included: true },
        { name: 'Advanced automation', included: true },
        { name: 'A/B testing', included: true },
        { name: 'Priority support', included: false },
      ],
      cta: 'Start Free Trial',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: null,
      billedPrice: 'Custom',
      description: 'For large teams',
      features: [
        { name: 'Everything in Professional', included: true },
        { name: 'Dedicated account manager', included: true },
        { name: '24/7 phone support', included: true },
        { name: 'Custom integrations', included: true },
        { name: 'White-label options', included: true },
        { name: 'Advanced security', included: true },
        { name: 'SLA guarantee', included: true },
        { name: 'Custom training', included: true },
      ],
      cta: 'Contact Sales',
    },
  ];

  const comparison = [
    { category: 'Funnels', starter: '3', pro: 'Unlimited', enterprise: 'Unlimited' },
    { category: 'Landing Pages', starter: '5', pro: 'Unlimited', enterprise: 'Unlimited' },
    { category: 'Email Campaigns', starter: '0', pro: 'Unlimited', enterprise: 'Unlimited' },
    { category: 'Workflows', starter: '0', pro: '50', enterprise: 'Unlimited' },
    { category: 'Contacts', starter: '100', pro: 'Unlimited', enterprise: 'Unlimited' },
    { category: 'Courses', starter: '0', pro: '3', enterprise: 'Unlimited' },
    { category: 'Team Members', starter: '1', pro: '3', enterprise: 'Unlimited' },
    { category: 'API Access', starter: 'No', pro: 'Yes', enterprise: 'Yes' },
    { category: 'Custom Domain', starter: 'No', pro: 'Yes', enterprise: 'Yes' },
    { category: 'Analytics', starter: 'Basic', pro: 'Advanced', enterprise: 'Advanced' },
  ];

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-800 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-slate-300 mb-8">Choose the perfect plan for your business. No hidden fees.</p>
          
          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-slate-700 rounded-lg p-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-md font-semibold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-md font-semibold transition-all ${
                  billingCycle === 'yearly'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Yearly <span className="text-green-400 text-sm ml-2">(Save 20%)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-8 transition-all ${
                plan.highlighted
                  ? 'bg-gradient-to-br from-blue-600 to-purple-600 ring-2 ring-blue-400 transform scale-105 shadow-2xl'
                  : 'bg-slate-700/50 border border-slate-600 hover:border-slate-500'
              }`}
            >
              {plan.highlighted && (
                <div className="mb-4 inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-semibold text-white">
                  Most Popular
                </div>
              )}
              
              <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-white'}`}>
                {plan.name}
              </h3>
              <p className={`mb-6 ${plan.highlighted ? 'text-blue-100' : 'text-slate-400'}`}>
                {plan.description}
              </p>

              <div className="mb-6">
                <div className={`text-4xl font-bold ${plan.highlighted ? 'text-white' : 'text-blue-400'}`}>
                  {plan.billedPrice}
                </div>
              </div>

              <button
                className={`w-full py-3 rounded-lg font-semibold mb-8 transition-all ${
                  plan.highlighted
                    ? 'bg-white text-blue-600 hover:bg-slate-100'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {plan.cta}
              </button>

              <div className="space-y-4">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    {feature.included ? (
                      <CheckCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${plan.highlighted ? 'text-white' : 'text-green-400'}`} />
                    ) : (
                      <X className={`w-5 h-5 mt-0.5 flex-shrink-0 ${plan.highlighted ? 'text-white/30' : 'text-slate-500'}`} />
                    )}
                    <span className={`text-sm ${feature.included ? (plan.highlighted ? 'text-white' : 'text-slate-300') : (plan.highlighted ? 'text-white/50' : 'text-slate-500')}`}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Detailed Comparison</h2>
          <div className="overflow-x-auto rounded-lg border border-slate-600">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-700/50 border-b border-slate-600">
                  <th className="px-6 py-4 text-left font-semibold text-white">Feature</th>
                  <th className="px-6 py-4 text-center font-semibold text-white">Starter</th>
                  <th className="px-6 py-4 text-center font-semibold text-blue-400">Professional</th>
                  <th className="px-6 py-4 text-center font-semibold text-white">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-600 hover:bg-slate-700/30">
                    <td className="px-6 py-4 font-medium text-slate-300">{row.category}</td>
                    <td className="px-6 py-4 text-center text-slate-400">{row.starter}</td>
                    <td className="px-6 py-4 text-center text-white font-semibold">{row.pro}</td>
                    <td className="px-6 py-4 text-center text-slate-300">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {[
              {
                q: 'Can I change plans anytime?',
                a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.'
              },
              {
                q: 'Is there a free trial?',
                a: 'Absolutely! All paid plans come with a 14-day free trial. No credit card required to get started.'
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, PayPal, and bank transfers for Enterprise customers.'
              },
              {
                q: 'Do you offer refunds?',
                a: 'Yes, we offer a 30-day money-back guarantee if you\'re not satisfied with our service.'
              },
            ].map((faq, idx) => (
              <div key={idx} className="p-6 bg-slate-700/50 border border-slate-600 rounded-lg">
                <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-slate-300">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-slate-300 mb-8">Join thousands of entrepreneurs building profitable funnels with TechyPark Engine.</p>
          <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2 mx-auto">
            Start Your Free Trial <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
