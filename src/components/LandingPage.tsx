import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Shield, 
  Target, 
  Users, 
  BarChart3, 
  CheckCircle, 
  Star, 
  ArrowRight,
  Award,
  Clock,
  DollarSign,
  Zap
} from 'lucide-react';
import Header from './Header';

const LandingPage = () => {
  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Prop Firm Mastery",
      description: "Expert guidance for FTMO, MyForexFunds, The5%ers, and 25+ prop firms with proven success strategies",
      color: "text-blue-400"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Risk Management Excellence",
      description: "Advanced position sizing and drawdown protection tailored to each prop firm's specific rules",
      color: "text-green-400"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Custom Trading Plans",
      description: "Personalized multi-phase trading strategies designed for your account size and risk tolerance",
      color: "text-purple-400"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-Time Signals",
      description: "Professional-grade trading signals with precise entry, stop loss, and take profit levels",
      color: "text-yellow-400"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Phase Tracking",
      description: "Complete progress monitoring through challenge phases to live funded account status",
      color: "text-red-400"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert Support",
      description: "Dedicated support team with extensive prop firm experience and proven track record",
      color: "text-cyan-400"
    }
  ];

  const processSteps = [
    {
      step: 1,
      title: "Select Your Prop Firm",
      description: "Choose from 25+ supported prop firms with automatic rule extraction",
      icon: <Target className="w-6 h-6" />
    },
    {
      step: 2,
      title: "Configure Account",
      description: "Set your account size and challenge type (1-step, 2-step, instant funding)",
      icon: <DollarSign className="w-6 h-6" />
    },
    {
      step: 3,
      title: "Risk Parameters",
      description: "Define your risk percentage and reward ratios for optimal position sizing",
      icon: <Shield className="w-6 h-6" />
    },
    {
      step: 4,
      title: "Custom Trading Plan",
      description: "Receive a detailed, downloadable trading plan tailored to your setup",
      icon: <BarChart3 className="w-6 h-6" />
    },
    {
      step: 5,
      title: "Live Dashboard",
      description: "Track progress, receive signals, and monitor your funded account journey",
      icon: <TrendingUp className="w-6 h-6" />
    }
  ];

  const stats = [
    { number: "2,847", label: "Funded Accounts", description: "Successfully cleared" },
    { number: "94.7%", label: "Success Rate", description: "Challenge completion" },
    { number: "$12.8M", label: "Total Funded", description: "Across all prop firms" },
    { number: "25+", label: "Prop Firms", description: "Supported platforms" }
  ];

  const testimonials = [
    {
      name: "Marcus Chen",
      role: "FTMO $200K Funded Trader",
      content: "The custom trading plan was exactly what I needed. Cleared my FTMO challenge in 18 days following their strategy.",
      rating: 5,
      profit: "$47,230",
      image: "MC"
    },
    {
      name: "Sarah Williams",
      role: "MyForexFunds Elite",
      content: "Professional service with detailed risk management. Now managing a $500K funded account thanks to their guidance.",
      rating: 5,
      profit: "$89,450",
      image: "SW"
    },
    {
      name: "David Rodriguez",
      role: "The5%ers Funded",
      content: "The phase tracking and signals helped me stay disciplined. Cleared all phases without any rule violations.",
      rating: 5,
      profit: "$34,680",
      image: "DR"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-purple-600/10"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">
                Professional Prop Firm Clearing Service
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Funded Account</span> Journey
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed">
              Professional clearing service for prop firm challenges with custom trading plans and expert guidance
            </p>
            <p className="text-base text-gray-400 mb-10 max-w-2xl mx-auto">
              Join <span className="text-blue-400 font-semibold">2,847 successful traders</span> who cleared their challenges with our proven methodology.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                to="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-xl hover:shadow-blue-500/25"
              >
                Start Your Journey <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/membership"
                className="border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300"
              >
                View Pricing
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-4 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700">
                  <div className="text-2xl md:text-3xl font-bold text-blue-400 mb-1">{stat.number}</div>
                  <div className="text-white font-medium mb-1">{stat.label}</div>
                  <div className="text-xs text-gray-400">{stat.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Flow */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">5-Step Clearing Process</h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Our proven methodology takes you from prop firm selection to funded account success
            </p>
          </div>
          
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 transform -translate-y-1/2"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {processSteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-gray-800/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300 group hover:transform hover:scale-105">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <span className="text-white font-bold text-xl">{step.step}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Professional-Grade Features</h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Everything you need to successfully clear prop firm challenges and manage funded accounts
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-800/60 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300 group hover:transform hover:scale-105">
                <div className={`${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Success Stories</h2>
            <p className="text-lg text-gray-400 mb-2">Real results from traders who cleared their challenges</p>
            <div className="flex items-center justify-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
              <span className="ml-2 text-gray-300">4.9/5 from 2,847 reviews</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-800/60 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
                <div className="flex mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{testimonial.image}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-400">{testimonial.role}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-bold text-lg">{testimonial.profit}</div>
                    <div className="text-xs text-gray-400">Total Profit</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900/20 via-gray-900/50 to-purple-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-3xl p-12 border border-gray-700">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Clear Your <span className="text-blue-400">Prop Firm Challenge</span>?
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of successful traders who achieved funded account status with our proven methodology.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              <Link
                to="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-blue-500/25"
              >
                Start Your Journey
              </Link>
              <Link
                to="/membership"
                className="border-2 border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300"
              >
                View Pricing
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Custom Trading Plans</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Expert Support</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>30-Day Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-950 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-8 h-8 text-blue-400" />
                <h3 className="text-xl font-bold text-white">FundedFlow Pro</h3>
              </div>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Professional prop firm clearing service helping traders achieve funded account success through proven methodologies and expert guidance.
              </p>
              <div className="flex items-center space-x-4">
                <Award className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300">Trusted by 2,847+ traders worldwide</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Services</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link to="/signup" className="hover:text-blue-400 transition-colors">Get Started</Link></li>
                <li><Link to="/membership" className="hover:text-blue-400 transition-colors">Trading Plans</Link></li>
                <li><Link to="/dashboard" className="hover:text-blue-400 transition-colors">Progress Tracking</Link></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Expert Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Contact Support</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              <p>&copy; 2025 FundedFlow Pro. All rights reserved.</p>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Shield className="w-4 h-4" />
              <span>Trading involves substantial risk. Past performance does not guarantee future results.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;