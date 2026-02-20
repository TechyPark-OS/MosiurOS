import React from 'react';
import { ArrowRight, CheckCircle, Zap, BarChart3, Users, Rocket, Star, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    { icon: Zap, title: 'Lightning Fast', description: 'Build funnels in minutes, not days' },
    { icon: BarChart3, title: 'Real-Time Analytics', description: 'Track every visitor and conversion' },
    { icon: Users, title: 'Team Collaboration', description: 'Work together seamlessly' },
    { icon: Rocket, title: 'One-Click Deploy', description: 'Go live instantly' },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'E-commerce Founder',
      text: 'TechyPark Engine increased our conversions by 340%. The funnel builder is incredible.',
      avatar: '👩‍💼'
    },
    {
      name: 'Mike Chen',
      role: 'Digital Marketer',
      text: 'Finally, a platform that does everything. No more juggling 5 different tools.',
      avatar: '👨‍💼'
    },
    {
      name: 'Emma Davis',
      role: 'Course Creator',
      text: 'The course builder and email automation saved me 20 hours per week.',
      avatar: '👩‍🏫'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">TechyPark</span>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full">
            <span className="text-blue-400 text-sm font-semibold">🚀 All-in-One Platform</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Build Funnels That
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"> Convert</span>
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            The complete platform for sales funnels, email marketing, courses, and ecommerce. Everything you need to scale your business in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-2xl hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 border border-slate-600 text-white rounded-lg font-semibold hover:bg-slate-800 transition-all">
              Watch Demo
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-8 text-slate-400 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-4">Powerful Features</h2>
          <p className="text-slate-300 text-center mb-16 max-w-2xl mx-auto">
            Everything you need to build, launch, and scale your business
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="p-6 bg-slate-700/50 border border-slate-600 rounded-xl hover:border-blue-500/50 transition-all hover:bg-slate-700/80">
                  <Icon className="w-10 h-10 text-blue-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-400 mb-2">50K+</div>
            <div className="text-slate-300">Active Users</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-400 mb-2">$2B+</div>
            <div className="text-slate-300">Sales Generated</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-pink-400 mb-2">1M+</div>
            <div className="text-slate-300">Funnels Created</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-400 mb-2">99.9%</div>
            <div className="text-slate-300">Uptime</div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">Loved by Entrepreneurs</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="p-8 bg-slate-700/50 border border-slate-600 rounded-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-slate-400">{testimonial.role}</div>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-4">Simple, Transparent Pricing</h2>
          <p className="text-slate-300 text-center mb-16 max-w-2xl mx-auto">
            Start free. Upgrade when you're ready. No hidden fees.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Starter', price: 'Free', features: ['Up to 3 funnels', 'Basic analytics', 'Email support'] },
              { name: 'Professional', price: '$97', features: ['Unlimited funnels', 'Advanced analytics', 'Priority support', 'A/B testing'], highlighted: true },
              { name: 'Enterprise', price: 'Custom', features: ['Everything', 'Dedicated account', '24/7 phone support', 'Custom integrations'] },
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`p-8 rounded-xl border transition-all ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600 border-blue-400 transform scale-105'
                    : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
                }`}
              >
                <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-white'}`}>
                  {plan.name}
                </h3>
                <div className={`text-4xl font-bold mb-6 ${plan.highlighted ? 'text-white' : 'text-blue-400'}`}>
                  {plan.price}
                  {plan.price !== 'Custom' && plan.price !== 'Free' && <span className="text-lg text-slate-300">/mo</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className={`flex items-center gap-2 ${plan.highlighted ? 'text-white' : 'text-slate-300'}`}>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    plan.highlighted
                      ? 'bg-white text-blue-600 hover:bg-slate-100'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Scale Your Business?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of entrepreneurs using TechyPark Engine to build profitable funnels
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-slate-100 transition-all"
          >
            Start Your Free Trial
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Rocket className="w-6 h-6 text-blue-400" />
                <span className="font-bold text-white">TechyPark</span>
              </div>
              <p className="text-slate-400 text-sm">The all-in-one platform for entrepreneurs</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2026 TechyPark Engine. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
