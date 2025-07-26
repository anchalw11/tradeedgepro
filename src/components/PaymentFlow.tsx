import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TrendingUp, ArrowLeft } from 'lucide-react';
import PaymentIntegration from './PaymentIntegration';
import { useUser } from '../contexts/UserContext';
import axios from 'axios';

const PaymentFlow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useUser();
  
  // Get selected plan from location state or default
  const selectedPlan = location.state?.selectedPlan || {
    name: 'Professional',
    price: 99,
    period: 'month'
  };

  const handlePaymentComplete = async () => {
    // Update user with premium membership
    if (user) {
      const newMembershipTier = selectedPlan.name.toLowerCase();
      setUser({
        ...user,
        membershipTier: newMembershipTier as 'basic' | 'professional' | 'institutional' | 'elite'
      });

      if (newMembershipTier === 'enterprise') {
        try {
          const response = await axios.post('http://127.0.0.1:5000/api/auth/register', {
            username: user.name,
            email: user.email,
            password: 'dummyPassword', // In a real app, this would be handled securely
            plan_type: 'enterprise'
          });
          const { access_token } = response.data;
          localStorage.setItem('journalAuthToken', access_token);
          setUser({
            ...user,
            membershipTier: newMembershipTier as 'basic' | 'professional' | 'institutional' | 'elite' | 'enterprise',
            journalLink: 'http://localhost:5173/journal'
          });
        } catch (error) {
          console.error('Failed to register user for journal access:', error);
          // Handle error appropriately
        }
      }
    }
    
    // Navigate to prop firm selection
    navigate('/setup/prop-firm');
  };

  const handleSkipPayment = () => {
    // Allow users to skip payment and use free trial
    navigate('/setup/prop-firm');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-blue-400" />
              <h1 className="text-2xl font-bold text-white">TraderEdge Pro</h1>
            </div>
          </div>

          <div className="text-right">
            <div className="text-white font-semibold">Complete Your Setup</div>
            <div className="text-sm text-gray-400">Step 2 of 2</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Complete Your Subscription
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Get instant access to all premium features and start your trading journey
            </p>
          </div>

          {/* Payment Integration */}
          <PaymentIntegration 
            selectedPlan={selectedPlan}
            onPaymentComplete={handlePaymentComplete}
          />

          {/* Skip Payment Option */}
          <div className="text-center mt-8">
            <button
              onClick={handleSkipPayment}
              className="text-gray-400 hover:text-blue-400 transition-colors text-sm underline hidden"
            >
              Continue without payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFlow;
