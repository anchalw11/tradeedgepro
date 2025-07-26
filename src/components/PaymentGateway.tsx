import React, { useState, useEffect } from 'react';
import { CreditCard, Bitcoin, Shield, Lock, CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface PaymentGatewayProps {
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: string) => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ onPaymentSuccess, onPaymentError }) => {
  const [selectedMethod, setSelectedMethod] = useState<'stripe' | 'coingate'>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(99);
  const [currency, setCurrency] = useState('USD');

  // Stripe integration
  const processStripePayment = async (paymentData: any) => {
    try {
      setIsProcessing(true);
      
      // In production, you would load Stripe.js and create payment intent
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: paymentAmount * 100, // Convert to cents
          currency: currency.toLowerCase(),
          payment_method_types: ['card'],
          metadata: {
            service: 'TraderEdge Pro Subscription',
            user_id: 'current_user_id'
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { client_secret } = await response.json();
      
      // Simulate successful payment for demo
      setTimeout(() => {
        const successData = {
          payment_id: 'pi_' + Math.random().toString(36).substr(2, 9),
          amount: paymentAmount,
          currency,
          method: 'stripe',
          status: 'succeeded',
          timestamp: new Date().toISOString()
        };
        
        onPaymentSuccess(successData);
        setIsProcessing(false);
      }, 2000);

    } catch (error) {
      console.error('Stripe payment error:', error);
      onPaymentError('Stripe payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  // Coingate integration
  const processCoinGatePayment = async () => {
    try {
      setIsProcessing(true);
      
      // In production, you would integrate with Coingate API
      const response = await fetch('/api/coingate/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id: 'order_' + Date.now(),
          price_amount: paymentAmount,
          price_currency: currency,
          receive_currency: 'EUR', // Your preferred receive currency
          title: 'TraderEdge Pro Subscription',
          description: 'Professional trading signals and prop firm guidance',
          callback_url: window.location.origin + '/payment/callback',
          cancel_url: window.location.origin + '/payment/cancel',
          success_url: window.location.origin + '/payment/success',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create Coingate order');
      }

      const orderData = await response.json();
      
      // Simulate successful payment for demo
      setTimeout(() => {
        const successData = {
          payment_id: 'cg_' + Math.random().toString(36).substr(2, 9),
          amount: paymentAmount,
          currency,
          method: 'coingate',
          status: 'paid',
          timestamp: new Date().toISOString(),
          crypto_amount: (paymentAmount / 45000).toFixed(8), // Simulated BTC amount
          crypto_currency: 'BTC'
        };
        
        onPaymentSuccess(successData);
        setIsProcessing(false);
      }, 3000);

    } catch (error) {
      console.error('Coingate payment error:', error);
      onPaymentError('Cryptocurrency payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    if (selectedMethod === 'stripe') {
      await processStripePayment({});
    } else {
      await processCoinGatePayment();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Secure Payment</h2>
          <p className="text-gray-400">Choose your preferred payment method</p>
        </div>

        {/* Payment Method Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setSelectedMethod('stripe')}
            className={`p-6 rounded-xl border-2 transition-all ${
              selectedMethod === 'stripe'
                ? 'border-blue-500 bg-blue-500/20'
                : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
            }`}
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <CreditCard className={`w-8 h-8 ${selectedMethod === 'stripe' ? 'text-blue-400' : 'text-gray-400'}`} />
              <span className="text-white font-semibold text-lg">Stripe</span>
            </div>
            <p className="text-sm text-gray-400 mb-2">Credit/Debit Cards</p>
            <p className="text-xs text-gray-500">Visa, MasterCard, American Express</p>
            <div className="mt-3 flex items-center justify-center space-x-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-xs text-green-400">SSL Secured</span>
            </div>
          </button>

          <button
            onClick={() => setSelectedMethod('coingate')}
            className={`p-6 rounded-xl border-2 transition-all ${
              selectedMethod === 'coingate'
                ? 'border-orange-500 bg-orange-500/20'
                : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
            }`}
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Bitcoin className={`w-8 h-8 ${selectedMethod === 'coingate' ? 'text-orange-400' : 'text-gray-400'}`} />
              <span className="text-white font-semibold text-lg">Coingate</span>
            </div>
            <p className="text-sm text-gray-400 mb-2">Cryptocurrency</p>
            <p className="text-xs text-gray-500">Bitcoin, Ethereum, USDT, 70+ coins</p>
            <div className="mt-3 flex items-center justify-center space-x-2">
              <Lock className="w-4 h-4 text-orange-400" />
              <span className="text-xs text-orange-400">Blockchain Secured</span>
            </div>
          </button>
        </div>

        {/* Payment Amount */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-300 mb-3">Payment Amount</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                min="1"
                step="0.01"
              />
            </div>
            <div>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="CAD">CAD</option>
                <option value="AUD">AUD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        {selectedMethod === 'stripe' && (
          <div className="mb-8 p-4 bg-blue-600/20 border border-blue-600 rounded-lg">
            <div className="flex items-center space-x-2 text-blue-400 mb-2">
              <CreditCard className="w-5 h-5" />
              <span className="font-semibold">Stripe Payment</span>
            </div>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Instant processing</li>
              <li>• 3D Secure authentication</li>
              <li>• PCI DSS compliant</li>
              <li>• Supports all major cards</li>
            </ul>
          </div>
        )}

        {selectedMethod === 'coingate' && (
          <div className="mb-8 p-4 bg-orange-600/20 border border-orange-600 rounded-lg">
            <div className="flex items-center space-x-2 text-orange-400 mb-2">
              <Bitcoin className="w-5 h-5" />
              <span className="font-semibold">Cryptocurrency Payment</span>
            </div>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• 70+ supported cryptocurrencies</li>
              <li>• Real-time exchange rates</li>
              <li>• Blockchain confirmation</li>
              <li>• Lower transaction fees</li>
            </ul>
          </div>
        )}

        {/* Security Notice */}
        <div className="mb-8 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
          <div className="flex items-center space-x-2 text-green-400 mb-2">
            <Shield className="w-5 h-5" />
            <span className="font-semibold">Security Guarantee</span>
          </div>
          <p className="text-sm text-gray-300">
            Your payment information is encrypted and secure. We use industry-standard security 
            measures and never store your payment details.
          </p>
        </div>

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 shadow-lg"
        >
          {isProcessing ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Processing Payment...</span>
            </>
          ) : (
            <>
              {selectedMethod === 'stripe' ? (
                <CreditCard className="w-5 h-5" />
              ) : (
                <Bitcoin className="w-5 h-5" />
              )}
              <span>
                Pay {currency} {paymentAmount} with {selectedMethod === 'stripe' ? 'Card' : 'Crypto'}
              </span>
            </>
          )}
        </button>

        {/* Payment Methods Logos */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400 mb-3">Powered by</p>
          <div className="flex items-center justify-center space-x-6">
            <div className="text-blue-500 font-bold text-lg">stripe</div>
            <div className="text-orange-500 font-bold text-lg">CoinGate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;