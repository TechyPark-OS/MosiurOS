import React from 'react';
import { Star, TrendingUp, Users, DollarSign } from 'lucide-react';


export default function CaseStudies() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'E-commerce Founder',
      company: 'StyleHub',
      avatar: '👩‍💼',
      text: 'TechyPark Engine increased our conversions by 340%. The funnel builder is incredible and the email automation saved us 20 hours per week.',
      stats: { metric: '+340%', label: 'Conversion Increase' },
      rating: 5
    },
    {
      name: 'Mike Chen',
      role: 'Digital Marketer',
      company: 'Growth Labs',
      avatar: '👨‍💼',
      text: 'Finally, a platform that does everything. No more juggling 5 different tools. The integration with Stripe was seamless.',
      stats: { metric: '5x', label: 'Time Savings' },
      rating: 5
    },
    {
      name: 'Emma Davis',
      role: 'Course Creator',
      company: 'Learn Academy',
      avatar: '👩‍🏫',
      text: 'The course builder and email automation saved me 20 hours per week. My students love the experience and my revenue tripled.',
      stats: { metric: '3x', label: 'Revenue Growth' },
      rating: 5
    },
    {
      name: 'James Wilson',
      role: 'Agency Owner',
      company: 'Digital Solutions',
      avatar: '👨‍💻',
      text: 'We now manage 50+ client funnels in TechyPark. The white-label features are perfect for our agency model.',
      stats: { metric: '50+', label: 'Client Funnels' },
      rating: 5
    },
    {
      name: 'Lisa Anderson',
      role: 'Product Manager',
      company: 'Tech Startup',
      avatar: '👩‍🔬',
      text: 'The analytics dashboard gives us insights we never had before. We\'ve optimized our funnel and increased AOV by 45%.',
      stats: { metric: '+45%', label: 'AOV Increase' },
      rating: 5
    },
    {
      name: 'David Martinez',
      role: 'Marketing Director',
      company: 'B2B Solutions',
      avatar: '👨‍💼',
      text: 'The automation workflows have been game-changing for our lead nurturing. Our sales team closes 60% more deals now.',
      stats: { metric: '+60%', label: 'Deal Closure' },
      rating: 5
    },
  ];

  const caseStudies = [
    {
      title: 'How StyleHub Increased Conversions by 340%',
      category: 'E-commerce',
      image: '🛍️',
      excerpt: 'Sarah Johnson used TechyPark\'s funnel builder to create a high-converting product launch sequence.',
      results: [
        { icon: TrendingUp, label: 'Conversion Rate', value: '+340%' },
        { icon: DollarSign, label: 'Monthly Revenue', value: '+$50K' },
        { icon: Users, label: 'Email Subscribers', value: '+15K' },
      ]
    },
    {
      title: 'Learn Academy Tripled Course Revenue',
      category: 'Education',
      image: '📚',
      excerpt: 'Emma Davis leveraged the course builder and email automation to scale her online academy.',
      results: [
        { icon: TrendingUp, label: 'Revenue Growth', value: '3x' },
        { icon: Users, label: 'Students Enrolled', value: '+2,500' },
        { icon: Star, label: 'Student Rating', value: '4.9/5' },
      ]
    },
    {
      title: 'Digital Solutions Manages 50+ Client Funnels',
      category: 'Agency',
      image: '🚀',
      excerpt: 'James Wilson scaled his agency using TechyPark\'s white-label and team collaboration features.',
      results: [
        { icon: Users, label: 'Client Funnels', value: '50+' },
        { icon: DollarSign, label: 'MRR Growth', value: '+$30K' },
        { icon: TrendingUp, label: 'Client Satisfaction', value: '98%' },
      ]
    },
  ];

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-800 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">Success Stories</h1>
          <p className="text-xl text-slate-300">See how entrepreneurs are using TechyPark Engine to scale their businesses</p>
        </div>

        {/* Featured Case Studies */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {caseStudies.map((study, idx) => (
            <div key={idx} className="bg-slate-700/50 border border-slate-600 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all">
              <div className="h-40 bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center text-6xl">
                {study.image}
              </div>
              <div className="p-6">
                <div className="text-sm text-blue-400 font-semibold mb-2">{study.category}</div>
                <h3 className="text-lg font-bold text-white mb-3">{study.title}</h3>
                <p className="text-slate-400 text-sm mb-6">{study.excerpt}</p>
                
                <div className="space-y-3">
                  {study.results.map((result, i) => {
                    const Icon = result.icon;
                    return (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-blue-400" />
                          <span className="text-sm text-slate-300">{result.label}</span>
                        </div>
                        <span className="font-bold text-white">{result.value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">What Our Users Say</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="p-6 bg-slate-700/50 border border-slate-600 rounded-xl hover:border-blue-500/50 transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-slate-400">{testimonial.role}</div>
                    <div className="text-xs text-slate-500">{testimonial.company}</div>
                  </div>
                </div>
                
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <p className="text-slate-300 mb-4">{testimonial.text}</p>
                
                <div className="pt-4 border-t border-slate-600">
                  <div className="text-2xl font-bold text-blue-400">{testimonial.stats.metric}</div>
                  <div className="text-xs text-slate-400">{testimonial.stats.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-slate-600 rounded-xl p-12 mb-16">
          <div className="grid md:grid-cols-4 gap-8 text-center">
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
              <div className="text-4xl font-bold text-green-400 mb-2">4.9/5</div>
              <div className="text-slate-300">Average Rating</div>
            </div>
          </div>
        </div>

        {/* Industries */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Trusted by Every Industry</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '🛍️', label: 'E-commerce' },
              { icon: '📚', label: 'Education' },
              { icon: '💼', label: 'B2B' },
              { icon: '🏥', label: 'Healthcare' },
              { icon: '🎨', label: 'Creative' },
              { icon: '📱', label: 'SaaS' },
              { icon: '🚀', label: 'Startups' },
              { icon: '🏢', label: 'Enterprise' },
            ].map((industry, i) => (
              <div key={i} className="p-6 bg-slate-700/50 border border-slate-600 rounded-lg text-center hover:border-blue-500/50 transition-all">
                <div className="text-4xl mb-2">{industry.icon}</div>
                <div className="text-slate-300 font-semibold">{industry.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to write your success story?</h2>
          <p className="text-blue-100 mb-8">Join thousands of entrepreneurs building profitable funnels with TechyPark Engine.</p>
          <button className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-slate-100 transition-all">
            Start Your Free Trial
          </button>
        </div>
      </div>
    </div>
  )
}
