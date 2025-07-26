import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Star, Zap, Crown, Shield, ArrowLeft } from 'lucide-react';
import Header from './Header';

const MembershipPlans = () => {
  const plans = [
    {
      name: 'Starter',
      price: 49,
      period: 'month',
      description: 'Perfect for beginners starting their prop firm journey',
      icon: <Shield className="w-8 h-8" />,
      color: 'border-gray-600',
      bgColor: 'bg-gray-800',
      buttonColor: 'bg-gray-600 hover:bg-gray-700',
      features: [
        'Support for 5 major prop firms',
        'Basic trading plan generation',
        'Standard risk management tools',
        'Email support',
        'Phase tracking dashboard',
        'Basic signal alerts'
      ]
    },
    {
      name: 'Professional',
      price: 99,
      period: 'month',
      description: 'Most popular choice for serious traders',
      icon: <Star className="w-8 h-8" />,
      color: 'border-blue-500',
      bgColor: 'bg-blue-500/10',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      popular: true,
      features: [
        'Support for 15+ prop firms',
        'Advanced custom trading plans',
        'Professional risk management',
        'Priority email & chat support',
        'Real-time phase tracking',
        'Premium signal alerts',
        'Downloadable trading plans',
        'Performance analytics'
      ]
    },
    {
      name: 'Elite',
      price: 199,
      period: 'month',
      description: 'Advanced features for professional traders',
      icon: <Zap className="w-8 h-8" />,
      color: 'border-yellow-500',
      bgColor: 'bg-yellow-500/10',
      buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
      features: [
        'Support for 25+ prop firms',
        'AI-powered trading plans',
        'Advanced risk optimization',
        'Priority support + phone calls',
        'Real-time signal delivery',
        'Custom lot size calculations',
        'Multi-account management',
        'Advanced analytics dashboard',
        'Personal trading coach (monthly call)'
      ]
    },
    {
      name: 'Enterprise',
      price: 399,
      period: 'month',
      description: 'Ultimate solution for trading teams',
      icon: <Crown className="w-8 h-8" />,
      color: 'border-purple-500',
      bgColor: 'bg-purple-500/10',
      buttonColor: 'bg-purple-600 hover:bg-purple-700',
      features: [
        'All prop firms supported',
        'Custom strategy development',
        'Team management features',
        'Dedicated account manager',
        'White-label solutions',
        'API access',
        'Custom integrations',
        'Weekly strategy sessions',
        '24/7 priority support'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <Header />
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <Link to="/" className="inline-flex items-center space-x-2 text-blue-500 hover:text-blue-400 mb-8">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Choose Your Plan</h1>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
              Select the perfect plan to accelerate your prop firm success with our professional clearing service.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl border-2 ${plan.color} ${plan.bgColor} backdrop-blur-sm p-8 ${
                  plan.popular ? 'transform scale-105 shadow-2xl' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className="text-blue-500 mb-4 flex justify-center">
                    {plan.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-white">${plan.price}</span>
                    <span className="text-gray-400">/{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <Check className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/payment"
                  state={{ selectedPlan: { name: plan.name, price: plan.price, period: plan.period } }}
                  className={`w-full ${plan.buttonColor} text-white py-3 rounded-lg font-semibold transition-colors text-center block`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Which prop firms do you support?</h3>
                  <p className="text-gray-400">We support 25+ major prop firms including FTMO, MyForexFunds, The5%ers, FundedNext, and many more.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Can I change plans anytime?</h3>
                  <p className="text-gray-400">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">What's included in the trading plan?</h3>
                  <p className="text-gray-400">Custom trading plans include risk management rules, position sizing, phase-specific strategies, and downloadable PDFs.</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">How accurate are the signals?</h3>
                  <p className="text-gray-400">Our signals are designed for prop firm compliance with focus on risk management rather than just profitability.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Do you offer refunds?</h3>
                  <p className="text-gray-400">We offer a 30-day money-back guarantee if you're not satisfied with our service.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Is there setup assistance?</h3>
                  <p className="text-gray-400">Yes, all plans include setup assistance and our support team helps you configure your trading plan.</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-blue-600/20 to-gray-800/50 rounded-2xl p-12 border border-gray-700">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Clear Your Challenge?</h2>
              <p className="text-lg text-gray-400 mb-8">
                Join thousands of successful traders who achieved funded account status with our service.
              </p>
              <Link
                to="/payment"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-colors inline-flex items-center space-x-2 shadow-lg"
              >
                <span>Start Your Journey</span>
                <Star className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipPlans;
