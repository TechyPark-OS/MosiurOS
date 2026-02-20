import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle, Zap, BarChart3, Users, Rocket, Star, TrendingUp, Play, ChevronDown, Globe, Shield, Mail, Database, Server, Package, Cpu, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Animated counter hook
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

// Intersection observer hook
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

// Animated stat component
function AnimatedStat({ value, suffix, label, color }) {
  const [ref, inView] = useInView(0.3);
  const count = useCounter(value, 2000, inView);
  return (
    <div ref={ref} className="text-center">
      <div className={`text-4xl lg:text-5xl font-bold mb-2 ${color}`}>
        {count}{suffix}
      </div>
      <div className="text-slate-400 text-sm">{label}</div>
    </div>
  );
}

// Feature card with hover animation
function FeatureCard({ icon: Icon, title, description, gradient, delay }) {
  const [ref, inView] = useInView(0.1);
  return (
    <div
      ref={ref}
      className={`group relative p-6 rounded-2xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms`, transitionProperty: 'opacity, transform, border-color, box-shadow' }}
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

// Testimonial card
function TestimonialCard({ name, role, text, avatar, metric, metricLabel, delay }) {
  const [ref, inView] = useInView(0.1);
  return (
    <div
      ref={ref}
      className={`p-6 bg-slate-800/60 border border-slate-700/50 rounded-2xl backdrop-blur-sm hover:border-blue-500/30 transition-all duration-500 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms`, transitionProperty: 'opacity, transform, border-color' }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl">
          {avatar}
        </div>
        <div>
          <div className="font-semibold text-white text-sm">{name}</div>
          <div className="text-xs text-slate-400">{role}</div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-xl font-bold text-blue-400">{metric}</div>
          <div className="text-xs text-slate-500">{metricLabel}</div>
        </div>
      </div>
      <div className="flex gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="text-slate-300 text-sm leading-relaxed">"{text}"</p>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const heroRef = useRef(null);
  const [heroInView, setHeroInView] = useState(false);

  useEffect(() => {
    setHeroInView(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { icon: Zap, title: 'Sales Funnel Builder', description: 'Create high-converting multi-step funnels with drag-and-drop simplicity. Templates for every niche.', gradient: 'from-blue-500 to-cyan-500', delay: 0 },
    { icon: Mail, title: 'Email Marketing', description: 'Automated sequences, segmentation, and beautiful templates. Nurture leads on autopilot.', gradient: 'from-purple-500 to-pink-500', delay: 100 },
    { icon: BarChart3, title: 'Real-Time Analytics', description: 'Track every click, conversion, and dollar. Make data-driven decisions with confidence.', gradient: 'from-green-500 to-emerald-500', delay: 200 },
    { icon: Package, title: 'Ecommerce & Products', description: 'Sell physical and digital products with smart checkout flows and payment processing.', gradient: 'from-orange-500 to-red-500', delay: 300 },
    { icon: Users, title: 'CRM & Contacts', description: 'Manage your entire customer journey from lead to loyal customer in one unified view.', gradient: 'from-teal-500 to-blue-500', delay: 400 },
    { icon: Server, title: 'Infrastructure', description: 'Manage servers, sites, SSL, DNS, and containers from a single powerful control panel.', gradient: 'from-indigo-500 to-purple-500', delay: 500 },
    { icon: Shield, title: 'Security & SSL', description: 'Enterprise-grade security with automatic SSL, firewall management, and audit logs.', gradient: 'from-red-500 to-pink-500', delay: 600 },
    { icon: Activity, title: 'Monitoring & Alerts', description: 'Real-time server monitoring with intelligent alerts so you never miss a critical event.', gradient: 'from-yellow-500 to-orange-500', delay: 700 },
  ];

  const testimonials = [
    { name: 'Sarah Johnson', role: 'E-commerce Founder, StyleHub', text: 'TechyPark Engine transformed our business. The funnel builder is intuitive and the results speak for themselves.', avatar: '👩‍💼', metric: '+340%', metricLabel: 'Conversions', delay: 0 },
    { name: 'Mike Chen', role: 'Digital Marketer, Growth Labs', text: 'Finally, a platform that replaces 5 tools in one. The automation workflows alone saved us 20 hours a week.', avatar: '👨‍💼', metric: '5x', metricLabel: 'ROI', delay: 100 },
    { name: 'Emma Davis', role: 'Course Creator, Learn Academy', text: 'The course builder and membership features are world-class. My students love the experience.', avatar: '👩‍🏫', metric: '3x', metricLabel: 'Revenue', delay: 200 },
    { name: 'James Wilson', role: 'Agency Owner, Digital Solutions', text: 'We manage 50+ client funnels with ease. The white-label features are perfect for our agency model.', avatar: '👨‍💻', metric: '50+', metricLabel: 'Clients', delay: 300 },
    { name: 'Lisa Anderson', role: 'Product Manager, TechStartup', text: 'The analytics dashboard gives us insights we never had before. AOV increased by 45% in the first month.', avatar: '👩‍🔬', metric: '+45%', metricLabel: 'AOV', delay: 400 },
    { name: 'David Martinez', role: 'Marketing Director, B2B Solutions', text: 'The automation workflows have been game-changing. Our sales team closes 60% more deals now.', avatar: '👨‍💼', metric: '+60%', metricLabel: 'Deals Closed', delay: 500 },
  ];

  const integrations = ['Stripe', 'PayPal', 'Zapier', 'Slack', 'HubSpot', 'Mailchimp', 'Google Analytics', 'Facebook Ads', 'Shopify', 'WordPress', 'Zoom', 'Calendly'];

  return (
    <div className="min-h-screen bg-slate-950 overflow-x-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950"></div>
        <div
          className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        ></div>
        <div
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        ></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">TechyPark</span>
            <span className="hidden sm:block text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30 font-medium">Engine</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="/features" className="text-slate-400 hover:text-white text-sm transition-colors">Features</a>
            <a href="/pricing" className="text-slate-400 hover:text-white text-sm transition-colors">Pricing</a>
            <a href="/case-studies" className="text-slate-400 hover:text-white text-sm transition-colors">Case Studies</a>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="hidden sm:block text-slate-300 hover:text-white text-sm transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 transition-all duration-200"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 mb-8 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full transition-all duration-700 ${
              heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-blue-400 text-sm font-semibold">All-in-One Business Platform</span>
            <span className="text-slate-500 text-xs">•</span>
            <span className="text-slate-400 text-xs">Trusted by 50K+ entrepreneurs</span>
          </div>

          {/* Headline */}
          <h1
            className={`text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight transition-all duration-700 delay-100 ${
              heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Build Funnels That
            <br />
            <span className="relative">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Actually Convert
              </span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 400 12" fill="none">
                <path d="M2 8C80 2 160 10 200 6C240 2 320 10 398 4" stroke="url(#underline)" strokeWidth="3" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="underline" x1="0" y1="0" x2="400" y2="0">
                    <stop stopColor="#60a5fa"/>
                    <stop offset="0.5" stopColor="#a78bfa"/>
                    <stop offset="1" stopColor="#f472b6"/>
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className={`text-xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${
              heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            The complete platform for sales funnels, email marketing, courses, ecommerce, and server management. 
            Everything you need to scale your business — in one powerful dashboard.
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center mb-12 transition-all duration-700 delay-300 ${
              heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <button
              onClick={() => navigate('/login')}
              className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
            >
              Start Free — No Credit Card
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => setVideoPlaying(true)}
              className="group px-8 py-4 border border-slate-700 text-white rounded-xl font-semibold hover:bg-slate-800 hover:border-slate-600 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <Play className="w-4 h-4 ml-0.5" />
              </div>
              Watch Demo (2 min)
            </button>
          </div>

          {/* Trust badges */}
          <div
            className={`flex flex-wrap justify-center gap-6 text-slate-500 text-sm transition-all duration-700 delay-400 ${
              heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {['No credit card required', '14-day free trial', '24/7 support', 'Cancel anytime'].map((badge, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard Preview */}
        <div
          className={`mt-16 max-w-6xl mx-auto transition-all duration-1000 delay-500 ${
            heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
          }`}
        >
          <div className="relative rounded-2xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-sm shadow-2xl shadow-blue-500/10 overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/80 border-b border-slate-700/50">
              <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
              <div className="flex-1 mx-4 px-4 py-1 bg-slate-700/50 rounded-lg text-xs text-slate-400 text-center">
                app.techypark.com/dashboard
              </div>
            </div>
            {/* Dashboard mockup */}
            <div className="p-6 bg-slate-900">
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Revenue', value: '$284,500', change: '+23%', color: 'text-green-400' },
                  { label: 'Active Funnels', value: '47', change: '+8', color: 'text-blue-400' },
                  { label: 'Subscribers', value: '12,847', change: '+1.2K', color: 'text-purple-400' },
                  { label: 'Conversion Rate', value: '4.8%', change: '+0.6%', color: 'text-orange-400' },
                ].map((stat, i) => (
                  <div key={i} className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/50">
                    <div className="text-xs text-slate-500 mb-1">{stat.label}</div>
                    <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs text-green-400 mt-1">{stat.change} this month</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 p-4 bg-slate-800/60 rounded-xl border border-slate-700/50">
                  <div className="text-xs text-slate-400 mb-3">Revenue Overview</div>
                  <div className="flex items-end gap-1 h-24">
                    {[40, 65, 45, 80, 55, 90, 70, 95, 60, 85, 75, 100].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t bg-gradient-to-t from-blue-600 to-blue-400 opacity-80 hover:opacity-100 transition-opacity"
                        style={{ height: `${h}%` }}
                      ></div>
                    ))}
                  </div>
                </div>
                <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/50">
                  <div className="text-xs text-slate-400 mb-3">Top Funnels</div>
                  <div className="space-y-2">
                    {['Product Launch', 'Webinar Reg.', 'Lead Magnet'].map((funnel, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                            style={{ width: `${[85, 62, 45][i]}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-slate-400">{[85, 62, 45][i]}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Glow effect */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none"></div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center mt-12">
          <div className="flex flex-col items-center gap-2 text-slate-500 animate-bounce">
            <span className="text-xs">Scroll to explore</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </section>

      {/* Logos / Social Proof */}
      <section className="py-12 px-4 border-y border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-slate-500 text-sm mb-8">Trusted by teams at leading companies</p>
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-40">
            {['Stripe', 'Shopify', 'HubSpot', 'Mailchimp', 'Zapier', 'Cloudflare'].map((brand, i) => (
              <div key={i} className="text-slate-300 font-bold text-lg tracking-wide">{brand}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-sm">
            <AnimatedStat value={50} suffix="K+" label="Active Users" color="text-blue-400" />
            <AnimatedStat value={2} suffix="B+" label="Sales Generated" color="text-purple-400" />
            <AnimatedStat value={1} suffix="M+" label="Funnels Created" color="text-pink-400" />
            <AnimatedStat value={99} suffix=".9%" label="Uptime SLA" color="text-green-400" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-400 text-sm font-semibold mb-4">
              Everything You Need
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              One Platform.
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Infinite Possibilities.</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Replace your entire tech stack with TechyPark Engine. From funnels to servers, we've got you covered.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <FeatureCard key={idx} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Launch in 3 Simple Steps</h2>
            <p className="text-slate-400">Get your business online and converting in minutes, not months.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Sign Up Free', description: 'Create your account in seconds. No credit card required. Start with our generous free plan.', icon: Rocket, color: 'from-blue-500 to-cyan-500' },
              { step: '02', title: 'Build Your Funnel', description: 'Use our drag-and-drop builder to create stunning funnels from 100+ proven templates.', icon: Zap, color: 'from-purple-500 to-pink-500' },
              { step: '03', title: 'Launch & Scale', description: 'Go live with one click. Watch your conversions soar with real-time analytics and automation.', icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
            ].map((step, i) => {
              const [ref, inView] = useInView(0.2);
              return (
                <div
                  key={i}
                  ref={ref}
                  className={`relative text-center transition-all duration-700 ${
                    inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  {i < 2 && (
                    <div className="hidden md:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-slate-600 to-transparent z-0"></div>
                  )}
                  <div className={`relative z-10 w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-2xl`}>
                    <step.icon className="w-10 h-10 text-white" />
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-sm font-semibold mb-4">
              Real Results
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Loved by Entrepreneurs Worldwide</h2>
            <div className="flex items-center justify-center gap-2 text-slate-400">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
              </div>
              <span className="text-sm">4.9/5 from 2,400+ reviews</span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Connects with Your Favorite Tools</h2>
          <p className="text-slate-400 mb-12">500+ integrations available. Connect in seconds, no code required.</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {integrations.map((app, i) => (
              <div
                key={i}
                className="p-4 bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-300 text-sm font-medium hover:border-blue-500/50 hover:bg-slate-800 transition-all duration-200 hover:-translate-y-0.5"
              >
                {app}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-slate-400">Start free. Upgrade when you're ready. No hidden fees, ever.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Starter', price: 'Free', desc: 'Perfect for getting started', features: ['Up to 3 funnels', '100 contacts', 'Basic analytics', 'Email support'], cta: 'Get Started Free', highlight: false },
              { name: 'Professional', price: '$97', desc: 'For growing businesses', features: ['Unlimited funnels', 'Unlimited contacts', 'Advanced analytics', 'Priority support', 'A/B testing', 'Email marketing'], cta: 'Start Free Trial', highlight: true },
              { name: 'Enterprise', price: 'Custom', desc: 'For large teams', features: ['Everything in Pro', 'Dedicated manager', '24/7 phone support', 'Custom integrations', 'White-label options', 'SLA guarantee'], cta: 'Contact Sales', highlight: false },
            ].map((plan, i) => (
              <div
                key={i}
                className={`relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 ${
                  plan.highlight
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600 shadow-2xl shadow-blue-500/30 scale-105'
                    : 'bg-slate-800/60 border border-slate-700/50 hover:border-slate-600'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full text-xs font-bold text-slate-900">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <p className={`text-sm mb-4 ${plan.highlight ? 'text-blue-100' : 'text-slate-400'}`}>{plan.desc}</p>
                <div className={`text-4xl font-bold mb-1 ${plan.highlight ? 'text-white' : 'text-blue-400'}`}>
                  {plan.price}
                  {plan.price !== 'Free' && plan.price !== 'Custom' && <span className="text-lg text-slate-300">/mo</span>}
                </div>
                <div className={`text-xs mb-6 ${plan.highlight ? 'text-blue-200' : 'text-slate-500'}`}>
                  {plan.price !== 'Custom' ? 'Billed monthly' : 'Contact for pricing'}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className={`flex items-center gap-2 text-sm ${plan.highlight ? 'text-white' : 'text-slate-300'}`}>
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? 'text-white' : 'text-green-400'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/login')}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 ${
                    plan.highlight
                      ? 'bg-white text-blue-600 hover:bg-slate-100 shadow-lg'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a href="/pricing" className="text-blue-400 hover:text-blue-300 text-sm flex items-center justify-center gap-1">
              View full pricing comparison <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
            <div className="relative p-12 text-center">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                Ready to Scale Your Business?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join 50,000+ entrepreneurs using TechyPark Engine to build profitable funnels and grow their business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/login')}
                  className="group px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-slate-100 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 shadow-xl"
                >
                  Start Your Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-200">
                  Schedule a Demo
                </button>
              </div>
              <p className="text-blue-200 text-sm mt-6">No credit card required • 14-day free trial • Cancel anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Rocket className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white">TechyPark Engine</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                The all-in-one platform for entrepreneurs who want to build, launch, and scale their online business.
              </p>
              <div className="flex gap-3">
                {['Twitter', 'LinkedIn', 'YouTube'].map((social, i) => (
                  <button key={i} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs rounded-lg transition-colors">
                    {social}
                  </button>
                ))}
              </div>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Integrations', 'Changelog', 'Roadmap'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press', 'Contact'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR', 'Security'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-semibold text-white mb-4 text-sm">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">&copy; 2026 TechyPark Engine. All rights reserved.</p>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
