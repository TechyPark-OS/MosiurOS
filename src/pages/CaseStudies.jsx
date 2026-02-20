import React, { useState, useEffect, useRef } from 'react';
import { Star, TrendingUp, Users, DollarSign, ArrowRight, Rocket, BarChart3, Target, CheckCircle, Quote } from 'lucide-react';
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

function useCounter(end, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return count;
}

function AnimatedStat({ value, suffix, label, color }) {
  const [ref, inView] = useInView(0.3);
  const count = useCounter(value, 2000, inView);
  return (
    <div ref={ref} className="text-center">
      <div className={`text-4xl font-bold mb-1 ${color}`}>{count}{suffix}</div>
      <div className="text-slate-400 text-sm">{label}</div>
    </div>
  );
}

export default function CaseStudies() {
  const navigate = useNavigate();
  const [activeStudy, setActiveStudy] = useState(0);

  const caseStudies = [
    {
      title: 'How StyleHub Increased Conversions by 340%',
      category: 'E-commerce',
      categoryColor: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
      emoji: '🛍️',
      gradient: 'from-orange-500/20 to-red-500/20',
      company: 'StyleHub',
      person: 'Sarah Johnson',
      role: 'Founder & CEO',
      avatar: '👩‍💼',
      challenge: 'StyleHub was struggling with low conversion rates on their product pages. They were using 4 different tools that didn\'t integrate well, causing data silos and missed opportunities.',
      solution: 'Migrated everything to TechyPark Engine. Built a 3-step funnel with upsells, set up email automation sequences, and used A/B testing to optimize every page element.',
      results: [
        { icon: TrendingUp, label: 'Conversion Rate', value: '+340%', color: 'text-green-400' },
        { icon: DollarSign, label: 'Monthly Revenue', value: '+$50K', color: 'text-blue-400' },
        { icon: Users, label: 'Email Subscribers', value: '+15K', color: 'text-purple-400' },
        { icon: BarChart3, label: 'Cart Abandonment', value: '-45%', color: 'text-orange-400' },
      ],
      quote: 'TechyPark Engine transformed our business. The funnel builder is intuitive and the email automation runs 24/7. We went from struggling to scaling in just 3 months.',
      tools: ['Funnel Builder', 'Email Marketing', 'A/B Testing', 'Analytics'],
    },
    {
      title: 'Learn Academy Tripled Course Revenue in 6 Months',
      category: 'Education',
      categoryColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      emoji: '📚',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      company: 'Learn Academy',
      person: 'Emma Davis',
      role: 'Course Creator',
      avatar: '👩‍🏫',
      challenge: 'Emma had great course content but struggled to attract and retain students. Her existing platform had limited marketing tools and no automation capabilities.',
      solution: 'Used TechyPark\'s course builder to restructure content, built automated email sequences for student onboarding, and created a membership site with drip content.',
      results: [
        { icon: DollarSign, label: 'Revenue Growth', value: '3x', color: 'text-green-400' },
        { icon: Users, label: 'Students Enrolled', value: '+2,500', color: 'text-blue-400' },
        { icon: Star, label: 'Student Rating', value: '4.9/5', color: 'text-yellow-400' },
        { icon: TrendingUp, label: 'Completion Rate', value: '+68%', color: 'text-purple-400' },
      ],
      quote: 'The course builder and email automation saved me 20 hours per week. My students love the experience and my revenue tripled. I wish I had found TechyPark sooner.',
      tools: ['Course Builder', 'Membership Sites', 'Email Automation', 'Community'],
    },
    {
      title: 'Digital Solutions Scales to 50+ Client Funnels',
      category: 'Agency',
      categoryColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      emoji: '🚀',
      gradient: 'from-purple-500/20 to-pink-500/20',
      company: 'Digital Solutions',
      person: 'James Wilson',
      role: 'Agency Owner',
      avatar: '👨‍💻',
      challenge: 'James was managing client funnels across multiple platforms, making it impossible to scale. Client reporting was manual and time-consuming, limiting growth.',
      solution: 'Consolidated all client work into TechyPark Engine. Used white-label features for client portals, built a standardized funnel workflow, and automated reporting.',
      results: [
        { icon: Users, label: 'Client Funnels', value: '50+', color: 'text-green-400' },
        { icon: DollarSign, label: 'MRR Growth', value: '+$30K', color: 'text-blue-400' },
        { icon: TrendingUp, label: 'Client Satisfaction', value: '98%', color: 'text-purple-400' },
        { icon: BarChart3, label: 'Time Saved/Week', value: '25hrs', color: 'text-orange-400' },
      ],
      quote: 'We now manage 50+ client funnels with a team of 3. The white-label features are perfect for our agency model. TechyPark paid for itself in the first week.',
      tools: ['White-label', 'Team Collaboration', 'Analytics', 'CRM'],
    },
  ];

  const testimonials = [
    { name: 'Sarah Johnson', role: 'E-commerce Founder', company: 'StyleHub', text: 'TechyPark Engine increased our conversions by 340%. The funnel builder is incredible.', stats: { metric: '+340%', label: 'Conversions' }, rating: 5 },
    { name: 'Mike Chen', role: 'Digital Marketer', company: 'Growth Labs', text: 'Finally, a platform that does everything. No more juggling 5 different tools.', stats: { metric: '5x', label: 'ROI' }, rating: 5 },
    { name: 'Emma Davis', role: 'Course Creator', company: 'Learn Academy', text: 'The course builder and email automation saved me 20 hours per week.', stats: { metric: '3x', label: 'Revenue' }, rating: 5 },
    { name: 'James Wilson', role: 'Agency Owner', company: 'Digital Solutions', text: 'We now manage 50+ client funnels in TechyPark. The white-label features are perfect.', stats: { metric: '50+', label: 'Clients' }, rating: 5 },
    { name: 'Lisa Anderson', role: 'Product Manager', company: 'Tech Startup', text: 'The analytics dashboard gives us insights we never had before. AOV increased by 45%.', stats: { metric: '+45%', label: 'AOV' }, rating: 5 },
    { name: 'David Martinez', role: 'Marketing Director', company: 'B2B Solutions', text: 'The automation workflows have been game-changing. Our sales team closes 60% more deals.', stats: { metric: '+60%', label: 'Deals' }, rating: 5 },
  ];

  const industries = [
    { icon: '🛍️', label: 'E-commerce', count: '8,400+' },
    { icon: '📚', label: 'Education', count: '5,200+' },
    { icon: '💼', label: 'B2B', count: '3,800+' },
    { icon: '🏥', label: 'Healthcare', count: '1,200+' },
    { icon: '🎨', label: 'Creative', count: '4,600+' },
    { icon: '📱', label: 'SaaS', count: '2,900+' },
    { icon: '🚀', label: 'Startups', count: '6,100+' },
    { icon: '🏢', label: 'Enterprise', count: '800+' },
  ];

  const activeCase = caseStudies[activeStudy];

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
          <div className="inline-block px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-yellow-400 text-sm font-semibold mb-6">
            Real Results from Real Customers
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            Success Stories That
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"> Inspire</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            See how entrepreneurs across every industry are using TechyPark Engine to build and scale their businesses.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50">
            <AnimatedStat value={50} suffix="K+" label="Active Users" color="text-blue-400" />
            <AnimatedStat value={2} suffix="B+" label="Sales Generated" color="text-purple-400" />
            <AnimatedStat value={1} suffix="M+" label="Funnels Created" color="text-pink-400" />
            <AnimatedStat value={49} suffix="/5" label="Average Rating" color="text-yellow-400" />
          </div>
        </div>
      </section>

      {/* Featured Case Studies */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Featured Case Studies</h2>
            <p className="text-slate-400">Deep dives into how our customers achieved extraordinary results.</p>
          </div>

          {/* Case Study Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {caseStudies.map((study, i) => (
              <button
                key={i}
                onClick={() => setActiveStudy(i)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeStudy === i
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/50'
                }`}
              >
                <span>{study.emoji}</span>
                {study.company}
              </button>
            ))}
          </div>

          {/* Active Case Study */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className={`p-8 rounded-2xl bg-gradient-to-br ${activeCase.gradient} border border-slate-700/50`}>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold mb-4 ${activeCase.categoryColor}`}>
                {activeCase.category}
              </div>
              <h3 className="text-2xl font-bold text-white mb-6">{activeCase.title}</h3>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-slate-700/80 flex items-center justify-center text-2xl">
                  {activeCase.avatar}
                </div>
                <div>
                  <div className="font-semibold text-white">{activeCase.person}</div>
                  <div className="text-sm text-slate-400">{activeCase.role}, {activeCase.company}</div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-2">The Challenge</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{activeCase.challenge}</p>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-2">The Solution</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{activeCase.solution}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-2">Tools Used</h4>
                <div className="flex flex-wrap gap-2">
                  {activeCase.tools.map((tool, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-700/60 text-slate-300 text-xs rounded-full border border-slate-600/50">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Results */}
              <div className="p-6 bg-slate-800/60 border border-slate-700/50 rounded-2xl">
                <h4 className="font-semibold text-white mb-4">Results Achieved</h4>
                <div className="grid grid-cols-2 gap-4">
                  {activeCase.results.map((result, i) => {
                    const Icon = result.icon;
                    return (
                      <div key={i} className="p-4 bg-slate-700/50 rounded-xl text-center">
                        <Icon className={`w-6 h-6 mx-auto mb-2 ${result.color}`} />
                        <div className={`text-2xl font-bold ${result.color}`}>{result.value}</div>
                        <div className="text-xs text-slate-400 mt-1">{result.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quote */}
              <div className="p-6 bg-slate-800/60 border border-slate-700/50 rounded-2xl">
                <Quote className="w-8 h-8 text-blue-400/50 mb-3" />
                <p className="text-slate-300 text-sm leading-relaxed italic mb-4">"{activeCase.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{activeCase.avatar}</div>
                  <div>
                    <div className="font-semibold text-white text-sm">{activeCase.person}</div>
                    <div className="text-xs text-slate-400">{activeCase.role}</div>
                  </div>
                  <div className="ml-auto flex gap-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">What Our Users Say</h2>
            <div className="flex items-center justify-center gap-2 text-slate-400">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
              </div>
              <span className="text-sm">4.9/5 from 2,400+ reviews</span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => {
              const [ref, inView] = useInView(0.1);
              return (
                <div
                  key={i}
                  ref={ref}
                  className={`p-6 bg-slate-800/60 border border-slate-700/50 rounded-2xl hover:border-blue-500/30 transition-all duration-500 ${
                    inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl">
                      {['👩‍💼', '👨‍💼', '👩‍🏫', '👨‍💻', '👩‍🔬', '👨‍💼'][i]}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white text-sm">{t.name}</div>
                      <div className="text-xs text-slate-400">{t.role}</div>
                      <div className="text-xs text-slate-500">{t.company}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-400">{t.stats.metric}</div>
                      <div className="text-xs text-slate-500">{t.stats.label}</div>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">"{t.text}"</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Trusted by Every Industry</h2>
            <p className="text-slate-400">No matter your niche, TechyPark Engine has the tools you need to succeed.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {industries.map((industry, i) => {
              const [ref, inView] = useInView(0.1);
              return (
                <div
                  key={i}
                  ref={ref}
                  className={`p-6 bg-slate-800/60 border border-slate-700/50 rounded-2xl text-center hover:border-blue-500/30 transition-all duration-500 hover:-translate-y-1 ${
                    inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${i * 75}ms` }}
                >
                  <div className="text-4xl mb-3">{industry.icon}</div>
                  <div className="font-semibold text-white text-sm mb-1">{industry.label}</div>
                  <div className="text-xs text-blue-400">{industry.count} users</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600"></div>
            <div className="relative p-12 text-center">
              <h2 className="text-4xl font-bold text-white mb-4">Ready to write your success story?</h2>
              <p className="text-blue-100 mb-8">Join thousands of entrepreneurs building profitable businesses with TechyPark Engine.</p>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-slate-100 hover:scale-105 transition-all duration-200 inline-flex items-center gap-2"
              >
                Start Your Free Trial <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-blue-200 text-sm mt-4">No credit card required • 14-day free trial</p>
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
