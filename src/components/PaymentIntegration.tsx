import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Bitcoin, Building, Check, Shield, Lock, AlertCircle, AlertTriangle } from 'lucide-react';

// Type declarations for window properties
declare global {
  interface Window {
    ApplePaySession: any;
    google: any;
  }
}

interface PaymentIntegrationProps {
  selectedPlan: {
    name: string;
    price: number;
    period: string;
  };
  onPaymentComplete: () => void;
}

const PaymentIntegration: React.FC<PaymentIntegrationProps> = ({ selectedPlan, onPaymentComplete }) => {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showCryptoVerification, setShowCryptoVerification] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [verificationData, setVerificationData] = useState({
    transactionHash: '',
    screenshot: null as File | null,
    amount: '',
    fromAddress: ''
  });
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    email: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Visa, MasterCard, American Express',
      fees: 'No additional fees',
      enabled: true
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: <Shield className="w-6 h-6" />,
      description: 'Pay with your PayPal account',
      fees: 'No additional fees',
      enabled: true
    },
    {
      id: 'stripe',
      name: 'Stripe Checkout',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Secure payment processing',
      fees: 'No additional fees',
      enabled: true
    },
    {
      id: 'apple',
      name: 'Apple Pay',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'Quick and secure payment',
      fees: 'No additional fees',
      enabled: true
    },
    {
      id: 'google',
      name: 'Google Pay',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'Pay with Google Pay',
      fees: 'No additional fees',
      enabled: true
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      icon: <Bitcoin className="w-6 h-6" />,
      description: 'Ethereum (ETH), Solana (SOL)',
      fees: 'Manual verification required',
      enabled: true
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: <Building className="w-6 h-6" />,
      description: 'Direct bank transfer',
      fees: '2-3 business days',
      enabled: true
    }
  ];

  // Card number formatting
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Expiry date formatting
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  // Card validation
  const validateCard = () => {
    const errors = [];
    
    if (!formData.cardNumber.replace(/\s/g, '') || formData.cardNumber.replace(/\s/g, '').length < 13) {
      errors.push('Valid card number is required');
    }
    
    if (!formData.expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
      errors.push('Valid expiry date is required (MM/YY)');
    }
    
    if (!formData.cvv || formData.cvv.length < 3) {
      errors.push('Valid CVV is required');
    }
    
    if (!formData.cardName.trim()) {
      errors.push('Cardholder name is required');
    }
    
    return errors;
  };

  // Stripe Payment Processing
  const processStripePayment = async () => {
    try {
      // In a real implementation, you would:
      // 1. Load Stripe.js
      // 2. Create payment intent on your backend
      // 3. Confirm payment with Stripe
      
      console.log("Simulating Stripe payment...");
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      
      // Simulate successful payment for demo
      return { success: true, paymentIntent: { id: 'pi_' + Math.random().toString(36).substr(2, 9) } };
    } catch (error) {
      console.error('Stripe payment error:', error);
      return { success: false, error: 'Payment processing failed' };
    }
  };

  // PayPal Payment Processing
  const processPayPalPayment = async () => {
    try {
      // In a real implementation, you would integrate PayPal SDK
      // Create order and capture payment
      
      console.log("Simulating PayPal payment...");
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

      // Simulate successful payment for demo
      return { success: true, orderId: 'paypal_' + Math.random().toString(36).substr(2, 9) };
    } catch (error) {
      console.error('PayPal payment error:', error);
      return { success: false, error: 'PayPal payment failed' };
    }
  };

  // Cryptocurrency Payment Processing
  const processCryptoPayment = async () => {
    try {
      // Show crypto verification page instead of processing immediately
      setShowCryptoVerification(true);
      return { success: false, showVerification: true };
    } catch (error) {
      console.error('Crypto payment error:', error);
      return { success: false, error: 'Crypto payment failed' };
    }
  };

  // Apple Pay Processing
  const processApplePay = async () => {
    try {
      if (!window.ApplePaySession || !window.ApplePaySession.canMakePayments()) {
        // Even if Apple Pay is not available, we'll simulate success for the demo.
        console.log("Apple Pay not available, simulating success for demo.");
      }

      console.log("Simulating Apple Pay payment...");
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

      // Simulate successful payment for demo
      return { success: true, paymentId: 'apple_' + Math.random().toString(36).substr(2, 9) };
    } catch (error) {
      console.error('Apple Pay error:', error);
      return { success: false, error: 'Apple Pay failed' };
    }
  };

  // Google Pay Processing
  const processGooglePay = async () => {
    try {
      // In a real implementation, you would integrate Google Pay API
      console.log("Simulating Google Pay payment...");
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

      // Simulate successful payment for demo
      return { success: true, paymentId: 'google_' + Math.random().toString(36).substr(2, 9) };
    } catch (error) {
      console.error('Google Pay error:', error);
      return { success: false, error: 'Google Pay failed' };
    }
  };

  // Bank Transfer Processing
  const processBankTransfer = async () => {
    try {
      // In a real implementation, you would integrate with bank transfer services
      // like Plaid, Yodlee, or direct ACH processing
      
      console.log("Simulating Bank Transfer...");
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

      // Simulate successful initiation for demo
      return { success: true, transferId: 'bank_' + Math.random().toString(36).substr(2, 9) };
    } catch (error) {
      console.error('Bank transfer error:', error);
      return { success: false, error: 'Bank transfer failed' };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
      let paymentResult;

      // Validate card details for card payments
      if (selectedMethod === 'card' || selectedMethod === 'stripe') {
        const validationErrors = validateCard();
        if (validationErrors.length > 0) {
          setError(validationErrors.join(', '));
          setIsProcessing(false);
          return;
        }
      }

      // Process payment based on selected method
      switch (selectedMethod) {
        case 'card':
        case 'stripe':
          paymentResult = await processStripePayment();
          break;
        case 'paypal':
          paymentResult = await processPayPalPayment();
          break;
        case 'crypto':
          paymentResult = await processCryptoPayment();
          break;
        case 'apple':
          paymentResult = await processApplePay();
          break;
        case 'google':
          paymentResult = await processGooglePay();
          break;
        case 'bank':
          paymentResult = await processBankTransfer();
          break;
        default:
          throw new Error('Invalid payment method');
      }

      if ((paymentResult as any).success) {
        setPaymentSuccess(true);
        
        // Store payment details
        localStorage.setItem('payment_details', JSON.stringify({
          method: selectedMethod,
          amount: selectedPlan.price,
          plan: selectedPlan.name,
          paymentId: (paymentResult as any).paymentIntent?.id || (paymentResult as any).orderId || (paymentResult as any).paymentId,
          timestamp: new Date().toISOString()
        }));

        // Call success callback after 2 seconds
        setTimeout(() => {
          onPaymentComplete();
        }, 2000);
      } else if ((paymentResult as any).showVerification) {
        // Don't show error for crypto verification flow
        return;
      } else {
        setError((paymentResult as any).error || 'Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    let processedValue = value;
    
    // Format card number
    if (field === 'cardNumber') {
      processedValue = formatCardNumber(value);
    }
    
    // Format expiry date
    if (field === 'expiryDate') {
      processedValue = formatExpiryDate(value);
    }
    
    // Limit CVV to 4 digits
    if (field === 'cvv') {
      processedValue = value.replace(/[^0-9]/g, '').substring(0, 4);
    }

    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as any,
          [child]: processedValue
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: processedValue }));
    }
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const cryptoAddresses = {
    ETH: {
      address: '0x461bBf1B66978fE97B1A2bcEc52FbaB6aEDDF256',
      name: 'Ethereum (ETH)',
      network: 'Ethereum Mainnet',
      symbol: 'ETH'
    },
    SOL: {
      address: 'GZGsfmqx6bAYdXiVQs3QYfPFPjyfQggaMtBp5qm5R7r3',
      name: 'Solana (SOL)',
      network: 'Solana Mainnet',
      symbol: 'SOL'
    }
  };

  const handleCryptoSelection = (crypto: string) => {
    setSelectedCrypto(crypto);
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
      // Validate verification data
      if (!verificationData.transactionHash.trim()) {
        throw new Error('Transaction hash is required');
      }
      
      if (!verificationData.amount || parseFloat(verificationData.amount) <= 0) {
        throw new Error('Valid amount is required');
      }

      // Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Store verification details
      localStorage.setItem('crypto_verification', JSON.stringify({
        crypto: selectedCrypto,
        address: cryptoAddresses[selectedCrypto as keyof typeof cryptoAddresses].address,
        transactionHash: verificationData.transactionHash,
        amount: verificationData.amount,
        fromAddress: verificationData.fromAddress,
        screenshot: verificationData.screenshot?.name,
        timestamp: new Date().toISOString(),
        status: 'pending_verification'
      }));

      setPaymentSuccess(true);
      
      // Call success callback after showing success message
      setTimeout(() => {
        onPaymentComplete();
      }, 2000);

    } catch (error: any) {
      setError(error.message || 'Verification failed. Please check your details.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Screenshot file size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file');
        return;
      }
      setVerificationData(prev => ({ ...prev, screenshot: file }));
      setError('');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  // Crypto Verification Page
  if (showCryptoVerification) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">₿</div>
            <h2 className="text-2xl font-bold text-white mb-4">Cryptocurrency Payment</h2>
            <p className="text-gray-400">
              Send payment to one of our crypto addresses and verify your transaction
            </p>
          </div>

          {!selectedCrypto ? (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white text-center mb-6">Select Cryptocurrency</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(cryptoAddresses).map(([key, crypto]) => (
                  <button
                    key={key}
                    onClick={() => handleCryptoSelection(key)}
                    className="p-6 bg-gray-700 hover:bg-gray-600 rounded-xl border border-gray-600 hover:border-blue-500 transition-all text-left"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{crypto.symbol}</span>
                      </div>
                      <div>
                        <div className="text-white font-semibold">{crypto.name}</div>
                        <div className="text-gray-400 text-sm">{crypto.network}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Payment Instructions */}
              <div className="bg-blue-600/20 border border-blue-600 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-400 mb-4">Payment Instructions</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Send {cryptoAddresses[selectedCrypto as keyof typeof cryptoAddresses].symbol} to this address:
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={cryptoAddresses[selectedCrypto as keyof typeof cryptoAddresses].address}
                        readOnly
                        className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white font-mono text-sm"
                      />
                      <button
                        onClick={() => copyToClipboard(cryptoAddresses[selectedCrypto as keyof typeof cryptoAddresses].address)}
                        className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-400">Amount:</span>
                      <span className="text-white font-semibold ml-2">${selectedPlan.price} USD equivalent</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Network:</span>
                      <span className="text-white font-semibold ml-2">
                        {cryptoAddresses[selectedCrypto as keyof typeof cryptoAddresses].network}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verification Form */}
              <form onSubmit={handleVerificationSubmit} className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Verify Your Payment</h3>
                
                {error && (
                  <div className="p-4 bg-red-600/20 border border-red-600 rounded-lg flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <span className="text-red-400 text-sm">{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Transaction Hash *
                    </label>
                    <input
                      type="text"
                      value={verificationData.transactionHash}
                      onChange={(e) => setVerificationData(prev => ({ ...prev, transactionHash: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter transaction hash"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Amount Sent (USD) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={verificationData.amount}
                      onChange={(e) => setVerificationData(prev => ({ ...prev, amount: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500"
                      placeholder={selectedPlan.price.toString()}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Wallet Address (Optional)
                  </label>
                  <input
                    type="text"
                    value={verificationData.fromAddress}
                    onChange={(e) => setVerificationData(prev => ({ ...prev, fromAddress: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Your sending wallet address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Transaction Screenshot (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer"
                  />
                  {verificationData.screenshot && (
                    <p className="text-sm text-green-400 mt-2">
                      ✓ {verificationData.screenshot.name} uploaded
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">Max file size: 5MB</p>
                </div>

                <div className="bg-yellow-600/20 border border-yellow-600 rounded-xl p-4">
                  <div className="flex items-center space-x-2 text-yellow-400 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="font-medium">Important Notes</span>
                  </div>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Send the exact USD equivalent amount in {cryptoAddresses[selectedCrypto as keyof typeof cryptoAddresses].symbol}</li>
                    <li>• Use the correct network ({cryptoAddresses[selectedCrypto as keyof typeof cryptoAddresses].network})</li>
                    <li>• Verification may take 1-24 hours</li>
                    <li>• You'll receive email confirmation once verified</li>
                  </ul>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCrypto('');
                      setVerificationData({ transactionHash: '', screenshot: null, amount: '', fromAddress: '' });
                    }}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition-colors"
                  >
                    Back to Selection
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <span>Submit for Verification</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }
  if (paymentSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-4">Payment Successful!</h2>
          <p className="text-gray-400 mb-6">
            Welcome to TraderEdge Pro {selectedPlan.name}! Your account is being set up.
          </p>
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 sticky top-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Order Summary</h3>
              <button
                onClick={() => navigate('/membership')}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Change
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">{selectedPlan.name}</span>
                <span className="text-white font-medium">${selectedPlan.price}/{selectedPlan.period}</span>
              </div>
              
              <div className="border-t border-gray-600 pt-4">
                <div className="flex justify-between">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-white font-bold">${selectedPlan.price}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-600/20 border border-blue-600 rounded-xl">
              <div className="flex items-center space-x-2 text-blue-400 mb-2">
                <Check className="w-4 h-4" />
                <span className="font-medium">What's Included</span>
              </div>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Full access to all features</li>
                <li>• Unlimited trading signals</li>
                <li>• Custom trading plans</li>
                <li>• 30-day money-back guarantee</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Payment Method</h3>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-600/20 border border-red-600 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            )}

            {/* Payment Method Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  disabled={!method.enabled}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    selectedMethod === method.id
                      ? 'border-blue-500 bg-blue-500/20'
                      : method.enabled 
                        ? 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                        : 'border-gray-700 bg-gray-800 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={selectedMethod === method.id ? 'text-blue-400' : 'text-gray-400'}>
                      {method.icon}
                    </div>
                    <span className="text-white font-medium">{method.name}</span>
                  </div>
                  <p className="text-sm text-gray-400">{method.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{method.fees}</p>
                </button>
              ))}
            </div>

            {/* Payment Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {(selectedMethod === 'card' || selectedMethod === 'stripe') && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Card Number</label>
                      <input
                        type="text"
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Expiry Date</label>
                      <input
                        type="text"
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">CVV</label>
                      <input
                        type="text"
                        value={formData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="123"
                        maxLength={4}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Cardholder Name</label>
                      <input
                        type="text"
                        value={formData.cardName}
                        onChange={(e) => handleInputChange('cardName', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {selectedMethod === 'paypal' && (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">💳</div>
                  <p className="text-gray-400">You'll be redirected to PayPal to complete your payment</p>
                </div>
              )}

              {selectedMethod === 'crypto' && (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">₿</div>
                  <p className="text-gray-400 mb-4">Pay with Ethereum (ETH) or Solana (SOL)</p>
                  <p className="text-sm text-gray-500">Manual verification required after payment</p>
                </div>
              )}

              {selectedMethod === 'apple' && (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🍎</div>
                  <p className="text-gray-400">Use Touch ID or Face ID to complete your payment</p>
                </div>
              )}

              {selectedMethod === 'google' && (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🟢</div>
                  <p className="text-gray-400">Complete your payment with Google Pay</p>
                </div>
              )}

              {selectedMethod === 'bank' && (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🏦</div>
                  <p className="text-gray-400 mb-4">Direct bank transfer</p>
                  <p className="text-sm text-gray-500">Processing takes 2-3 business days</p>
                </div>
              )}

              {/* Security Notice */}
              <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
                <div className="flex items-center space-x-2 text-blue-400 mb-2">
                  <Lock className="w-4 h-4" />
                  <span className="font-medium">Secure Payment</span>
                </div>
                <p className="text-sm text-gray-400">
                  Your payment information is encrypted and secure. We use industry-standard SSL encryption 
                  and never store your payment details.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <span>
                    {selectedMethod === 'bank' ? 'Initiate Bank Transfer' : 
                     selectedMethod === 'crypto' ? 'Pay with Crypto' :
                     'Complete Purchase'}
                  </span>
                )}
              </button>

              <p className="text-center text-sm text-gray-400">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentIntegration;
